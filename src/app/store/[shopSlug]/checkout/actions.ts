'use server'

import { createAdminClient } from '@/lib/supabase/admin'

interface PlaceOrderInput {
  storeUserId: string
  customer: {
    fullName: string
    phone: string
    email?: string | null
  }
  shipping: {
    addressLine1: string
    addressLine2?: string | null
    city: string
    state: string
    pincode: string
  }
  paymentMethod: 'cod' | 'upi' | 'whatsapp' | 'razorpay' | 'card'
  orderNotes?: string | null
  items: {
    productId: string
    name: string
    image: string | null
    price: number
    quantity: number
  }[]
  subtotal: number
  shippingFee: number
  total: number
}

export async function placeOrder(input: PlaceOrderInput) {
  const supabase = await createAdminClient()

  // 1. Fetch product prices and cost prices from DB to compute total_cost and validate subtotal
  const productIds = input.items.map((item) => item.productId)
  const { data: dbProducts, error: dbProductsError } = await supabase
    .from('products')
    .select('id, cost_price, selling_price')
    .in('id', productIds)

  if (dbProductsError) {
    console.error('Fetch products error:', dbProductsError)
    return { error: dbProductsError.message }
  }

  const costMap = new Map<string, number>()
  const priceMap = new Map<string, number>()
  dbProducts?.forEach((p) => {
    costMap.set(p.id, p.cost_price || 0)
    priceMap.set(p.id, p.selling_price || 0)
  })

  // Calculate total cost and subtotal on the server
  let totalCost = 0
  let serverSubtotal = 0
  input.items.forEach((item) => {
    const unitCost = costMap.get(item.productId) || 0
    const unitPrice = priceMap.get(item.productId) || 0
    totalCost += unitCost * item.quantity
    serverSubtotal += unitPrice * item.quantity
  })

  // Validate server calculated values against client values to prevent pricing tampering
  if (serverSubtotal !== input.subtotal) {
    return { error: 'Pricing mismatch detected. Please refresh your page and try again.' }
  }

  const serverShippingFee = serverSubtotal >= 500 ? 0 : 49
  if (serverShippingFee !== input.shippingFee) {
    return { error: 'Shipping fee mismatch detected. Please try again.' }
  }

  const serverTotal = serverSubtotal + serverShippingFee
  if (serverTotal !== input.total) {
    return { error: 'Order total mismatch detected. Please try again.' }
  }

  // 2. Find or create customer in CRM
  let customerId: string | null = null
  const rawPhone = input.customer.phone.replace(/\D/g, '')
  const cleanPhone = rawPhone.length > 10 ? rawPhone.slice(-10) : rawPhone

  try {
    // Search including soft-deleted customers to avoid unique constraint violations
    const { data: existingCustomer, error: customerSearchError } = await supabase
      .from('customers')
      .select('id, is_deleted')
      .eq('user_id', input.storeUserId)
      .eq('phone', cleanPhone)
      .maybeSingle()

    if (customerSearchError) {
      console.error('Customer search error:', customerSearchError)
    }

    if (existingCustomer) {
      customerId = existingCustomer.id
      if (existingCustomer.is_deleted) {
        // Reactivate soft-deleted customer and update their details
        const { error: reactivateError } = await supabase
          .from('customers')
          .update({
            is_deleted: false,
            deleted_at: null,
            name: input.customer.fullName,
            email: input.customer.email || null,
            address_line1: input.shipping.addressLine1,
            address_line2: input.shipping.addressLine2 || null,
            city: input.shipping.city,
            state: input.shipping.state,
            pincode: input.shipping.pincode,
          })
          .eq('id', existingCustomer.id)

        if (reactivateError) {
          console.error('Failed to reactivate customer:', reactivateError)
        }
      }
    } else {
      // Create new customer under the reseller
      const { data: newCustomer, error: customerCreateError } = await supabase
        .from('customers')
        .insert({
          user_id: input.storeUserId,
          name: input.customer.fullName,
          phone: cleanPhone,
          whatsapp: cleanPhone, // default whatsapp to phone
          email: input.customer.email || null,
          address_line1: input.shipping.addressLine1,
          address_line2: input.shipping.addressLine2 || null,
          city: input.shipping.city,
          state: input.shipping.state,
          pincode: input.shipping.pincode,
        })
        .select('id')
        .single()

      if (customerCreateError) {
        console.error('Customer creation error:', customerCreateError)
      } else if (newCustomer) {
        customerId = newCustomer.id
      }
    }
  } catch (err) {
    console.error('Failed to link storefront guest order to customer:', err)
  }

  // 3. Insert order with total_cost (non-null constraint) and customer_id
  const orderInsertData: any = {
    user_id: input.storeUserId,
    customer_id: customerId,
    status: 'pending',
    payment_method: input.paymentMethod,
    payment_method_v2: input.paymentMethod === 'cod' ? 'cod' : input.paymentMethod === 'upi' ? 'upi' : 'online',
    payment_status: 'unpaid',
    subtotal: input.subtotal,
    shipping_cost: input.shippingFee,
    total_amount: input.total,
    total_cost: totalCost,
  }

  if (input.orderNotes) {
    orderInsertData.notes = input.orderNotes
  }

  let { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(orderInsertData)
    .select()
    .single()

  // Fallback if notes column name varies in production schema
  if (orderError && (orderError.message.includes('notes') || orderError.code === 'PGRST204')) {
    delete orderInsertData.notes
    delete orderInsertData.order_notes
    const retry = await supabase
      .from('orders')
      .insert(orderInsertData)
      .select()
      .single()
    order = retry.data
    orderError = retry.error
  }

  if (orderError || !order) {
    console.error('Order insert error:', orderError)
    return { error: orderError?.message || 'Failed to create order record' }
  }

  // 3. Insert order items (write to both legacy & new pricing/image fields)
  const orderItems = input.items.map((item) => {
    const unitCost = costMap.get(item.productId) || 0
    return {
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      product_image: item.image,
      quantity: item.quantity,
      unit_price: item.price,
      unit_selling_price: item.price,
      unit_cost_price: unitCost,
    }
  })

  let { error: itemsError } = await supabase.from('order_items').insert(orderItems)

  if (itemsError) {
    console.warn('Initial order_items insert error, retrying with fallback schema:', itemsError)
    const cleanItems = input.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      quantity: item.quantity,
      unit_selling_price: item.price,
      unit_cost_price: costMap.get(item.productId) || 0,
    }))
    const retryItems = await supabase.from('order_items').insert(cleanItems)
    itemsError = retryItems.error
  }

  if (itemsError) {
    console.error('Order items insert error:', itemsError)
    // Rollback the order if items fail to insert
    await supabase.from('orders').delete().eq('id', order.id)
    return { error: itemsError.message }
  }

  // Update linked customer's total_orders and total_spent stats
  if (customerId) {
    try {
      const { data: custData } = await supabase
        .from('customers')
        .select('total_orders, total_spent')
        .eq('id', customerId)
        .single()

      const currentOrders = Number(custData?.total_orders || 0)
      const currentSpent = Number(custData?.total_spent || 0)

      await supabase
        .from('customers')
        .update({
          total_orders: currentOrders + 1,
          total_spent: currentSpent + input.total,
          updated_at: new Date().toISOString(),
        })
        .eq('id', customerId)
    } catch (custUpdateErr) {
      console.warn('Customer stats update warning:', custUpdateErr)
    }
  }

  // 4. Send instant email notifications to Reseller and Customer
  try {
    const { data: resellerProfile } = await supabase
      .from('profiles')
      .select('id, full_name, business_name, shop_name')
      .eq('id', input.storeUserId)
      .single()

    // Fetch reseller's email from auth.users using admin client
    const { data: authUser } = await supabase.auth.admin.getUserById(input.storeUserId)
    const resellerEmail = authUser?.user?.email

    const resellerName = resellerProfile?.full_name || resellerProfile?.business_name || resellerProfile?.shop_name || 'Reseller'
    const storeName = resellerProfile?.shop_name || resellerProfile?.business_name || resellerProfile?.full_name || 'Store'
    const shippingAddressStr = `${input.shipping.addressLine1}${input.shipping.addressLine2 ? ', ' + input.shipping.addressLine2 : ''}, ${input.shipping.city}, ${input.shipping.state} - ${input.shipping.pincode}`

    const emailOrderData = {
      orderId: order.id,
      resellerName,
      storeName,
      customerName: input.customer.fullName,
      customerPhone: input.customer.phone,
      customerEmail: input.customer.email || null,
      shippingAddress: shippingAddressStr,
      paymentMethod: input.paymentMethod,
      items: input.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        image: i.image,
      })),
      subtotal: input.subtotal,
      shippingFee: input.shippingFee,
      total: input.total,
      orderNotes: input.orderNotes || null,
    }

    // Send instant order alert to reseller ONLY
    if (resellerEmail) {
      const { MailService } = await import('@/lib/mail/mailer')
      MailService.sendInstantNewOrderResellerAlert(resellerEmail, emailOrderData).catch((e) =>
        console.error('Failed to send reseller order email alert:', e)
      )
    }
  } catch (emailErr) {
    console.error('Non-blocking error sending instant order emails:', emailErr)
  }

  return { orderId: order.id }
}
