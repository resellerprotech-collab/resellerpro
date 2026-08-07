/**
 * Helper function to generate WhatsApp message for order status updates
 */
export function generateStatusMessage(
    customerName: string,
    orderNumber: string,
    status: string,
    trackingNumber?: string,
    courierName?: string,
    orderDetails?: { products: string[]; totalAmount: number; paymentMethod?: string; upiId?: string | null; upiName?: string | null; upiInstructions?: string | null } | null,
    shopName: string = 'Store'
): string {
    const displayShopName = (shopName && shopName.trim() && shopName !== 'Our Store') ? shopName.trim() : 'Store'
    const productList = orderDetails?.products?.length
        ? `\n\n*YOUR ORDER INCLUDES:*\n${orderDetails.products.map(p => `   • ${p}`).join('\n')}`
        : ''

    const amountVal = orderDetails?.totalAmount ?? 0
    const amountStr = amountVal ? `\n\n*Order Total:* ₹${amountVal.toLocaleString('en-IN')}` : ''
    const isUPI = orderDetails?.paymentMethod?.toLowerCase() === 'upi'
    const hasUPIConfig = Boolean(orderDetails?.upiId && orderDetails.upiId.trim().length > 0)

    const upiMessage = hasUPIConfig
      ? `Hi ${customerName},

Your order from *${displayShopName}* has been received!

━━━━━━━━━━━━━━━━━━━━━
*ORDER RECEIVED — PAYMENT REQUIRED*
Order ID: #${orderNumber}${productList}${amountStr}
━━━━━━━━━━━━━━━━━━━━━

💳 *UPI / GPAY PAYMENT DETAILS:*
  • UPI ID / GPay Number: *${orderDetails?.upiId}*${orderDetails?.upiName ? ` (${orderDetails.upiName})` : ''}
  • Amount Due: *₹${amountVal.toLocaleString('en-IN')}*
${orderDetails?.upiInstructions ? `  • Note: ${orderDetails.upiInstructions}\n` : ''}
📸 *NEXT STEP:* Please transfer ₹${amountVal.toLocaleString('en-IN')} and reply here with a screenshot of your payment receipt to confirm dispatch!

Thank you for shopping with us! 🙏

Warm regards,
*${displayShopName}*`
      : `Hi ${customerName},

Your order from *${displayShopName}* has been received!

━━━━━━━━━━━━━━━━━━━━━
*ORDER RECEIVED — AWAITING PAYMENT*
Order ID: #${orderNumber}${productList}${amountStr}
━━━━━━━━━━━━━━━━━━━━━

💳 *Payment Method:* Pay via UPI

💬 Please reply to this message to receive our payment/UPI details and confirm your order dispatch!

Thank you for shopping with us! 🙏

Warm regards,
*${displayShopName}*`

    const codMessage = `Hi ${customerName},

🎉 Great news about your order from *${displayShopName}*!

━━━━━━━━━━━━━━━━━━━━━
*ORDER CONFIRMED (COD)*
Order ID: #${orderNumber}${productList}${amountStr}
━━━━━━━━━━━━━━━━━━━━━

*CURRENT STATUS:* ✅ Confirmed & Preparing for Dispatch

Your Cash on Delivery (COD) order is confirmed! We will notify you with live tracking as soon as your package is shipped.

Thank you for shopping with us! 🙏

Warm regards,
*${displayShopName}*`

    const statusMessages: Record<string, string> = {
        pending: isUPI ? upiMessage : codMessage,
        received: isUPI ? upiMessage : codMessage,

        processing: `Hi ${customerName},

Exciting news about your order from *${displayShopName}*!

━━━━━━━━━━━━━━━━━━━━━
*ORDER IN PROGRESS*
Order ID: #${orderNumber}${productList}${amountStr}
━━━━━━━━━━━━━━━━━━━━━

*CURRENT STATUS:* 🔄 Processing

Your order is now in our fulfillment center and being carefully prepared for dispatch. Our team is ensuring everything is perfect before shipping.

*WHAT'S NEXT?*
We'll notify you immediately once your order is shipped with complete tracking details.

Thank you for your patience!

Warm regards,
*${displayShopName}*`,

        shipped: `Hi ${customerName},

Your order from *${displayShopName}* is on its way to you!

━━━━━━━━━━━━━━━━━━━━━
*ORDER SHIPPED*
Order ID: #${orderNumber}${productList}${amountStr}
━━━━━━━━━━━━━━━━━━━━━

*CURRENT STATUS:* 🚚 In Transit

*SHIPPING DETAILS:*${courierName ? `\n📦 Courier Partner: *${courierName}*` : ''
            }${trackingNumber ? `\n🔍 Tracking ID: *${trackingNumber}*` : ''
            }

Your order has left our facility and is being delivered to your doorstep. Expected delivery: 3-5 business days.
${trackingNumber ? '\n_You can track your shipment in real-time using the tracking ID above._' : ''}

We hope you're as excited as we are!

Warm regards,
*${displayShopName}*`,

        delivered: `Hi ${customerName},

Your order from *${displayShopName}* has been successfully delivered!

━━━━━━━━━━━━━━━━━━━━━
*DELIVERY COMPLETE*
Order ID: #${orderNumber}${productList}${amountStr}
━━━━━━━━━━━━━━━━━━━━━

*CURRENT STATUS:* ✅ Delivered

We hope you absolutely love your purchase! Your satisfaction is our top priority.

*WE VALUE YOUR FEEDBACK*
How was your experience? We'd love to hear from you.

_Any concerns? Our support team is here to help - just reply to this message._

Thank you for being an amazing customer!

With gratitude,
*${displayShopName}*`,

        cancelled: `Hi ${customerName},

We're writing to inform you about your order cancellation from *${displayShopName}*.

━━━━━━━━━━━━━━━━━━━━━
*ORDER CANCELLED*
Order ID: #${orderNumber}${productList}${amountStr}
━━━━━━━━━━━━━━━━━━━━━

*CURRENT STATUS:* ❌ Cancelled
${amountVal ? `\nIf you've already made a payment of ₹${amountVal.toLocaleString('en-IN')}, it will be refunded to your original payment method within 5-7 business days.` : ''}

*WE'RE HERE TO HELP*
• Did you request this cancellation? No action needed.
• Unexpected cancellation? Please contact us immediately - we'll resolve this right away.
• Want to place a new order? We'd be delighted to assist you.

We truly appreciate your understanding and hope to serve you again soon.

_Questions? Reply to this message anytime._

Sincerely,
*${displayShopName}*`
    }

    return statusMessages[status] || `Hi ${customerName}, your order #${orderNumber} is confirmed with ${displayShopName}.`
}
