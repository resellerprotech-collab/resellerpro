import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStoreProfile } from '@/lib/storefront'
import type { ShopTheme, Product } from '@/types'
import { StorefrontClient } from './StorefrontClient'

export const revalidate = 86400 // ISR: 24h cache — reduces Fluid CPU. Use revalidatePath() on product/theme mutations for instant refresh.

interface Props {
  params: { shopSlug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = await getStoreProfile(params.shopSlug)

  if (!profile) return { title: 'Store Not Found | ResellerPro' }
  const theme = profile.shop_theme as ShopTheme | null
  const storeName = profile.business_name || profile.shop_name || 'Store'

  return {
    title: theme?.seoTitle || `${storeName} | Shop Online`,
    description: theme?.seoDescription || profile.shop_description || `Shop from ${storeName} online. Easy checkout, COD available.`,
    openGraph: {
      title: theme?.seoTitle || storeName,
      description: theme?.seoDescription || profile.shop_description || '',
      type: 'website',
    },
  }
}

export default async function StorePage({ params }: Props) {
  const { shopSlug } = params
  const profile = await getStoreProfile(shopSlug)

  if (!profile) return notFound()

  const supabase = await createAdminClient()

  // Fetch active products with explicit storefront columns (zero cost_price overhead)
  const { data: rawProducts } = await supabase
    .from('products')
    .select('id, user_id, name, description, category, sku, image_url, images, selling_price, compare_at_price, badge, stock_status, stock_quantity, track_inventory, tags, created_at, updated_at')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  const products: Product[] = (rawProducts || []).map((p: any) => {
    return {
      ...p,
      cost_price: 0,
      profit: 0,
      profit_margin: 0,
      price: p.selling_price,
    }
  })

  // Fetch managed categories from DB
  const { data: dbCategories } = await supabase
    .from('categories')
    .select('name, image_url')
    .eq('user_id', profile.id)

  const managedCategoriesMap = new Map((dbCategories || []).map(c => [c.name.toLowerCase(), c]))

  // Merge DB managed categories and product categories so all store categories display
  const categoriesSet = new Set([
    ...(dbCategories || []).map(c => c.name),
    ...products.filter((p) => p.category).map((p) => p.category!)
  ])
  const categories = Array.from(categoriesSet).map(name => {
    return managedCategoriesMap.get(name.toLowerCase()) || { name, image_url: undefined }
  })


  const theme = profile.shop_theme as ShopTheme | null

  // Fetch CMS sections only when in Headless mode
  let cmsSections = undefined
  if (profile.store_mode === 'headless') {
    const { CmsSectionsService } = await import('@/lib/services/cms/sections.service')
    cmsSections = await CmsSectionsService.getSections(profile.id)
  }

  return (
    <StorefrontClient
      profile={profile}
      products={products}
      categories={categories}
      theme={theme}
      cmsSections={cmsSections}
    />
  )
}
