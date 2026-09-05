'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, ShoppingBag, Truck, Smartphone, Package, Copy } from 'lucide-react'
import { generateWhatsAppLink } from '@/lib/whatsapp'
import type { Order, Profile, ShopTheme } from '@/types'

interface OrderSuccessClientProps {
  order: Order
  profile: Profile
  theme: ShopTheme | null
  shopSlug: string
}

const RealWhatsAppIcon = ({ className = 'w-5 h-5', fill = 'currentColor' }: { className?: string; fill?: string }) => (
  <svg className={className} fill={fill} viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

export function OrderSuccessClient({ order, profile, theme, shopSlug }: OrderSuccessClientProps) {
  const storeName = profile.business_name || profile.shop_name || 'Store'
  const waNum = profile.whatsapp_number || profile.business_phone || (profile as any).phone
  const waClean = waNum?.replace(/\D/g, '')

  const orderNumber = order.order_number || order.id.slice(0, 8).toUpperCase()
  const totalAmount = order.total_amount || 0

  const method = (order.payment_method || order.payment_method_v2 || 'cod').toLowerCase()
  const isUPI = method === 'upi' || method === 'online' || method === 'razorpay' || method === 'card'

  const items = order.order_items ?? []
  const itemSummary = items.map((i) => `${i.product_name} (Qty: ${i.quantity})`).join(', ')

  const waMessage = [
    `Hi ${storeName},`,
    `I just placed an order on your store.`,
    ``,
    `Order #${orderNumber}`,
    itemSummary ? `Items: ${itemSummary}` : null,
    ``,
    `Please confirm my order & product availability. Thank you!`,
  ].filter((line): line is string => line !== null).join('\n')

  const waLink = waClean
    ? generateWhatsAppLink(waClean, waMessage)
    : null

  function copyOrderId() {
    navigator.clipboard.writeText(String(orderNumber))
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-start justify-center px-4 py-10 pb-44 sm:pb-40">
      <div className="w-full max-w-md">

        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="flex flex-col items-center text-center mb-8"
        >
          <div className="relative mb-5">
            <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center border-2 border-green-100">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-green-300"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.8 }}
            />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-black text-slate-900 mb-1"
          >
            Order Placed
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-500 text-sm font-semibold"
          >
            Thank you for ordering from <span className="font-black text-slate-700">{storeName}</span>
          </motion.p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4"
        >
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Order Number</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-lg font-black text-slate-900">#{orderNumber}</p>
                <button onClick={copyOrderId} className="p-1 rounded hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors" title="Copy order ID">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Amount</p>
              <p className="text-lg font-black text-slate-900 mt-1">₹{totalAmount.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {items.length > 0 && (
            <div className="space-y-2.5 mb-5">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <Package className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-slate-600 truncate font-semibold block">{item.product_name} × {item.quantity}</span>
                      {item.variant_name && (
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
                          {item.variant_name}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 flex-shrink-0 ml-2">
                    ₹{((item as any).total_price || ((item as any).unit_selling_price || (item as any).unit_price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-slate-100 pt-4 flex items-center gap-2.5 text-sm text-slate-500">
            <Truck className="w-4 h-4 text-slate-400" />
            <span className="font-semibold">Expected delivery: <strong className="text-slate-700">3–5 working days</strong></span>
          </div>
        </motion.div>

        {/* Payment Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`rounded-2xl p-5 mb-5 border ${isUPI ? 'bg-blue-50/80 border-blue-100' : 'bg-emerald-50/80 border-emerald-100'}`}
        >
          <div className="flex items-start gap-3">
            {isUPI
              ? <Smartphone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              : <Truck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            }
            <div className="flex-1 min-w-0">
              <p className={`font-black text-sm ${isUPI ? 'text-blue-900' : 'text-emerald-900'}`}>
                {isUPI ? 'Pay via UPI / GPay' : 'Order Confirmed (Cash on Delivery)'}
              </p>

              {isUPI ? (
                <div className="mt-2 space-y-2 text-xs text-blue-700 font-medium">
                  <p>Please transfer <strong className="font-bold text-blue-900">₹{totalAmount.toLocaleString('en-IN')}</strong> to the seller's account below and send a payment screenshot on WhatsApp:</p>
                  <div className="bg-white p-2.5 rounded-xl border border-blue-200/70 flex items-center justify-between gap-2">
                    <div className="truncate">
                      <span className="text-[10px] uppercase font-bold text-blue-400 block">UPI ID / GPAY NUMBER</span>
                      <span className="font-bold font-mono text-blue-950 text-xs sm:text-sm">{profile.upi_id || 'Contact seller on WhatsApp'}</span>
                      {profile.upi_name && <span className="text-[11px] text-blue-600 block">({profile.upi_name})</span>}
                    </div>
                    {profile.upi_id && (
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(profile.upi_id || '')}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 flex-shrink-0"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs mt-1.5 leading-relaxed font-semibold text-emerald-700">
                  Your Cash on Delivery order is <strong>CONFIRMED</strong>! Pay ₹{totalAmount.toLocaleString('en-IN')} in cash when your package arrives. We will notify you with live tracking as soon as it ships.
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* What Happens Next */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5"
        >
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">What happens next?</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-500 flex-shrink-0">1</div>
              <p className="text-xs text-slate-500 font-semibold">Seller will confirm your order on WhatsApp</p>
            </div>
            {isUPI && (
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-500 flex-shrink-0">2</div>
                <p className="text-xs text-slate-500 font-semibold">Complete UPI payment and send screenshot</p>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-500 flex-shrink-0">{isUPI ? '3' : '2'}</div>
              <p className="text-xs text-slate-500 font-semibold">Your order will be packed and shipped within 24–48 hours</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-500 flex-shrink-0">{isUPI ? '4' : '3'}</div>
              <p className="text-xs text-slate-500 font-semibold">You'll receive tracking info via WhatsApp</p>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-[10px] text-slate-400 mt-6 font-semibold">
          Powered by <span className="font-black text-slate-500">ResellerPro</span>
        </p>
      </div>

      {/* Sticky Fixed Bottom Bar */}
      {waLink && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-3.5 sm:px-6 sm:py-4 shadow-[0_-6px_24px_rgba(0,0,0,0.12)]">
          <div className="max-w-md mx-auto flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:flex-1 py-3.5 px-4 flex items-center justify-center gap-2.5 rounded-xl text-white font-black text-sm bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <RealWhatsAppIcon className="w-5 h-5 fill-white shrink-0" />
              <span>Message via WhatsApp</span>
            </a>
            <Link
              href={`/store/${shopSlug}`}
              className="w-full sm:w-auto py-3.5 px-4 flex items-center justify-center gap-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all"
            >
              <ShoppingBag className="w-4 h-4 shrink-0 text-slate-500" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
