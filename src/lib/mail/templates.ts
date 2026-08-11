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

// 🌐 Production Hosted Logo URL (ResellerPro Blue Logo)
const LOGO_URL = 'https://resellerpro.in/icons/icon-512x512.png'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://resellerpro.in'

/**
 * Amazon / Flipkart level reusable header for all ResellerPro emails
 */
const BRAND_HEADER = `
  <!-- Top Decorative Accent Bar -->
  <tr>
    <td style="height: 6px; background: linear-gradient(90deg, #2563eb 0%, #3b82f6 40%, #06b6d4 70%, #10b981 100%);"></td>
  </tr>

  <!-- Brand Header -->
  <tr>
    <td style="padding: 24px 32px; background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="vertical-align: middle;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align: middle; padding-right: 14px;">
                  <img src="${LOGO_URL}" alt="ResellerPro Logo" width="44" height="44" style="display: block; border-0: none; outline: none; text-decoration: none; width: 44px; height: 44px; object-fit: contain;" />
                </td>
                <td style="vertical-align: middle; border-left: 2px solid #e2e8f0; padding-left: 14px;">
                  <span style="font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: -0.6px; display: block; line-height: 1.1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif;">ResellerPro</span>
                  <span style="font-size: 10px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 2px; display: block;">E-Commerce Platform</span>
                </td>
              </tr>
            </table>
          </td>
          <td style="text-align: right; vertical-align: middle;">
            <span style="display: inline-block; background-color: #eff6ff; border: 1px solid #dbeafe; color: #1d4ed8; font-size: 11px; font-weight: 800; padding: 5px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
              Official Notification
            </span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`

/**
 * Standardized Footer for all emails
 */
const BRAND_FOOTER = `
  <tr>
    <td style="background-color: #0f172a; padding: 32px 32px 28px 32px; text-align: center; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="text-align: center; padding-bottom: 16px;">
            <img src="${LOGO_URL}" alt="ResellerPro" width="32" height="32" style="display: inline-block; filter: brightness(0) invert(1); opacity: 0.9;" />
          </td>
        </tr>
        <tr>
          <td style="text-align: center; padding-bottom: 16px;">
            <a href="${APP_URL}/dashboard" style="color: #94a3b8; text-decoration: none; font-size: 12px; font-weight: 600; margin: 0 10px;">Dashboard</a>
            <span style="color: #334155;">•</span>
            <a href="${APP_URL}/help" style="color: #94a3b8; text-decoration: none; font-size: 12px; font-weight: 600; margin: 0 10px;">Help Center</a>
            <span style="color: #334155;">•</span>
            <a href="${APP_URL}/privacy" style="color: #94a3b8; text-decoration: none; font-size: 12px; font-weight: 600; margin: 0 10px;">Privacy Policy</a>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">
            <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #cbd5e1;">
              ResellerPro — India's Premier E-Commerce Operating System
            </p>
            <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.5;">
              This is an automated operational email regarding your account.<br/>
              © 2026 ResellerPro. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`

