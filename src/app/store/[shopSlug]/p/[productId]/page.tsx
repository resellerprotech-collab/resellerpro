import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStoreProfile } from '@/lib/storefront'
import { ProductDetailClient } from './ProductDetailClient'
import type { Product, ShopTheme } from '@/types'

export const revalidate = 86400 // ISR: 24h cache — reduces Fluid CPU. Use revalidatePath() on product mutations.

const STOREFRONT_PRODUCT_COLUMNS = 'id, user_id, name, description, category, sku, image_url, images, selling_price, compare_at_price, badge, stock_status, stock_quantity, track_inventory, is_active, tags, created_at, updated_at'

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

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params)
  const { shopSlug, productId } = resolvedParams

  // Deduplicated profile fetch via React.cache
  const profile = await getStoreProfile(shopSlug)
  if (!profile) return notFound()

  const supabase = await createAdminClient()

  // Get product with explicit storefront columns
  const { data: rawProduct } = await supabase
    .from('products')
    .select(STOREFRONT_PRODUCT_COLUMNS)
    .eq('id', productId)
    .eq('user_id', profile.id)
    .single()

  if (!rawProduct) return notFound()

  // Get related products (same category if available, otherwise latest from store)
  let relatedQuery = supabase
    .from('products')
    .select(STOREFRONT_PRODUCT_COLUMNS)
    .eq('user_id', profile.id)
    .neq('id', productId)

  if (rawProduct.category) {
    relatedQuery = relatedQuery.eq('category', rawProduct.category)
  }

  let { data: related } = await relatedQuery.limit(4)

  if (!related || related.length === 0) {
    const { data: fallbackRelated } = await supabase
      .from('products')
      .select(STOREFRONT_PRODUCT_COLUMNS)
      .eq('user_id', profile.id)
      .neq('id', productId)
      .limit(4)
    related = fallbackRelated || []
  }

  const theme = profile.shop_theme as ShopTheme | null

  const enriched: Product = {
    ...(rawProduct as any),
    cost_price: 0,
    profit: 0,
    profit_margin: 0,
    price: rawProduct.selling_price,
  }

  const relatedEnriched: Product[] = (related || []).map((p: any) => ({
    ...p,
    cost_price: 0,
    profit: 0,
    profit_margin: 0,
    price: p.selling_price,
  }))

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
