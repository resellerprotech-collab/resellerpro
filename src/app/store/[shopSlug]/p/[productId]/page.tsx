import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { ProductDetailClient } from './ProductDetailClient'
import type { Product, ShopTheme } from '@/types'

export const revalidate = 3600 // ISR: Static Edge CDN caching with instant on-demand purging via revalidatePath

interface Props {
  params: { shopSlug: string; productId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const supabase = await createAdminClient()
  const { data: product } = await supabase
    .from('products')
    .select('name, description, image_url')
    .eq('id', resolvedParams.productId)
    .single()

  if (!product) return { title: 'Product Not Found' }
  return {
    title: product.name,
    description: product.description || product.name,
    openGraph: {
      images: product.image_url ? [product.image_url] : [],
    },
  }
}

import { CommerceProductsService } from '@/lib/services/commerce/products.service'

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params)
  const { shopSlug, productId } = resolvedParams
  const supabase = await createAdminClient()

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('shop_slug', shopSlug)
    .single()

  if (!profile) return notFound()

  // Get product with full options & variants
  const product = await CommerceProductsService.getProductById(profile.id, productId)

  if (!product) return notFound()

  // Get related products (same category if available, otherwise latest from store)
  let relatedQuery = supabase
    .from('products')
    .select('*')
    .eq('user_id', profile.id)
    .neq('id', productId)

  if (product.category) {
    relatedQuery = relatedQuery.eq('category', product.category)
  }

  let { data: related } = await relatedQuery.limit(4)

  if (!related || related.length === 0) {
    const { data: fallbackRelated } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', profile.id)
      .neq('id', productId)
      .limit(4)
    related = fallbackRelated || []
  }

  const theme = profile.shop_theme as ShopTheme | null

  const { cost_price: _mainCost, ...safeMainProduct } = product
  const enriched: Product = { ...safeMainProduct, price: product.selling_price }
  const relatedEnriched: Product[] = (related || []).map((p) => {
    const { cost_price, ...safeP } = p
    return { ...safeP, price: p.selling_price }
  })

  return (
    <ProductDetailClient
      product={enriched}
      relatedProducts={relatedEnriched}
      profile={profile}
      theme={theme}
      shopSlug={shopSlug}
    />
  )
}
