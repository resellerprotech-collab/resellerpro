import { createAdminClient } from '@/lib/supabase/admin'

export interface CartValidateItem {
  product_id: string
  quantity: number
}

export interface ShippingRate {
  id: string
  name: string
  rate: number
  min_order_amount?: number
  pin_codes?: string[]
}

export class CommerceCheckoutService {
  /**
   * Validate cart items, check stock, and calculate subtotal using real database prices
   */
  static async validateCartAndCalculate(storeId: string, items: CartValidateItem[]) {
    if (!items || items.length === 0) {
      return {
        valid: false,
        error: 'Cart is empty',
        items: [],
        subtotal: 0
      }
    }

    const productIds = items.map(i => i.product_id)
    const supabase = await createAdminClient()

    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, selling_price, stock_quantity, stock_status, image_url')
      .eq('user_id', storeId)
      .in('id', productIds)

    if (error || !products) {
      throw new Error('Failed to validate cart products')
    }

    const productMap = new Map(products.map(p => [p.id, p]))
    let subtotal = 0
    const validatedItems = []
    const outOfStockItems = []

    for (const item of items) {
      const product = productMap.get(item.product_id)
      if (!product || product.stock_status === 'out_of_stock') {
        outOfStockItems.push({ product_id: item.product_id, reason: 'Product unavailable' })
        continue
      }

      if (product.stock_quantity !== null && product.stock_quantity < item.quantity) {
        outOfStockItems.push({
          product_id: item.product_id,
          name: product.name,
          requested: item.quantity,
          available: product.stock_quantity,
          reason: 'Insufficient stock'
        })
      }

      const itemTotal = Number(product.selling_price) * item.quantity
      subtotal += itemTotal

      validatedItems.push({
        product_id: product.id,
        name: product.name,
        unit_price: Number(product.selling_price),
        quantity: item.quantity,
        total_price: itemTotal,
        image_url: product.image_url
      })
    }

    return {
      valid: outOfStockItems.length === 0,
      subtotal,
      items: validatedItems,
      out_of_stock: outOfStockItems
    }
  }

  /**
   * Get active shipping rates for store
   */
  static async getShippingRates(storeId: string): Promise<ShippingRate[]> {
    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from('shipping_rates')
      .select('*')
      .eq('store_id', storeId)

    if (error) return []
    return (data || []) as ShippingRate[]
  }
}
