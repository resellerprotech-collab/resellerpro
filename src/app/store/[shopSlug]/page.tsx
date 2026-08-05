import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ShopTheme, Product } from '@/types'
import { StorefrontClient } from './StorefrontClient'

export const revalidate = 3600 // ISR: background revalidation every hour, instant on-demand via revalidatePath

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
  const theme = profile.shop_theme as ShopTheme | null
  const storeName = profile.shop_name || profile.business_name || 'Store'

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

  const products: Product[] = (rawProducts || []).map((p) => ({
    ...p,
    price: p.selling_price,
  }))

  // Fetch managed categories from DB
  const { data: dbCategories } = await supabase
    .from('categories')
    .select('name, image_url')
    .eq('user_id', profile.id)

  const managedCategoriesMap = new Map((dbCategories || []).map(c => [c.name.toLowerCase(), c]))

  // Extract categories from products and merge with DB categories
  const categoriesSet = new Set(products.filter((p) => p.category).map((p) => p.category!))
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
