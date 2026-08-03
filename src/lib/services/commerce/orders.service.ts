import { createAdminClient } from '@/lib/supabase/admin'

export interface CreateOrderPayload {
  customer_name: string
  customer_phone: string
  customer_email?: string
  shipping_address?: string
  shipping_city?: string
  shipping_state?: string
  shipping_pincode?: string
  payment_method?: 'cod' | 'razorpay' | 'manual_qr'
  notes?: string
  items: Array<{
    product_id: string
    quantity: number
  }>
}

export class CommerceOrdersService {
  /**
   * Create customer order for store tenant
   */
  static async createOrder(storeId: string, payload: CreateOrderPayload) {
    const supabase = await createAdminClient()

    // 1. Fetch products & calculate exact total
    const productIds = payload.items.map(i => i.product_id)
    const { data: products, error: prodErr } = await supabase
      .from('products')
      .select('id, name, selling_price, cost_price')
      .eq('user_id', storeId)
      .in('id', productIds)

    if (prodErr || !products || products.length === 0) {
      throw new Error('Invalid products in order payload')
    }

    const productMap = new Map(products.map(p => [p.id, p]))
    let subtotal = 0
    let totalCost = 0
    let totalProfit = 0
    const orderItems = []

    for (const item of payload.items) {
      const prod = productMap.get(item.product_id)
      if (!prod) continue

      const unitPrice = Number(prod.selling_price)
      const costPrice = Number(prod.cost_price || 0)
      const itemTotal = unitPrice * item.quantity
      const itemCost = costPrice * item.quantity
      const itemProfit = (unitPrice - costPrice) * item.quantity

      subtotal += itemTotal
      totalCost += itemCost
      totalProfit += itemProfit

      orderItems.push({
        product_id: prod.id,
        quantity: item.quantity,
        price: unitPrice,
        total: itemTotal
      })
    }

    // 2. Insert or find customer record
    let customerId: string | null = null
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', storeId)
      .eq('phone', payload.customer_phone)
      .single()

    if (existingCustomer) {
      customerId = existingCustomer.id
    } else {
      const { data: newCust } = await supabase
        .from('customers')
        .insert({
          user_id: storeId,
          name: payload.customer_name,
          phone: payload.customer_phone,
          email: payload.customer_email || null,
          address_line1: payload.shipping_address || null,
          city: payload.shipping_city || null,
          state: payload.shipping_state || null,
          pincode: payload.shipping_pincode || null
        })
        .select('id')
        .single()

      if (newCust) customerId = newCust.id
    }

    // 3. Insert order (letting Postgres sequence generate order_number integer)
    const { data: newOrder, error: orderErr } = await supabase
      .from('orders')
      .insert({
        user_id: storeId,
        customer_id: customerId,
        status: 'pending',
        payment_status: payload.payment_method === 'cod' ? 'cod' : 'unpaid',
        payment_method: payload.payment_method || 'cod',
        subtotal,
        total_amount: subtotal,
        total_cost: totalCost,
        shipping_address: payload.shipping_address,
        shipping_city: payload.shipping_city,
        shipping_state: payload.shipping_state,
        shipping_pincode: payload.shipping_pincode,
        notes: payload.notes
      })
      .select('*')
      .single()

    if (orderErr || !newOrder) {
      throw new Error(`Failed to create order: ${orderErr?.message}`)
    }

    // 4. Insert order items
    const itemsToInsert = orderItems.map(item => ({
      order_id: newOrder.id,
      ...item
    }))

    await supabase.from('order_items').insert(itemsToInsert)

    return newOrder
  }

  /**
   * Track order by Order ID or Order Number
   */
  static async getOrderDetails(storeId: string, orderIdentifier: string) {
    const supabase = await createAdminClient()
    const isUuid = /^[0-9a-fA-F-]{36}$/.test(orderIdentifier)

    let query = supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(name, image_url))')
      .eq('user_id', storeId)

    if (isUuid) {
      query = query.eq('id', orderIdentifier)
    } else {
      query = query.eq('order_number', orderIdentifier)
    }

    const { data, error } = await query.single()

    if (error || !data) return null
    return data
  }
}
