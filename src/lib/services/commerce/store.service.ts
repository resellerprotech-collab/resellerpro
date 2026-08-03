import { createAdminClient } from '@/lib/supabase/admin'

export interface StoreProfileData {
  id: string
  shop_slug: string
  business_name: string | null
  shop_description: string | null
  shop_theme: string | null
  avatar_url: string | null
  shop_logo_url: string | null
  store_mode: 'standard' | 'headless'
  connected_domain: string | null
  api_key_prefix: string | null
}

export class CommerceStoreService {
  /**
   * Get public store settings and profile by store/user ID
   */
  static async getStoreById(storeId: string): Promise<StoreProfileData | null> {
    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('id, shop_slug, business_name, shop_description, shop_theme, avatar_url, shop_logo_url, store_mode, connected_domain, api_key_prefix')
      .eq('id', storeId)
      .single()

    if (error || !data) return null
    return data as StoreProfileData
  }

  /**
   * Get public store by slug (for standard built-in storefront or slug lookup)
   */
  static async getStoreBySlug(slug: string): Promise<StoreProfileData | null> {
    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('id, shop_slug, business_name, shop_description, shop_theme, avatar_url, shop_logo_url, store_mode, connected_domain, api_key_prefix')
      .eq('shop_slug', slug)
      .single()

    if (error || !data) return null
    return data as StoreProfileData
  }
}
