import type { Order, Profile } from '@/types'

// ─── Message Generators ───────────────────────────────────────────────────────

export function generateOrderConfirmationMessage(
  order: Order,
  profile: Profile
): string {
  const storeName = profile.shop_name || profile.business_name || 'Our Store'
  const isUPI = order.payment_method_v2 === 'upi'
  const totalAmount = order.total_amount ?? order.total ?? 0
  const subtotal = order.subtotal ?? totalAmount
  const shippingFee = order.shipping_fee ?? 0
  const customerName = order.customer_name ?? order.shipping_name ?? 'Customer'

  const items =
    order.order_items
      ?.map((item) => {
        let line = `  • *${item.product_name}* × ${item.quantity} = ₹${(item.total_price || 0).toLocaleString('en-IN')}`
        if ((item as any).variant_name) {
          line += ` (${(item as any).variant_name})`
        }
        const img = (item as any).product_image || (item as any).image_url || (item as any).image
        if (img && typeof img === 'string' && img.trim()) {
          line += `\n    🖼️ Image: ${img.trim()}`
        }
        return line
      })
      .join('\n\n') ?? '  (items not available)'

  if (isUPI) {
    const upiId = profile.upi_id ?? 'Contact seller for UPI ID'
    const upiName = profile.upi_name ? ` (${profile.upi_name})` : ''

    return [
      `📦 *Order Received — Payment Required*`,
      ``,
      `Hi ${customerName}! 👋`,
      `Your order from *${storeName}* has been received!`,
      ``,
      `📦 *Order #${order.order_number}*`,
      items,
      ``,
      `─────────────────`,
      `💰 Total Amount: *₹${totalAmount.toLocaleString('en-IN')}*`,
      `─────────────────`,
      ``,
      `💳 *UPI / GPay Payment Details:*`,
      `  • UPI ID / GPay Number: *${upiId}*${upiName}`,
      `  • Amount: *₹${totalAmount.toLocaleString('en-IN')}*`,
      profile.upi_instructions ? `  • Note: ${profile.upi_instructions}` : null,
      ``,
      `📸 *Next Step:* Please transfer ₹${totalAmount.toLocaleString('en-IN')} and reply here with a screenshot of your payment receipt to confirm your order!`,
      ``,
      `Thank you for shopping with us! 🙏`,
    ]
      .filter((line): line is string => line !== null)
      .join('\n')
  }

  // Cash on Delivery (COD) Flow
  return [
    `🎉 *Order Confirmed!*`,
    ``,
    `Hi ${customerName}! 👋`,
    `Your order from *${storeName}* is *CONFIRMED*!`,
    ``,
    `📦 *Order #${order.order_number}*`,
    items,
    ``,
    `─────────────────`,
    `💰 Subtotal: ₹${subtotal.toLocaleString('en-IN')}`,
    `🚚 Shipping: ${shippingFee === 0 ? 'FREE' : `₹${shippingFee.toLocaleString('en-IN')}`}`,
    `💳 *Total: ₹${totalAmount.toLocaleString('en-IN')}* (Cash on Delivery)`,
    `─────────────────`,
    ``,
    `📍 *Delivery Address:*`,
    order.shipping_name ?? customerName,
    order.shipping_line1,
    order.shipping_line2 ? order.shipping_line2 : null,
    `${order.shipping_city}, ${order.shipping_state} - ${order.shipping_pincode}`,
    ``,
    `🚚 *Order Status:* Confirmed. We will notify you with live tracking as soon as your package is shipped!`,
    `⏱ Expected Delivery: 3–5 working days`,
    ``,
    `Thank you for shopping with us! 🙏`,
  ]
    .filter((line): line is string => line !== null)
    .join('\n')
}

export function generateShippingUpdateMessage(
  order: Order,
  profile: Profile,
  trackingNumber?: string
): string {
  const storeName = profile.shop_name || profile.business_name || 'Our Store'
  return [
    `📦 *Order Shipped!*`,
    ``,
    `Hi ${order.customer_name ?? 'Customer'}!`,
    ``,
    `Your order *#${order.order_number}* from *${storeName}* has been shipped!`,
    trackingNumber ? `🔍 *Tracking Number:* ${trackingNumber}` : '',
    ``,
    `Expected delivery in 3–5 working days 🚚`,
    ``,
    `Thank you for your order! 🙏`,
  ]
    .filter(Boolean)
    .join('\n')
}

export function generatePaymentReminderMessage(
  order: Order,
  profile: Profile
): string {
  const storeName = profile.shop_name || profile.business_name || 'Our Store'
  const totalAmount = order.total_amount ?? order.total ?? 0
  return [
    `⚠️ *Payment Reminder*`,
    ``,
    `Hi ${order.customer_name ?? 'Customer'}!`,
    ``,
    `Friendly reminder for your order from *${storeName}*:`,
    `Order: *#${order.order_number}*`,
    ``,
    `💰 *Amount Due:* ₹${totalAmount.toLocaleString('en-IN')}`,
    `📱 *UPI ID:* ${profile.upi_id ?? 'Contact seller'}`,
    ``,
    `Please complete payment within 2 hours.`,
    `Send payment screenshot after transfer.`,
    ``,
    `Thank you! 🙏`,
  ].join('\n')
}

export function generateDeliveredMessage(
  order: Order,
  profile: Profile
): string {
  const storeName = profile.shop_name || profile.business_name || 'Our Store'
  return [
    `✅ *Order Delivered!*`,
    ``,
    `Hi ${order.customer_name ?? 'Customer'}!`,
    ``,
    `Your order *#${order.order_number}* from *${storeName}* has been delivered! 🎉`,
    ``,
    `Hope you love your purchase! 💛`,
    ``,
    `Please leave us a review — it helps a lot.`,
    ``,
    `Thank you for shopping with us! 🙏`,
  ].join('\n')
}

// ─── Link Generators ──────────────────────────────────────────────────────────

export function generateWhatsAppLink(
  phoneNumber: string,
  message: string
): string {
  const clean = phoneNumber.replace(/\D/g, '')
  const phone = clean.startsWith('91') ? clean : `91${clean}`
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export function generateStoreLaunchMessage(
  storeUrl: string,
  storeName: string
): string {
  return [
    `🎉 My online store is now live!`,
    ``,
    `Shop here 👉 ${storeUrl}`,
    ``,
    `✅ Easy checkout`,
    `✅ COD available`,
    `✅ Fast delivery`,
    ``,
    `Check out — ${storeName} 🛍️`,
  ].join('\n')
}