export const templates = {
  // ─── 📦 AMAZON/FLIPKART LEVEL NEW ORDER ALERT (FOR RESELLERS) ────────────────
  newOrderResellerAlert: (data: NewOrderEmailData): EmailTemplate => {
    const itemsHtml = data.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 14px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="vertical-align: top;">
                  <div style="font-size: 14px; font-weight: 800; color: #0f172a; line-height: 1.3;">${item.name}</div>
                  <div style="font-size: 12px; font-weight: 600; color: #64748b; margin-top: 4px;">
                    Quantity: <span style="color: #0f172a; font-weight: 700;">${item.quantity}</span> × ₹${item.price.toLocaleString('en-IN')}
                  </div>
                </td>
                <td style="text-align: right; vertical-align: top; width: 100px;">
                  <div style="font-size: 15px; font-weight: 900; color: #0f172a;">
                    ₹${(item.quantity * item.price).toLocaleString('en-IN')}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `
      )
      .join('')

    return {
      subject: `📦 NEW ORDER RECEIVED! #${data.orderId.slice(0, 8).toUpperCase()} for ${data.storeName} (₹${data.total.toLocaleString('en-IN')})`,
      text: `CONGRATULATIONS ${data.resellerName.toUpperCase()}!\n\nYou received a new order on ${data.storeName}.\n\nOrder ID: #${data.orderId}\nCustomer: ${data.customerName} (${data.customerPhone})\nTotal Amount: ₹${data.total}\nPayment Method: ${data.paymentMethod.toUpperCase()}\n\nView details: ${APP_URL}/orders`,
      html: `
        <div style="background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 36px 12px; width: 100%; box-sizing: border-box;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #cbd5e1; overflow: hidden; box-shadow: 0 16px 40px -8px rgba(15, 23, 42, 0.12);">
            ${BRAND_HEADER}

            <!-- Main Order Banner -->
            <tr>
              <td style="padding: 32px 32px 24px 32px;">
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 14px; padding: 22px; color: #ffffff; text-align: center; box-shadow: 0 8px 20px -4px rgba(16, 185, 129, 0.35);">
                  <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; opacity: 0.9; margin-bottom: 4px;">
                    🎉 NEW SALE CONFIRMED
                  </div>
                  <div style="font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">
                    ₹${data.total.toLocaleString('en-IN')}
                  </div>
                  <div style="font-size: 13px; font-weight: 700; opacity: 0.95; margin-top: 6px; background: rgba(255,255,255,0.2); display: inline-block; padding: 4px 14px; border-radius: 20px;">
                    Order #${data.orderId.slice(0, 8).toUpperCase()} • ${data.storeName}
                  </div>
                </div>

                <p style="margin: 24px 0 20px 0; font-size: 15px; color: #334155; line-height: 1.6;">
                  Hello <strong>${data.resellerName}</strong>,<br/>
                  Congratulations! A new order has been placed on your storefront <strong>${data.storeName}</strong>. Please start processing it immediately.
                </p>

                <!-- Customer Details Card -->
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                  <div style="font-size: 11px; font-weight: 900; text-transform: uppercase; color: #2563eb; letter-spacing: 1.2px; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                    👤 CUSTOMER & SHIPPING DETAILS
                  </div>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="font-size: 13px; color: #64748b; padding-bottom: 8px; width: 130px; font-weight: 600;">Customer Name:</td>
                      <td style="font-size: 13px; font-weight: 800; color: #0f172a; padding-bottom: 8px;">${data.customerName}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 13px; color: #64748b; padding-bottom: 8px; font-weight: 600;">Phone Number:</td>
                      <td style="font-size: 13px; font-weight: 800; color: #0f172a; padding-bottom: 8px;">
                        <a href="tel:${data.customerPhone}" style="color: #2563eb; text-decoration: none;">${data.customerPhone}</a>
                      </td>
                    </tr>
                    ${
                      data.customerEmail
                        ? `
                    <tr>
                      <td style="font-size: 13px; color: #64748b; padding-bottom: 8px; font-weight: 600;">Email Address:</td>
                      <td style="font-size: 13px; font-weight: 800; color: #0f172a; padding-bottom: 8px;">${data.customerEmail}</td>
                    </tr>
                    `
                        : ''
                    }
                    <tr>
                      <td style="font-size: 13px; color: #64748b; vertical-align: top; padding-top: 4px; font-weight: 600;">Shipping Address:</td>
                      <td style="font-size: 13px; font-weight: 700; color: #0f172a; vertical-align: top; padding-top: 4px; line-height: 1.5; background: #ffffff; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1;">
                        ${data.shippingAddress}
                      </td>
                    </tr>
                  </table>
                </div>

                <!-- Flipkart/Amazon Style Items Summary -->
                <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                  <div style="font-size: 11px; font-weight: 900; text-transform: uppercase; color: #64748b; letter-spacing: 1.2px; margin-bottom: 14px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
                    🛒 ORDERED ITEMS (${data.items.length})
                  </div>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    ${itemsHtml}
                  </table>

                  <!-- Financial Breakdown -->
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 16px; border-top: 2px solid #f1f5f9; padding-top: 12px;">
                    <tr>
                      <td style="font-size: 13px; color: #64748b; padding-top: 4px; font-weight: 600;">Item Subtotal:</td>
                      <td style="font-size: 13px; font-weight: 700; color: #0f172a; text-align: right; padding-top: 4px;">₹${data.subtotal.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 13px; color: #64748b; padding-top: 6px; font-weight: 600;">Shipping Charges:</td>
                      <td style="font-size: 13px; font-weight: 700; color: #059669; text-align: right; padding-top: 6px;">
                        ${data.shippingFee === 0 ? 'FREE SHIPPING' : `₹${data.shippingFee}`}
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size: 16px; font-weight: 900; color: #0f172a; padding-top: 12px; border-top: 1px solid #f1f5f9;">Grand Total:</td>
                      <td style="font-size: 20px; font-weight: 900; color: #2563eb; text-align: right; padding-top: 12px; border-top: 1px solid #f1f5f9;">₹${data.total.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 12px; color: #64748b; padding-top: 8px; font-weight: 600;">Payment Mode:</td>
                      <td style="font-size: 12px; font-weight: 800; color: #0f172a; text-transform: uppercase; text-align: right; padding-top: 8px;">
                        <span style="background: #ecfdf5; color: #047857; padding: 3px 10px; border-radius: 12px; border: 1px solid #a7f3d0;">${data.paymentMethod}</span>
                      </td>
                    </tr>
                  </table>
                </div>

                <!-- High-Impact Action Button -->
                <div style="text-align: center; margin-top: 32px; margin-bottom: 8px;">
                  <a href="${APP_URL}/orders" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 15px 36px; border-radius: 12px; font-weight: 900; font-size: 15px; display: inline-block; box-shadow: 0 8px 20px -4px rgba(37, 99, 235, 0.4); letter-spacing: -0.2px;">
                    Process Order in Dashboard →
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

  // ─── 🔑 AMAZON/GOOGLE LEVEL OTP VERIFICATION EMAIL ────────────────────────
  otpCode: (otp: string): EmailTemplate => ({
    subject: `🔑 ${otp} is your ResellerPro Security Code`,
    text: `Your ResellerPro verification code is: ${otp}. This code is valid for 5 minutes. Do not share this code with anyone.`,
    html: `
      <div style="background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 36px 12px; width: 100%; box-sizing: border-box;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #cbd5e1; overflow: hidden; box-shadow: 0 16px 40px -8px rgba(15, 23, 42, 0.1);">
          ${BRAND_HEADER}

          <!-- Body -->
          <tr>
            <td style="padding: 36px; text-align: center;">
              
              <!-- Lock Badge -->
              <div style="margin: 0 auto 20px auto; width: 60px; height: 60px; background: linear-gradient(135deg, #eff6ff, #dbeafe); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);">
                <span style="font-size: 28px; line-height: 60px;">🔒</span>
              </div>

              <h1 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px;">
                Identity Verification
              </h1>

              <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 1.6; color: #475569; max-width: 380px; margin-left: auto; margin-right: auto;">
                Use the single-use security code below to log in or verify your action on <strong>ResellerPro</strong>.
              </p>

              <!-- Premium OTP Code Card -->
              <div style="background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); border: 2px dashed #cbd5e1; border-radius: 16px; padding: 26px 18px; margin: 0 auto 28px auto; max-width: 340px;">
                <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 2px; margin-bottom: 10px;">
                  ONE-TIME VERIFICATION CODE
                </div>
                <div style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Monaco, monospace; font-size: 40px; font-weight: 900; color: #2563eb; letter-spacing: 12px; line-height: 1; padding-left: 12px;">
                  ${otp}
                </div>
                <div style="margin-top: 16px; font-size: 12px; font-weight: 700; color: #dc2626; display: inline-block; background: #fef2f2; border: 1px solid #fecaca; padding: 5px 16px; border-radius: 20px;">
                  ⏱️ Code expires in 5 minutes
                </div>
              </div>

              <!-- Security Notice -->
              <div style="background-color: #fffbe6; border: 1px solid #fef08a; border-radius: 12px; padding: 14px 18px; text-align: left; margin-bottom: 24px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td width="26" style="vertical-align: top; padding-right: 10px; font-size: 18px;">💡</td>
                    <td style="font-size: 12px; line-height: 1.5; color: #713f12; font-weight: 500;">
                      <strong>Security Tip:</strong> Never share this code with anyone. ResellerPro support will never ask for your verification code.
                    </td>
                  </tr>
                </table>
              </div>

              <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                If you didn't request this verification code, please ignore this email.
              </p>

            </td>
          </tr>

          ${BRAND_FOOTER}
        </table>
      </div>
    `,
  }),

  // ─── 🚀 SUBSCRIPTION CONFIRMATION EMAIL ────────────────────────────────────
  subscriptionConfirmation: (userName: string, planName: string, endDate: string): EmailTemplate => ({
    subject: `🎉 Subscription Active! Welcome to ResellerPro ${planName}`,
    text: `Hello ${userName},\n\nThank you for subscribing to the ${planName} plan! Your subscription is active until ${endDate}.\n\nPlease find your contract note attached.\n\nBest regards,\nResellerPro Team`,
    html: `
      <div style="background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 36px 12px; width: 100%; box-sizing: border-box;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #cbd5e1; overflow: hidden; box-shadow: 0 16px 40px -8px rgba(15, 23, 42, 0.1);">
          ${BRAND_HEADER}

          <tr>
            <td style="padding: 36px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="margin: 0 auto 16px auto; width: 64px; height: 64px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);">
                  <span style="font-size: 32px; line-height: 64px;">💎</span>
                </div>
                <h2 style="margin: 0; font-size: 24px; font-weight: 900; color: #0f172a;">Subscription Confirmed!</h2>
                <div style="font-size: 14px; font-weight: 700; color: #059669; margin-top: 4px;">Welcome to ${planName}</div>
              </div>
              
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155; line-height: 1.6;">Hello <strong>${userName}</strong>,</p>
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #334155; line-height: 1.6;">Thank you for upgrading your business! Your subscription to the <strong style="color: #2563eb;">${planName}</strong> plan is now active.</p>

              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="font-size: 13px; color: #166534; font-weight: 700;">Activated Plan:</td>
                    <td style="font-size: 14px; color: #15803d; font-weight: 900; text-align: right;">${planName}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 13px; color: #166534; font-weight: 700; padding-top: 10px;">Validity Until:</td>
                    <td style="font-size: 14px; color: #15803d; font-weight: 900; text-align: right; padding-top: 10px;">${endDate}</td>
                  </tr>
                </table>
              </div>

              <p style="margin: 0 0 24px 0; font-size: 13px; color: #64748b; line-height: 1.5;">Your official contract note / tax invoice is attached to this email for your financial records.</p>
              
              <div style="text-align: center; margin-top: 28px;">
                <a href="${APP_URL}/dashboard" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 900; font-size: 15px; display: inline-block; box-shadow: 0 8px 20px -4px rgba(37,99,235,0.35);">
                  Launch Dashboard →
                </a>
              </div>
            </td>
          </tr>

          ${BRAND_FOOTER}
        </table>
      </div>
    `,
  }),

  // ─── ⏳ SUBSCRIPTION EXPIRY REMINDER ──────────────────────────────────────
  subscriptionReminder: (userName: string, daysLeft: number, endDate: string): EmailTemplate => ({
    subject: `⚠️ Action Required: Your ResellerPro Subscription Expires in ${daysLeft} Days`,
    text: `Hello ${userName},\n\nYour subscription will expire in ${daysLeft} days on ${endDate}. Please renew to prevent service interruption.\n\nRenew Now: ${APP_URL}/dashboard/billing\n\nRegards,\nResellerPro Team`,
    html: `
      <div style="background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 36px 12px; width: 100%; box-sizing: border-box;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #cbd5e1; overflow: hidden; box-shadow: 0 16px 40px -8px rgba(15, 23, 42, 0.1);">
          ${BRAND_HEADER}

          <tr>
            <td style="padding: 36px; text-align: center;">
              <div style="margin: 0 auto 16px auto; width: 60px; height: 60px; background-color: #fffbe6; border: 1px solid #fef08a; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                <span style="font-size: 28px; line-height: 60px;">⏳</span>
              </div>
              <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 900; color: #92400e;">Subscription Expiring Soon</h2>
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #334155; line-height: 1.6;">Hello <strong>${userName}</strong>,</p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #475569; line-height: 1.6;">
                Your subscription will expire in <strong style="color: #dc2626; font-size: 16px;">${daysLeft} days</strong> on <strong>${endDate}</strong>. Renew today to keep your store online and avoid interruptions.
              </p>
              
              <div style="margin-bottom: 28px;">
                <a href="${APP_URL}/dashboard/billing" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 900; font-size: 15px; display: inline-block; box-shadow: 0 8px 20px -4px rgba(37,99,235,0.35);">
                  Renew Subscription Now →
                </a>
              </div>
            </td>
          </tr>

          ${BRAND_FOOTER}
        </table>
      </div>
    `,
  }),

  // ─── 💬 ENQUIRY ALERT ──────────────────────────────────────────────────────
  enquiryAlert: (userName: string, unreadCount: number): EmailTemplate => ({
    subject: `💬 You have ${unreadCount} new customer enquiries on ResellerPro`,
    text: `Hello ${userName},\n\nYou have ${unreadCount} enquiries waiting for your response. Please check your dashboard.\n\nView Enquiries: ${APP_URL}/dashboard/enquiries\n\nRegards,\nResellerPro Team`,
    html: `
      <div style="background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 36px 12px; width: 100%; box-sizing: border-box;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #cbd5e1; overflow: hidden; box-shadow: 0 16px 40px -8px rgba(15, 23, 42, 0.1);">
          ${BRAND_HEADER}

          <tr>
            <td style="padding: 36px; text-align: center;">
              <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 900; color: #0f172a;">Customer Enquiries Waiting</h2>
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">Hello <strong>${userName}</strong>,</p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #475569;">
                You have <strong style="color: #2563eb; font-size: 16px;">${unreadCount}</strong> pending customer enquiries waiting for your response. Responding quickly increases store conversions!
              </p>
              <div style="margin-bottom: 20px;">
                <a href="${APP_URL}/dashboard/enquiries" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 900; font-size: 15px; display: inline-block; box-shadow: 0 8px 20px -4px rgba(37,99,235,0.35);">
                  View & Reply Enquiries →
                </a>
              </div>
            </td>
          </tr>

          ${BRAND_FOOTER}
        </table>
      </div>
    `,
  }),



  // ─── 🔔 GENERIC ORDER ALERT ───────────────────────────────────────────────
  orderAlert: (userName: string, pendingCount: number): EmailTemplate => ({
    subject: `Start Processing: You have ${pendingCount} new orders`,
    text: `Hello ${userName},\n\nYou have ${pendingCount} pending orders waiting for processing. Please check your dashboard to avoid delays.\n\nProcess Orders: ${APP_URL}/dashboard/orders\n\nRegards,\nResellerPro Team`,
    html: `
      <div style="background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 36px 12px; width: 100%; box-sizing: border-box;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #cbd5e1; overflow: hidden; box-shadow: 0 16px 40px -8px rgba(15, 23, 42, 0.1);">
          ${BRAND_HEADER}

          <tr>
            <td style="padding: 36px; text-align: center;">
              <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 900; color: #0f172a;">Action Required: New Orders</h2>
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">Hello <strong>${userName}</strong>,</p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #475569;">
                You have <strong style="color: #059669; font-size: 16px;">${pendingCount}</strong> pending orders waiting to be processed.
              </p>
              <div style="margin-bottom: 20px;">
                <a href="${APP_URL}/orders" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 900; font-size: 15px; display: inline-block; box-shadow: 0 8px 20px -4px rgba(37,99,235,0.35);">
                  Process Orders Now →
                </a>
              </div>
            </td>
          </tr>

          ${BRAND_FOOTER}
        </table>
      </div>
    `,
  }),
}
