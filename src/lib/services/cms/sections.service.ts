import { createAdminClient } from '@/lib/supabase/admin'

export interface CmsSectionItem {
  id?: string
  user_id: string
  section_type: string
  label: string
  is_enabled: boolean
  sort_order: number
  content: Record<string, any>
  created_at?: string
  updated_at?: string
}

export const DEFAULT_CMS_SECTIONS = [
  { section_type: 'hero', label: 'Hero Banner Showcase', sort_order: 1 },
  { section_type: 'categories', label: 'Category Grid Showcase', sort_order: 2 },
  { section_type: 'featured_products', label: 'Featured Products Grid', sort_order: 3 },
  { section_type: 'promotional_banner', label: 'Promotional Banner Section', sort_order: 4 },
  { section_type: 'best_sellers', label: 'Best Sellers Showcase', sort_order: 5 },
  { section_type: 'offer_strip', label: 'Special Promotion Offer Strip', sort_order: 6 },
  { section_type: 'why_choose_us', label: 'Trust Badges & Value Value', sort_order: 7 },
  { section_type: 'testimonials', label: 'Customer Reviews & Testimonials', sort_order: 8 },
  { section_type: 'newsletter', label: 'Newsletter Signup Section', sort_order: 9 }
]

export class CmsSectionsService {
  /**
   * Fetch all CMS sections for a user, auto-seeding from profile shop_theme if empty
   */
  static async getSections(userId: string): Promise<CmsSectionItem[]> {
    const supabase = await createAdminClient()

    const { data: existingSections, error } = await supabase
      .from('cms_sections')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true })

    if (!error && existingSections && existingSections.length > 0) {
      return existingSections as CmsSectionItem[]
    }

    // Auto-seed from profile shop_theme JSONB
    return await this.seedSectionsFromProfileTheme(userId)
  }

  /**
   * Seed cms_sections from existing profiles.shop_theme blob (Backward Compatibility)
   */
  static async seedSectionsFromProfileTheme(userId: string): Promise<CmsSectionItem[]> {
    const supabase = await createAdminClient()

    const { data: profile } = await supabase
      .from('profiles')
      .select('shop_theme')
      .eq('id', userId)
      .single()

    const theme = profile?.shop_theme || {}

    const seededSections: Omit<CmsSectionItem, 'id' | 'created_at' | 'updated_at'>[] = [
      {
        user_id: userId,
        section_type: 'hero',
        label: 'Hero Banner Showcase',
        is_enabled: theme.heroEnabled !== false,
        sort_order: 1,
        content: {
          heroTitle: theme.heroTitle || '',
          heroSubtitle: theme.heroSubtitle || '',
          heroCtaText: theme.heroCtaText || 'Shop Now',
          heroCtaLink: theme.heroCtaLink || '#products',
          heroTemplate: theme.heroTemplate || 'split',
          heroBadge: theme.heroBadge || 'New Arrival',
          heroSecondaryCtaText: theme.heroSecondaryCtaText || 'Explore Now',
          heroSecondaryCtaLink: theme.heroSecondaryCtaLink || '#collections',
          heroBadge1: theme.heroBadge1 || 'Free Shipping',
          heroBadge2: theme.heroBadge2 || 'Easy Returns',
          heroBadge3: theme.heroBadge3 || 'COD Available',
          heroImages: theme.heroImages || (theme.heroImageUrl ? [theme.heroImageUrl] : []),
          heroBanners: theme.heroBanners || []
        }
      },
      {
        user_id: userId,
        section_type: 'promotional_banner',
        label: 'Promotional Banner Section',
        is_enabled: theme.promoSectionEnabled !== false,
        sort_order: 2,
        content: {
          promoLayout: theme.promoLayout || 'full_width',
          promoFullBanner: theme.promoFullBanner || {},
          promoCard1: theme.promoCard1 || {},
          promoCard2: theme.promoCard2 || {}
        }
      },
      {
        user_id: userId,
        section_type: 'offer_strip',
        label: 'Special Promotion Offer Strip',
        is_enabled: theme.bannerEnabled !== false,
        sort_order: 3,
        content: {
          bannerText: theme.bannerText || 'Limited Time Offer: Get 10% OFF on Orders Above ₹1,499',
          promoCode: 'SAVE10'
        }
      },
      {
        user_id: userId,
        section_type: 'why_choose_us',
        label: 'Trust Badges & Value Propositions',
        is_enabled: theme.trustBadgesEnabled !== false,
        sort_order: 4,
        content: { trustBadges: theme.trustBadges || ['secure_payment', 'fast_delivery', 'easy_returns'] }
      },
      {
        user_id: userId,
        section_type: 'testimonials',
        label: 'Customer Reviews & Testimonials',
        is_enabled: theme.testimonialsEnabled !== false,
        sort_order: 5,
        content: {
          testimonials: theme.testimonials || [
            { name: 'Priya Sharma', text: 'Loved the quality of the products! Delivery was super fast.', rating: 5 },
            { name: 'Rahul Verma', text: 'Great seller and prompt WhatsApp communication.', rating: 5 }
          ]
        }
      }
    ]

    const { data: inserted, error: insertErr } = await supabase
      .from('cms_sections')
      .upsert(seededSections, { onConflict: 'user_id, section_type' })
      .select('*')
      .order('sort_order', { ascending: true })

    if (insertErr) {
      console.error('Error seeding cms_sections:', insertErr)
      return seededSections as CmsSectionItem[]
    }

    return (inserted || []) as CmsSectionItem[]
  }

  /**
   * Update or insert a single section content / status
   */
  static async upsertSection(userId: string, sectionType: string, payload: { is_enabled?: boolean; content?: Record<string, any>; label?: string }) {
    const supabase = await createAdminClient()

    const { data: existing } = await supabase
      .from('cms_sections')
      .select('*')
      .eq('user_id', userId)
      .eq('section_type', sectionType)
      .maybeSingle()

    const updatedData = {
      user_id: userId,
      section_type: sectionType,
      label: payload.label || existing?.label || sectionType,
      is_enabled: payload.is_enabled !== undefined ? payload.is_enabled : (existing?.is_enabled ?? true),
      sort_order: existing?.sort_order ?? 99,
      content: payload.content ? { ...(existing?.content || {}), ...payload.content } : (existing?.content || {}),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('cms_sections')
      .upsert(updatedData, { onConflict: 'user_id, section_type' })
      .select('*')
      .single()

    if (error) throw error
    return data
  }

  /**
   * Update sort order for list of section IDs
   */
  static async updateSectionsOrder(userId: string, orderedSectionTypes: string[]) {
    const supabase = await createAdminClient()

    const updates = orderedSectionTypes.map((type, index) => ({
      user_id: userId,
      section_type: type,
      sort_order: index + 1,
      updated_at: new Date().toISOString()
    }))

    for (const update of updates) {
      await supabase
        .from('cms_sections')
        .update({ sort_order: update.sort_order, updated_at: update.updated_at })
        .eq('user_id', userId)
        .eq('section_type', update.section_type)
    }

    return true
  }
}
