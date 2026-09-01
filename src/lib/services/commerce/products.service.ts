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
  static async getProductById(storeId: string, productId: string) {
    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', storeId)
      .eq('id', productId)
      .single()

    if (error || !data) return null
    const { cost_price, ...sanitized } = data
    return sanitized
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
      .eq('is_active', true)

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
