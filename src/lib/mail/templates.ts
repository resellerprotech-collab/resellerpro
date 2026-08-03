
import { EmailTemplate } from './types'

export const templates = {
  subscriptionConfirmation: (userName: string, planName: string, endDate: string): EmailTemplate => ({
    subject: `Subscription Confirmed - Welcome to ResellerPro`,
    text: `Hello ${userName},\n\nThank you for subscribing to the ${planName} plan! Your subscription is active until ${endDate}.\n\nPlease find your contract note attached.\n\nBest regards,\nResellerPro Team`,
    html: `
      <div style="background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 10px; width: 100%; box-sizing: border-box;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #6366f1 100%);"></td>
          </tr>
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: center;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="background: linear-gradient(135deg, #10b981, #3b82f6); border-radius: 12px; padding: 10px 14px; color: #ffffff; font-weight: 800; font-size: 18px;">
                    RP
                  </td>
                  <td style="padding-left: 12px; text-align: left;">
                    <div style="font-size: 20px; font-weight: 800; color: #0f172a; line-height: 1;">ResellerPro</div>
                    <div style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-top: 3px;">Make It Professional</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px;"><div style="border-bottom: 1px solid #f1f5f9; width: 100%;"></div></td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #0f172a; text-align: center;">Subscription Confirmed! 🎉</h2>
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
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://resellerpro.in'}/dashboard" style="background: linear-gradient(135deg, #059669, #10b981); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block; shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">Go to Dashboard</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0; text-align: center; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">© 2026 ResellerPro. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </div>
    `
  }),

  subscriptionReminder: (userName: string, daysLeft: number, endDate: string): EmailTemplate => ({
    subject: `Action Required: Your Subscription Expires in ${daysLeft} Days`,
    text: `Hello ${userName},\n\nYour subscription will expire in ${daysLeft} days on ${endDate}. Please renew to prevent service interruption.\n\nRenew Now: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing\n\nRegards,\nResellerPro Team`,
    html: `
      <div style="background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 10px; width: 100%; box-sizing: border-box;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #f59e0b 0%, #ef4444 100%);"></td>
          </tr>
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: center;">
              <div style="font-size: 20px; font-weight: 800; color: #0f172a;">ResellerPro</div>
              <div style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-top: 3px;">Billing Notification</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px;"><div style="border-bottom: 1px solid #f1f5f9; width: 100%;"></div></td>
          </tr>
          <tr>
            <td style="padding: 32px; text-align: center;">
              <div style="display: inline-block; background-color: #fffbe6; border-radius: 50%; padding: 16px; margin-bottom: 16px;">
                <span style="font-size: 28px;">⏳</span>
              </div>
              <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #92400e;">Subscription Expiring Soon</h2>
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #334155; line-height: 1.6;">Hello <strong>${userName}</strong>,</p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #475569; line-height: 1.6;">
                Your subscription will expire in <strong style="color: #dc2626;">${daysLeft} days</strong> on <strong>${endDate}</strong>. Renew today to avoid interruption to your store front and services.
              </p>
              
              <div style="margin-bottom: 28px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://resellerpro.in'}/dashboard/billing" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37,99,235,0.3);">Renew Subscription</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0; text-align: center; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">© 2026 ResellerPro. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </div>
    `
  }),

  otpCode: (otp: string): EmailTemplate => ({
    subject: `${otp} is your ResellerPro Verification Code`,
    text: `Your ResellerPro verification code is: ${otp}. This code is valid for 5 minutes. Do not share this code with anyone.`,
    html: `
      <div style="background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 40px 10px; width: 100%; box-sizing: border-box;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);">
          
          <!-- Top Accent Bar -->
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #4f46e5 0%, #3b82f6 50%, #8b5cf6 100%);"></td>
          </tr>

          <!-- Header / Brand -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: center;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="background: linear-gradient(135deg, #4f46e5, #3b82f6); border-radius: 12px; padding: 10px 14px; color: #ffffff; font-weight: 800; font-size: 18px; letter-spacing: -0.5px;">
                    RP
                  </td>
                  <td style="padding-left: 12px; text-align: left;">
                    <div style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; line-height: 1;">ResellerPro</div>
                    <div style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-top: 3px;">Make It Professional</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 32px;">
              <div style="border-bottom: 1px solid #f1f5f9; width: 100%;"></div>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px; text-align: center;">
              
              <!-- Icon Badge -->
              <div style="margin: 0 auto 20px auto; width: 52px; height: 52px; background-color: #eef2ff; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                <span style="font-size: 24px; line-height: 52px;">🔒</span>
              </div>

              <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">
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
                    <td width="24" style="vertical-align: top; padding-right: 10px; font-size: 16px;">
                      💡
                    </td>
                    <td style="font-size: 12px; line-height: 1.5; color: #713f12;">
                      <strong>Security Notice:</strong> Never share this code with anyone. ResellerPro staff will never ask for your verification code via phone, email, or message.
                    </td>
                  </tr>
                </table>
              </div>

              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #94a3b8;">
                If you didn't attempt to sign in, please ignore this email or secure your account if you suspect unauthorized activity.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0; text-align: center; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px;">
              <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; color: #64748b;">
                ResellerPro Security Team
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.4;">
                This is an automated operational email sent to verify your identity.<br/>
                © 2026 ResellerPro. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </div>
    `
  }),

  enquiryAlert: (userName: string, unreadCount: number): EmailTemplate => ({
    subject: `You have ${unreadCount} pending enquiries`,
    text: `Hello ${userName},\n\nYou have ${unreadCount} enquiries waiting for your response. Please check your dashboard.\n\nView Enquiries: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/enquiries\n\nRegards,\nResellerPro Team`,
    html: `
      <div style="background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 10px; width: 100%; box-sizing: border-box;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #3b82f6 0%, #6366f1 100%);"></td>
          </tr>
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: center;">
              <div style="font-size: 20px; font-weight: 800; color: #0f172a;">ResellerPro</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px;"><div style="border-bottom: 1px solid #f1f5f9; width: 100%;"></div></td>
          </tr>
          <tr>
            <td style="padding: 32px; text-align: center;">
              <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #0f172a;">Enquiries Waiting</h2>
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">Hello <strong>${userName}</strong>,</p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #475569;">
                You have <strong style="color: #2563eb;">${unreadCount}</strong> pending enquiries waiting for your response. Responding quickly improves customer conversions!
              </p>
              <div style="margin-bottom: 20px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://resellerpro.in'}/dashboard/enquiries" style="background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block;">View Enquiries</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">© 2026 ResellerPro. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </div>
    `
  }),

  orderStatus: (customerName: string, orderId: string, status: string, isUpdate: boolean): EmailTemplate => {
    const title = isUpdate ? `Update on Order #${orderId}` : `Order #${orderId} Status: ${status}`
    return {
      subject: title,
      text: `Hello ${customerName},\n\nThe status of your order #${orderId} is now: ${status}.\n\nRegards,\nResellerPro Team`,
      html: `
        <div style="background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 10px; width: 100%; box-sizing: border-box;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
            <tr>
              <td style="height: 6px; background: linear-gradient(90deg, #3b82f6 0%, #10b981 100%);"></td>
            </tr>
            <tr>
              <td style="padding: 32px; text-align: center;">
                <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #0f172a;">Order Update</h2>
                <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">Hello <strong>${customerName}</strong>,</p>
                <p style="margin: 0 0 20px 0; font-size: 14px; color: #475569;">
                  The status of your order <strong>#${orderId}</strong> has been updated:
                </p>
                <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; display: inline-block; min-width: 200px; margin-bottom: 20px;">
                  <span style="font-size: 16px; font-weight: 700; color: #1d4ed8; text-transform: capitalize;">${status}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; font-size: 12px; color: #64748b;">© 2026 ResellerPro. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </div>
      `
    }
  },

  orderAlert: (userName: string, pendingCount: number): EmailTemplate => ({
    subject: `Start Processing: You have ${pendingCount} new orders`,
    text: `Hello ${userName},\n\nYou have ${pendingCount} pending orders waiting for processing. Please check your dashboard to avoid delays.\n\nProcess Orders: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders\n\nRegards,\nResellerPro Team`,
    html: `
      <div style="background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 10px; width: 100%; box-sizing: border-box;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #10b981 0%, #059669 100%);"></td>
          </tr>
          <tr>
            <td style="padding: 32px; text-align: center;">
              <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #0f172a;">Action Required: New Orders</h2>
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">Hello <strong>${userName}</strong>,</p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #475569;">
                You have <strong style="color: #059669;">${pendingCount}</strong> pending orders waiting to be processed.
              </p>
              <div style="margin-bottom: 20px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://resellerpro.in'}/dashboard/orders" style="background: #059669; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block;">Process Orders</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">© 2026 ResellerPro. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </div>
    `
  })
}
