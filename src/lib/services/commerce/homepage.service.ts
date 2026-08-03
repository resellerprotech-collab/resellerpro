import { createAdminClient } from '@/lib/supabase/admin'

export interface HeroBanner {
  id: string
  title?: string
  subtitle?: string
  image_url: string
  button_text?: string
  button_url?: string
  click_action?: string
  click_target?: string
  sort_order?: number
  is_active: boolean
}

export class CommerceHomepageService {
  /**
   * Get active hero banners for a store tenant
   */
  static async getHeroBanners(storeId: string): Promise<HeroBanner[]> {
    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .eq('store_id', storeId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) return []
    return (data || []) as HeroBanner[]
  }

  /**
   * Get store theme and homepage branding config
   */
  static async getHomepageLayout(storeId: string) {
    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('shop_theme, shop_description, shop_logo_url, business_name')
      .eq('id', storeId)
      .single()

    if (error || !data) return null

    let parsedTheme = {}
    if (data.shop_theme) {
      try {
        parsedTheme = typeof data.shop_theme === 'string' ? JSON.parse(data.shop_theme) : data.shop_theme
      } catch (err) {
        console.warn('Failed to parse shop_theme JSON:', err)
      }
    }

    return {
      business_name: data.business_name,
      shop_logo_url: data.shop_logo_url,
      shop_description: data.shop_description,
      theme: parsedTheme
    }
  }
}
