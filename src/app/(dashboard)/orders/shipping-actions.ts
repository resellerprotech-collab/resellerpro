'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { getValidShiprocketToken } from '@/lib/services/shipping/shipping-storage'
import {
  createShiprocketAdhocOrder,
  assignCourierAWB,
  generateShippingLabel,
  requestDoorstepPickup,
} from '@/lib/services/shipping/shiprocket'

export interface DispatchOrderOptions {
  weight?: number // in kg
  length?: number // in cm
  breadth?: number // in cm
  height?: number // in cm
}

export async function dispatchShiprocketOrderAction(
  orderId: string,
  options?: DispatchOrderOptions
) {
  const supabase = await createClient()
  const adminClient = await createAdminClient()

  // 1. Authenticate Seller
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Authentication required.' }
  }

  // 2. Retrieve Shiprocket Token & Pickup Location
  const shippingTokenData = await getValidShiprocketToken(user.id)
  if (!shippingTokenData) {
    return {
      success: false,
      needsSetup: true,
      message:
        'Please connect your Shiprocket account in Settings → Delivery & Courier first.',
    }
  }

  const { token, pickupLocation, isTestMode } = shippingTokenData

  // 3. Fetch Full Order Data
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(
      `
      *,
      customers (*),
      order_items (*)
    `
    )
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (orderError || !order) {
    return { success: false, message: 'Order not found or unauthorized.' }
  }

  // 4. Resolve Shipping Address & Contact Details
  const customerName =
    order.shipping_name ||
    order.customer_name ||
    order.customers?.name ||
    'Valued Customer'

  const customerPhone =
    order.shipping_phone ||
    order.customer_phone ||
    order.customers?.phone ||
    ''

  const customerEmail =
    order.customer_email ||
    order.customers?.email ||
    'customer@resellerpro.in'

  const line1 =
    order.shipping_line1 ||
    order.customers?.address_line1 ||
    order.customers?.address ||
    ''

  const line2 =
    order.shipping_line2 ||
    order.customers?.address_line2 ||
    ''

  const city =
    order.shipping_city ||
    order.customers?.city ||
    ''

  const state =
    order.shipping_state ||
    order.customers?.state ||
    ''

  const pincode =
    order.shipping_pincode ||
    order.customers?.pincode ||
    ''

  if (!customerPhone || !line1 || !pincode) {
    return {
      success: false,
      message:
        'Incomplete customer shipping address or phone number. Please update order address before dispatching.',
    }
  }

  // 5. Format Order Date (YYYY-MM-DD HH:mm)
  const orderDateObj = new Date(order.created_at || Date.now())
  const pad = (n: number) => String(n).padStart(2, '0')
  const formattedOrderDate = `${orderDateObj.getFullYear()}-${pad(
    orderDateObj.getMonth() + 1
  )}-${pad(orderDateObj.getDate())} ${pad(orderDateObj.getHours())}:${pad(
    orderDateObj.getMinutes()
  )}`

  // 6. Map Items
  const items = (order.order_items || []).map((item: any, idx: number) => ({
    name: item.product_name || `Product Item ${idx + 1}`,
    sku: item.sku || `ITEM-${order.order_number}-${idx + 1}`,
    units: Number(item.quantity) || 1,
    selling_price: Number(item.unit_selling_price || item.unit_price) || 0,
    discount: 0,
    tax: 0,
  }))

  if (items.length === 0) {
    items.push({
      name: 'Order Items',
      sku: `ORD-${order.order_number}`,
      units: 1,
      selling_price: Number(order.total_amount) || 0,
      discount: 0,
      tax: 0,
    })
  }

  // Determine Payment Method
  const rawPaymentMethod = (order.payment_method || '').toLowerCase()
  const isCOD = rawPaymentMethod === 'cod' || rawPaymentMethod === 'cash_on_delivery'
  const paymentMethod = isCOD ? 'COD' : 'Prepaid'

  let awbCode = ''
  let courierName = ''
  let labelUrl = ''
  let shipmentId = 0

  if (isTestMode) {
    // ==========================================
    // DEVELOPER SANDBOX TEST MODE
    // ==========================================
    shipmentId = Math.floor(100000 + Math.random() * 900000)
    awbCode = `TEST-SR-${Math.floor(1000000000 + Math.random() * 9000000000)}`
    courierName = 'Delhivery Surface (Sandbox Test)'
    labelUrl = `https://kr-shipmultichannel.s3.ap-southeast-1.amazonaws.com/uploads/sample-label.pdf`
  } else {
    // ==========================================
    // LIVE SHIPROCKET API CALL
    // ==========================================
    const createRes = await createShiprocketAdhocOrder(token, {
      orderNumber: order.order_number,
      orderDate: formattedOrderDate,
      pickupLocation: pickupLocation || 'Primary',
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress: {
        line1,
        line2,
        city: city || 'City',
        state: state || 'State',
        pincode,
      },
      items,
      paymentMethod,
      totalAmount: Number(order.total_amount) || 0,
      weight: options?.weight || 0.5,
      dimensions: {
        length: options?.length || 10,
        breadth: options?.breadth || 10,
        height: options?.height || 5,
      },
    })

    if (!createRes.success || !createRes.shipmentId) {
      return {
        success: false,
        message: createRes.error || 'Failed to create shipment order in Shiprocket.',
      }
    }

    shipmentId = createRes.shipmentId

    // Assign Courier & Generate AWB
    const awbRes = await assignCourierAWB(token, shipmentId)
    awbCode = awbRes.awbCode || `SR-${shipmentId}`
    courierName = awbRes.courierName || 'Shiprocket Courier'

    // Generate Shipping Label PDF
    const labelRes = await generateShippingLabel(token, [shipmentId])
    labelUrl = labelRes.labelUrl || ''

    // Request Doorstep Pickup
    await requestDoorstepPickup(token, [shipmentId])
  }

  // Update Order in ResellerPro Database
  const updatePayload: any = {
    status: 'shipped',
    courier_service: `Shiprocket (${courierName})`,
    tracking_number: awbCode,
    shipped_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  try {
    await adminClient
      .from('orders')
      .update({
        ...updatePayload,
        courier_partner: courierName,
        shipping_label_url: labelUrl,
        shipment_id: String(shipmentId),
      })
      .eq('id', orderId)
  } catch {
    await adminClient
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId)
  }

  // Add entry in order_status_history
  try {
    await adminClient.from('order_status_history').insert({
      order_id: orderId,
      status: 'shipped',
      courier_service: `Shiprocket (${courierName})`,
      tracking_number: awbCode,
      notes: isTestMode
        ? `[SANDBOX TEST] Dispatched via Shiprocket Simulator. Courier: ${courierName}.`
        : `Dispatched via Shiprocket. Courier: ${courierName}. Doorstep pickup requested.`,
      created_at: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Failed to log order status history:', err)
  }

  revalidatePath(`/orders/${orderId}`)
  revalidatePath('/orders')

  return {
    success: true,
    awbCode,
    courierName,
    labelUrl,
    shipmentId,
    message: isTestMode
      ? `[TEST SUCCESS] Simulated shipment dispatched with ${courierName}! AWB: ${awbCode}`
      : `Shipment booked successfully with ${courierName}! AWB: ${awbCode}`,
  }
}
