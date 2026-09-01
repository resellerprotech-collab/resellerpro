import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ShopTheme, Product } from '@/types'
import { ShopClient } from './ShopClient'

export const revalidate = 3600 // ISR: 100% cached on Edge/CDN, instant on-demand via revalidatePath

interface Props {
  params: { shopSlug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createAdminClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('shop_name, business_name, shop_description, shop_theme')
    .eq('shop_slug', params.shopSlug)
    .single()

  if (!profile) return { title: 'Store Not Found | ResellerPro' }
  const storeName = profile.business_name || profile.shop_name || 'Store'

  return {
    title: `Shop All Products | ${storeName}`,
    description: `Browse full catalog from ${storeName}. High quality products, easy ordering, Cash on Delivery available.`,
  }
}

export default async function DedicatedShopPage({ params }: Props) {
  const { shopSlug } = params
  const supabase = await createAdminClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('shop_slug', shopSlug)
    .single()

  if (!profile) return notFound()

  // Fetch active products
  const { data: rawProducts } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  const products: Product[] = (rawProducts || []).map((p) => {
    const { cost_price, ...safeProduct } = p
    return {
      ...safeProduct,
      price: p.selling_price,
    }
  })

  const categories = Array.from(
    new Map(
      products
        .filter((p) => p.category)
        .map((p) => [p.category, p.category])
    ).values()
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
