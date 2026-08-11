import { EmailTemplate } from './types'

export interface OrderItemDetail {
  name: string
  quantity: number
  price: number
  image?: string | null
}

export interface NewOrderEmailData {
  orderId: string
  resellerName: string
  storeName: string
  customerName: string
  customerPhone: string
  customerEmail?: string | null
  shippingAddress: string
  paymentMethod: string
  items: OrderItemDetail[]
  subtotal: number
  shippingFee: number
  total: number
  orderNotes?: string | null
}

const BRAND_HEADER = `
  <!-- Top Gradient Accent Bar -->
  <tr>
    <td style="height: 5px; background: linear-gradient(90deg, #4f46e5 0%, #3b82f6 50%, #10b981 100%);"></td>
  </tr>

  <!-- Header with ResellerPro Branding -->
  <tr>
    <td style="padding: 28px 32px; background-color: #ffffff; text-align: center; border-bottom: 1px solid #f1f5f9;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
        <tr>
          <td style="background: linear-gradient(135deg, #4f46e5, #3b82f6); border-radius: 10px; width: 38px; height: 38px; text-align: center; color: #ffffff; font-weight: 900; font-size: 20px; line-height: 38px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);">
            R
          </td>
          <td style="padding-left: 12px; text-align: left;">
            <span style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; display: block; line-height: 1.1;">ResellerPro</span>
            <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1.2px; margin-top: 3px; display: block;">E-Commerce Platform</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`

const BRAND_FOOTER = `
  <tr>
    <td style="background-color: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0; text-align: center; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px;">
      <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #475569;">
        ResellerPro Automated Notification
      </p>
      <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.4;">
        Powering High-Growth E-Commerce Stores across India.<br/>
        © 2026 ResellerPro. All rights reserved.
      </p>
    </td>
  </tr>
`

