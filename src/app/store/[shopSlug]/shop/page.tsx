import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStoreProfile } from '@/lib/storefront'
import type { ShopTheme, Product } from '@/types'
import { ShopClient } from './ShopClient'

export const revalidate = 60 // ISR: 1-minute cache window — ultra-fast Edge performance with instant 60s freshness

interface Props {
  params: { shopSlug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = await getStoreProfile(params.shopSlug)

  if (!profile) return { title: 'Store Not Found | ResellerPro' }
  const storeName = profile.business_name || profile.shop_name || 'Store'

  return {
    title: `Shop All Products | ${storeName}`,
    description: `Browse full catalog from ${storeName}. High quality products, easy ordering, Cash on Delivery available.`,
  }
}

export default async function DedicatedShopPage({ params }: Props) {
  const { shopSlug } = params
  const profile = await getStoreProfile(shopSlug)

  if (!profile) return notFound()

  const supabase = await createAdminClient()

  // Fetch active products using select('*') to guarantee query success across DB schemas
  const { data: rawProducts, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  if (productsError) {
    console.error('[SHOP] Products fetch error:', productsError)
  }

  const products: Product[] = (rawProducts || []).map((p: any) => {
    return {
      ...p,
      cost_price: 0,
      profit: 0,
      profit_margin: 0,
      price: p.selling_price,
    }
  })

  // Fetch DB managed categories
  const { data: dbCategories } = await supabase
    .from('categories')
    .select('name')
    .eq('user_id', profile.id)

  const categories = Array.from(
    new Set([
      ...(dbCategories || []).map((c) => c.name),
      ...products.filter((p) => p.category).map((p) => p.category!),
    ])
  ) as string[]

  const theme = profile.shop_theme as ShopTheme | null

  return (
    <Suspense fallback={<div className="min-h-screen bg-white p-8 text-center text-slate-400">Loading shop catalog...</div>}>
      <ShopClient
        profile={profile}
        products={products}
        categories={categories}
        theme={theme}
      />
    </Suspense>
  )
}
