import { createAdminClient } from '@/lib/supabase/admin'

export interface GetProductsOptions {
  category?: string
  search?: string
  limit?: number
  offset?: number
}

export class CommerceProductsService {
  /**
   * Get active published products for a specific store tenant
   */
  static async getProducts(storeId: string, options: GetProductsOptions = {}) {
    const supabase = await createAdminClient()
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('user_id', storeId)

    if (options.category && options.category.trim()) {
      query = query.eq('category', options.category.trim())
    }

    if (options.search && options.search.trim()) {
      query = query.ilike('name', `%${options.search.trim()}%`)
    }

    const limit = options.limit || 50
    const offset = options.offset || 0
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false })

    const { data, count, error } = await query
    if (error) throw error

    // Strip cost_price from public headless API responses
    const sanitizedProducts = (data || []).map(({ cost_price, ...p }) => p)

    return {
      products: sanitizedProducts,
      total: count || 0,
      limit,
      offset
    }
  }

  /**
   * Get product details by ID or Slug for a specific store tenant
   */
  /**
   * Get product details by ID or Slug for a specific store tenant
   */
  static async getProductById(storeId: string, productIdOrSlug: string) {
    const supabase = await createAdminClient()
    
    // Test if productIdOrSlug is a valid UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productIdOrSlug)

    let query = supabase
      .from('products')
      .select('*')
      .eq('user_id', storeId)

    if (isUuid) {
      query = query.eq('id', productIdOrSlug)
    } else {
      query = query.eq('slug', productIdOrSlug)
    }

    const { data, error } = await query.single()

    if (error || !data) return null

    let options: any[] = []
    let variants: any[] = []

    if (data.has_variants) {
      const [{ data: optsData }, { data: varsData }] = await Promise.all([
        supabase.from('product_options').select('*').eq('product_id', data.id).order('position', { ascending: true }),
        supabase.from('product_variants').select('*').eq('product_id', data.id).eq('is_active', true).order('position', { ascending: true })
      ])
      options = optsData || []
      variants = (varsData || []).map(({ cost_price, ...v }) => v)
    }

    const { cost_price, ...sanitized } = data
    return {
      ...sanitized,
      options,
      variants
    }
  }

  /**
   * Get active distinct product categories for a store tenant
   */
  static async getCategories(storeId: string) {
    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .eq('user_id', storeId)
      .neq('stock_status', 'out_of_stock')

    if (error || !data) return []

    const distinctCategories = Array.from(
      new Set(
        data
          .map(p => p.category)
          .filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
      )
    )

    return distinctCategories
  }
}