export const templates = {
  // ─── INSTANT RESELLER NEW ORDER NOTIFICATION ─────────────────────────────────
  newOrderResellerAlert: (data: NewOrderEmailData): EmailTemplate => {
    const itemsHtml = data.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; vertical-align: middle;">
            <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${item.name}</div>
            <div style="font-size: 12px; color: #64748b;">Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')}</div>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; text-align: right; vertical-align: middle; font-size: 14px; font-weight: 800; color: #0f172a;">
            ₹${(item.quantity * item.price).toLocaleString('en-IN')}
          </td>
        </tr>
      `
      )
      .join('')

    return {
      subject: `🚨 NEW ORDER #${data.orderId.slice(0, 8).toUpperCase()} received for ${data.storeName}! (₹${data.total.toLocaleString('en-IN')})`,
      text: `Congratulations ${data.resellerName}!\n\nYou received a new order on ${data.storeName}.\n\nOrder ID: #${data.orderId}\nCustomer: ${data.customerName} (${data.customerPhone})\nTotal Amount: ₹${data.total}\nPayment Method: ${data.paymentMethod.toUpperCase()}\n\nView details: ${process.env.NEXT_PUBLIC_APP_URL || 'https://resellerpro.in'}/orders`,
      html: `
        <div style="background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 12px; width: 100%; box-sizing: border-box;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #cbd5e1; overflow: hidden; box-shadow: 0 12px 32px -4px rgba(15, 23, 42, 0.1);">
            ${BRAND_HEADER}

            <!-- Body -->
            <tr>
              <td style="padding: 32px 32px 24px 32px;">
                
                <!-- Badge Banner -->
                <div style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); border: 1px solid #a7f3d0; border-radius: 12px; padding: 18px; margin-bottom: 24px; text-align: center;">
                  <span style="font-size: 28px; line-height: 1; display: block; margin-bottom: 6px;">🎉 📦</span>
                  <div style="font-size: 18px; font-weight: 800; color: #065f46; letter-spacing: -0.3px;">New Order Received!</div>
                  <div style="font-size: 13px; font-weight: 600; color: #047857; margin-top: 4px;">
                    Order #${data.orderId.slice(0, 8).toUpperCase()} • ${data.storeName}
                  </div>
                </div>

                <p style="margin: 0 0 20px 0; font-size: 15px; color: #334155; line-height: 1.6;">
                  Hello <strong>${data.resellerName}</strong>,<br/>
                  Great news! A new order has just been placed on your store <strong>${data.storeName}</strong>.
                </p>

                <!-- Customer Details Card -->
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                  <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 1px; margin-bottom: 10px;">
                    👤 CUSTOMER DETAILS
                  </div>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="font-size: 13px; color: #64748b; padding-bottom: 6px;">Customer Name:</td>
                      <td style="font-size: 13px; font-weight: 700; color: #0f172a; text-align: right; padding-bottom: 6px;">${data.customerName}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 13px; color: #64748b; padding-bottom: 6px;">Phone:</td>
                      <td style="font-size: 13px; font-weight: 700; color: #0f172a; text-align: right; padding-bottom: 6px;">${data.customerPhone}</td>
                    </tr>
                    ${
                      data.customerEmail
                        ? `
                    <tr>
                      <td style="font-size: 13px; color: #64748b; padding-bottom: 6px;">Email:</td>
                      <td style="font-size: 13px; font-weight: 700; color: #0f172a; text-align: right; padding-bottom: 6px;">${data.customerEmail}</td>
                    </tr>
                    `
                        : ''
                    }
                    <tr>
                      <td style="font-size: 13px; color: #64748b; vertical-align: top; padding-top: 4px;">Shipping Address:</td>
                      <td style="font-size: 13px; font-weight: 700; color: #0f172a; text-align: right; vertical-align: top; padding-top: 4px; line-height: 1.4;">${data.shippingAddress}</td>
                    </tr>
                  </table>
                </div>

                <!-- Order Items Table -->
                <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                  <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 1px; margin-bottom: 12px;">
                    🛒 ORDER SUMMARY
                  </div>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    ${itemsHtml}
                  </table>

                  <!-- Totals -->
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 14px; pt-2;">
                    <tr>
                      <td style="font-size: 13px; color: #64748b; padding-top: 4px;">Subtotal:</td>
                      <td style="font-size: 13px; font-weight: 600; color: #0f172a; text-align: right; padding-top: 4px;">₹${data.subtotal.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 13px; color: #64748b; padding-top: 4px;">Shipping Fee:</td>
                      <td style="font-size: 13px; font-weight: 600; color: #0f172a; text-align: right; padding-top: 4px;">${data.shippingFee === 0 ? 'FREE' : `₹${data.shippingFee}`}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 15px; font-weight: 800; color: #0f172a; padding-top: 10px;">Grand Total:</td>
                      <td style="font-size: 18px; font-weight: 900; color: #4f46e5; text-align: right; padding-top: 10px;">₹${data.total.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 12px; color: #64748b; padding-top: 6px;">Payment Method:</td>
                      <td style="font-size: 12px; font-weight: 800; color: #059669; text-transform: uppercase; text-align: right; padding-top: 6px;">${data.paymentMethod}</td>
                    </tr>
                  </table>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin-top: 28px;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://resellerpro.in'}/orders" style="background: linear-gradient(135deg, #4f46e5, #3b82f6); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);">
                    View & Process Order →
                  </a>
                </div>

              </td>
            </tr>

            ${BRAND_FOOTER}
          </table>
        </div>
      `,
    }
  },

  // ─── INSTANT CUSTOMER ORDER RECEIPT ──────────────────────────────────────────
  customerOrderConfirmation: (data: NewOrderEmailData): EmailTemplate => {
    const itemsHtml = data.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
            <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${item.name}</div>
            <div style="font-size: 12px; color: #64748b;">Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')}</div>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-size: 14px; font-weight: 800; color: #0f172a;">
            ₹${(item.quantity * item.price).toLocaleString('en-IN')}
          </td>
        </tr>
      `
      )
      .join('')

    return {
      subject: `Order Confirmation #${data.orderId.slice(0, 8).toUpperCase()} from ${data.storeName}`,
      text: `Hello ${data.customerName},\n\nThank you for shopping at ${data.storeName}! Your order #${data.orderId.slice(0, 8).toUpperCase()} has been received.\n\nTotal Amount: ₹${data.total}\nPayment Method: ${data.paymentMethod.toUpperCase()}\n\nThank you for your business!`,
      html: `
        <div style="background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 12px; width: 100%; box-sizing: border-box;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 28px -5px rgba(0, 0, 0, 0.05);">
            ${BRAND_HEADER}

            <tr>
              <td style="padding: 32px 32px 24px 32px;">
                <div style="background-color: #e0f2fe; border: 1px solid #bae6fd; border-radius: 12px; padding: 18px; margin-bottom: 24px; text-align: center;">
                  <span style="font-size: 28px; line-height: 1; display: block; margin-bottom: 6px;">🛍️ ✨</span>
                  <div style="font-size: 18px; font-weight: 800; color: #0369a1;">Thank You For Your Order!</div>
                  <div style="font-size: 13px; font-weight: 600; color: #0284c7; margin-top: 4px;">
                    Order #${data.orderId.slice(0, 8).toUpperCase()} from ${data.storeName}
                  </div>
                </div>

                <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155; line-height: 1.6;">
                  Hello <strong>${data.customerName}</strong>,<br/>
                  We have received your order at <strong>${data.storeName}</strong> and are preparing it for dispatch!
                </p>

                <!-- Summary Box -->
                <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                  <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 1px; margin-bottom: 12px;">
                    ITEMS ORDERED
                  </div>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    ${itemsHtml}
                  </table>

                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 14px;">
                    <tr>
                      <td style="font-size: 15px; font-weight: 800; color: #0f172a;">Total Paid/Due:</td>
                      <td style="font-size: 18px; font-weight: 900; color: #4f46e5; text-align: right;">₹${data.total.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 12px; color: #64748b; padding-top: 4px;">Payment Method:</td>
                      <td style="font-size: 12px; font-weight: 800; color: #059669; text-transform: uppercase; text-align: right; padding-top: 4px;">${data.paymentMethod}</td>
                    </tr>
                  </table>
                </div>

                <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5; text-align: center;">
                  If you have any questions about your order, please contact <strong>${data.storeName}</strong>.
                </p>
              </td>
            </tr>

            ${BRAND_FOOTER}
          </table>
        </div>
      `,
    }
  },

  // ─── SUBSCRIPTION CONFIRMATION ───────────────────────────────────────────────
  subscriptionConfirmation: (userName: string, planName: string, endDate: string): EmailTemplate => ({
    subject: `Subscription Confirmed - Welcome to ResellerPro`,
    text: `Hello ${userName},\n\nThank you for subscribing to the ${planName} plan! Your subscription is active until ${endDate}.\n\nPlease find your contract note attached.\n\nBest regards,\nResellerPro Team`,
    html: `
      <div style="background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 10px; width: 100%; box-sizing: border-box;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          ${BRAND_HEADER}

          <tr>
            <td style="padding: 32px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <span style="font-size: 32px; display: block; margin-bottom: 8px;">🎉 🚀</span>
                <h2 style="margin: 0; font-size: 22px; font-weight: 800; color: #0f172a;">Subscription Active!</h2>
              </div>
              
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155; line-height: 1.6;">Hello <strong>${userName}</strong>,</p>
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #334155; line-height: 1.6;">Thank you for upgrading your account! Your subscription to the <strong style="color: #059669;">${planName}</strong> plan is now active.</p>

              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="font-size: 13px; color: #166534; font-weight: 600;">Plan Name:</td>
                    <td style="font-size: 14px; color: #15803d; font-weight: 700; text-align: right;">${planName}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 13px; color: #166534; font-weight: 600; padding-top: 8px;">Active Until:</td>
                    <td style="font-size: 14px; color: #15803d; font-weight: 700; text-align: right; padding-top: 8px;">${endDate}</td>
                  </tr>
                </table>
              </div>

              <p style="margin: 0 0 24px 0; font-size: 14px; color: #64748b; line-height: 1.5;">Your official contract note is attached to this email for your financial records.</p>
              
              <div style="text-align: center; margin-top: 28px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://resellerpro.in'}/dashboard" style="background: linear-gradient(135deg, #059669, #10b981); color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 12px; font-weight: 800; font-size: 14px; display: inline-block; box-shadow: 0 4px 10px rgba(5,150,105,0.3);">Go to Dashboard →</a>
              </div>
            </td>
          </tr>

          ${BRAND_FOOTER}
        </table>
      </div>
    `,
  }),

  // ─── SUBSCRIPTION REMINDER ──────────────────────────────────────────────────
  subscriptionReminder: (userName: string, daysLeft: number, endDate: string): EmailTemplate => ({
    subject: `Action Required: Your Subscription Expires in ${daysLeft} Days`,
    text: `Hello ${userName},\n\nYour subscription will expire in ${daysLeft} days on ${endDate}. Please renew to prevent service interruption.\n\nRenew Now: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing\n\nRegards,\nResellerPro Team`,
    html: `
      <div style="background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 10px; width: 100%; box-sizing: border-box;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          ${BRAND_HEADER}

          <tr>
            <td style="padding: 32px; text-align: center;">
              <div style="display: inline-block; background-color: #fffbe6; border-radius: 50%; padding: 16px; margin-bottom: 16px;">
                <span style="font-size: 28px;">⏳</span>
              </div>
              <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #92400e;">Subscription Expiring Soon</h2>
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #334155; line-height: 1.6;">Hello <strong>${userName}</strong>,</p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #475569; line-height: 1.6;">
                Your subscription will expire in <strong style="color: #dc2626;">${daysLeft} days</strong> on <strong>${endDate}</strong>. Renew today to avoid interruption to your storefront and services.
              </p>
              
              <div style="margin-bottom: 28px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://resellerpro.in'}/dashboard/billing" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 12px; font-weight: 800; font-size: 14px; display: inline-block; box-shadow: 0 4px 10px rgba(37,99,235,0.3);">Renew Subscription →</a>
              </div>
            </td>
          </tr>

          ${BRAND_FOOTER}
        </table>
      </div>
    `,
  }),

  // ─── OTP / VERIFICATION CODE ───────────────────────────────────────────────
  otpCode: (otp: string): EmailTemplate => ({
    subject: `${otp} is your ResellerPro Verification Code`,
    text: `Your ResellerPro verification code is: ${otp}. This code is valid for 5 minutes. Do not share this code with anyone.`,
    html: `
      <div style="background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 40px 10px; width: 100%; box-sizing: border-box;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          ${BRAND_HEADER}

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px; text-align: center;">
              
              <!-- Icon Badge -->
              <div style="margin: 0 auto 20px auto; width: 52px; height: 52px; background-color: #eef2ff; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                <span style="font-size: 24px; line-height: 52px;">🔒</span>
              </div>

              <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.3px;">
                Verification Code
              </h1>

              <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 1.6; color: #475569; max-width: 400px; margin-left: auto; margin-right: auto;">
                Use the single-use verification code below to complete your sign-in to <strong>ResellerPro</strong>.
              </p>

              <!-- OTP Code Card -->
              <div style="background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid #cbd5e1; border-radius: 14px; padding: 22px 16px; margin: 0 auto 28px auto; max-width: 340px;">
                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 1.5px; margin-bottom: 8px;">
                  ONE-TIME PASSCODE
                </div>
                <div style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; font-size: 36px; font-weight: 800; color: #4f46e5; letter-spacing: 10px; line-height: 1; padding-left: 10px;">
                  ${otp}
                </div>
                <div style="margin-top: 14px; font-size: 12px; font-weight: 600; color: #e11d48; display: inline-block; background: #ffe4e6; padding: 4px 14px; border-radius: 20px;">
                  ⏱️ Expires in 5 minutes
                </div>
              </div>

              <!-- Security Warning Box -->
              <div style="background-color: #fffbe6; border: 1px solid #fef08a; border-radius: 10px; padding: 14px 16px; text-align: left; margin-bottom: 24px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td width="24" style="vertical-align: top; padding-right: 10px; font-size: 16px;">💡</td>
                    <td style="font-size: 12px; line-height: 1.5; color: #713f12;">
                      <strong>Security Notice:</strong> Never share this code with anyone. ResellerPro staff will never ask for your verification code via phone or message.
                    </td>
                  </tr>
                </table>
              </div>

              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #94a3b8;">
                If you didn't attempt to sign in, please ignore this email.
              </p>

            </td>
          </tr>

          ${BRAND_FOOTER}
        </table>
      </div>
    `,
  }),

  // ─── ENQUIRY ALERT ──────────────────────────────────────────────────────────
  enquiryAlert: (userName: string, unreadCount: number): EmailTemplate => ({
    subject: `You have ${unreadCount} pending enquiries on ResellerPro`,
    text: `Hello ${userName},\n\nYou have ${unreadCount} enquiries waiting for your response. Please check your dashboard.\n\nView Enquiries: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/enquiries\n\nRegards,\nResellerPro Team`,
    html: `
      <div style="background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 10px; width: 100%; box-sizing: border-box;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          ${BRAND_HEADER}

          <tr>
            <td style="padding: 32px; text-align: center;">
              <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #0f172a;">Customer Enquiries Waiting</h2>
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">Hello <strong>${userName}</strong>,</p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #475569;">
                You have <strong style="color: #2563eb;">${unreadCount}</strong> pending customer enquiries waiting for your response.
              </p>
              <div style="margin-bottom: 20px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://resellerpro.in'}/dashboard/enquiries" style="background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block;">View Enquiries →</a>
              </div>
            </td>
          </tr>

          ${BRAND_FOOTER}
        </table>
      </div>
    `,
  }),

  // ─── ORDER STATUS UPDATE ────────────────────────────────────────────────────
  orderStatus: (customerName: string, orderId: string, status: string, isUpdate: boolean): EmailTemplate => {
    const title = isUpdate ? `Update on Order #${orderId.slice(0, 8).toUpperCase()}` : `Order #${orderId.slice(0, 8).toUpperCase()} Status: ${status}`
    return {
      subject: title,
      text: `Hello ${customerName},\n\nThe status of your order #${orderId.slice(0, 8).toUpperCase()} is now: ${status}.\n\nRegards,\nResellerPro Team`,
      html: `
        <div style="background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 10px; width: 100%; box-sizing: border-box;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
            ${BRAND_HEADER}

            <tr>
              <td style="padding: 32px; text-align: center;">
                <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #0f172a;">Order Status Update</h2>
                <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">Hello <strong>${customerName}</strong>,</p>
                <p style="margin: 0 0 20px 0; font-size: 14px; color: #475569;">
                  The status of your order <strong>#${orderId.slice(0, 8).toUpperCase()}</strong> has been updated:
                </p>
                <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; display: inline-block; min-width: 200px; margin-bottom: 20px;">
                  <span style="font-size: 16px; font-weight: 800; color: #1d4ed8; text-transform: uppercase;">${status}</span>
                </div>
              </td>
            </tr>

            ${BRAND_FOOTER}
          </table>
        </div>
      `,
    }
  },

  // ─── ORDER ALERT ─────────────────────────────────────────────────────────────
  orderAlert: (userName: string, pendingCount: number): EmailTemplate => ({
    subject: `Start Processing: You have ${pendingCount} new orders`,
    text: `Hello ${userName},\n\nYou have ${pendingCount} pending orders waiting for processing. Please check your dashboard to avoid delays.\n\nProcess Orders: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders\n\nRegards,\nResellerPro Team`,
    html: `
      <div style="background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 10px; width: 100%; box-sizing: border-box;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          ${BRAND_HEADER}

          <tr>
            <td style="padding: 32px; text-align: center;">
              <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #0f172a;">Action Required: New Orders</h2>
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">Hello <strong>${userName}</strong>,</p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #475569;">
                You have <strong style="color: #059669;">${pendingCount}</strong> pending orders waiting to be processed.
              </p>
              <div style="margin-bottom: 20px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://resellerpro.in'}/orders" style="background: #059669; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block;">Process Orders →</a>
              </div>
            </td>
          </tr>

          ${BRAND_FOOTER}
        </table>
      </div>
    `,
  }),
}
