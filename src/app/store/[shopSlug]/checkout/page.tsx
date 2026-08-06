'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { 
  ChevronLeft, Truck, Smartphone, ShoppingBag, User, 
  ChevronRight, ShieldCheck, Lock, Package, Gift,
  HelpCircle, ChevronDown, Search, MessageCircle
} from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { createClient } from '@/lib/supabase/client'
import { trackEvent } from '@/lib/analytics'
import { placeOrder } from './actions'
import { StoreHeader } from '@/components/store/StoreHeader'
import type { ShopTheme } from '@/types'

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
  'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu and Kashmir','Ladakh','Puducherry',
]

const schema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  addressLine1: z.string().min(5, 'Enter full address'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit pincode'),
  paymentMethod: z.enum(['cod', 'upi']),
  orderNotes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface CheckoutPageProps {
  storeUserId: string
  shopSlug: string
  upiId?: string | null
  shopName?: string | null
  logoUrl?: string | null
  announcement?: string | null
  theme?: ShopTheme | null
}

function CheckoutPageInner({
  storeUserId,
  shopSlug,
  upiId,
  shopName,
  logoUrl,
  announcement,
  theme,
}: CheckoutPageProps) {
  const router = useRouter()
  const { items, getSubtotal, clearCart } = useCartStore()
  const [payment, setPayment] = useState<'cod' | 'upi'>('cod')
  const [loading, setLoading] = useState(false)

  const subtotal = getSubtotal()
  const shippingFee = subtotal >= 500 ? 0 : 49
  const total = subtotal + shippingFee

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: 'cod' },
  })

  useEffect(() => {
    if (items.length === 0) router.replace(`/store/${shopSlug}`)
    trackEvent({ userId: storeUserId, eventType: 'checkout_start', metadata: { itemCount: items.length, total } })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      const result = await placeOrder({
        storeUserId,
        customer: {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email || null,
        },
        shipping: {
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2 || null,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
        },
        paymentMethod: data.paymentMethod,
        orderNotes: data.orderNotes || null,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        shippingFee,
        total,
      })

      if (result.error) {
        throw new Error(result.error)
      }

      await trackEvent({
        userId: storeUserId,
        eventType: 'checkout_complete',
        orderId: result.orderId,
        metadata: { paymentMethod: data.paymentMethod, total },
      })

      clearCart()
      router.push(`/store/${shopSlug}/success/${result.orderId}`)
    } catch (err: any) {
      console.error('Checkout error:', err)
      alert(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) return null

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Store Header Navbar */}
      <StoreHeader
        shopSlug={shopSlug}
        shopName={shopName || 'Store'}
        logoUrl={logoUrl}
        announcement={announcement}
        theme={theme || null}
        activePage="checkout"
      />

      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200/80 py-3.5 sm:py-6 shadow-xs">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
              Shipping & Address Details
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
              Please enter your contact details and delivery address below.
            </p>
          </div>
          <button
            onClick={() => router.back()}
            type="button"
            className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-[11px] sm:text-xs px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3.5 sm:px-4 py-4 sm:py-10 pb-24 sm:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-8" id="checkout-form">

              {/* Section 1: Contact Information */}
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">Contact Information</h2>
                <div className="space-y-2.5 sm:space-y-3">
                  {/* Phone */}
                  <div className="relative">
                    <input
                      id="phone"
                      {...register('phone')}
                      placeholder="Mobile phone number *"
                      maxLength={10}
                      className="w-full h-10 sm:h-12 px-3.5 sm:px-4 pr-9 sm:pr-10 border border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 bg-white text-slate-900 transition-all placeholder:text-slate-400"
                    />
                    <HelpCircle className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.phone.message}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="Email address (optional)"
                      className="w-full h-10 sm:h-12 px-3.5 sm:px-4 border border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 bg-white text-slate-900 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Delivery Address */}
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">Delivery Address</h2>
                <div className="space-y-2.5 sm:space-y-3">

                  {/* Country/Region */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">COUNTRY/REGION</label>
                    <div className="relative">
                      <select
                        disabled
                        className="w-full h-10 sm:h-12 px-3.5 sm:px-4 pr-9 sm:pr-10 border border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm bg-white text-slate-800 appearance-none font-medium"
                      >
                        <option>India</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    <div>
                      <input
                        id="fullName"
                        {...register('fullName')}
                        placeholder="First name *"
                        className="w-full h-10 sm:h-12 px-3.5 sm:px-4 border border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 bg-white text-slate-900 transition-all placeholder:text-slate-400"
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.fullName.message}</p>}
                    </div>
                    <div>
                      <input
                        placeholder="Last name (optional)"
                        className="w-full h-10 sm:h-12 px-3.5 sm:px-4 border border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 bg-white text-slate-900 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Address Line 1 */}
                  <div className="relative">
                    <input
                      id="addressLine1"
                      {...register('addressLine1')}
                      placeholder="Address *"
                      className="w-full h-10 sm:h-12 px-3.5 sm:px-4 pr-9 sm:pr-10 border border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 bg-white text-slate-900 transition-all placeholder:text-slate-400"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    {errors.addressLine1 && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.addressLine1.message}</p>}
                  </div>

                  {/* Address Line 2 */}
                  <div>
                    <input
                      id="addressLine2"
                      {...register('addressLine2')}
                      placeholder="Apartment, suite, landmark, etc. (optional)"
                      className="w-full h-10 sm:h-12 px-3.5 sm:px-4 border border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 bg-white text-slate-900 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* City, State, PIN */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                    <div>
                      <input
                        id="city"
                        {...register('city')}
                        placeholder="City *"
                        className="w-full h-10 sm:h-12 px-3.5 sm:px-4 border border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 bg-white text-slate-900 transition-all placeholder:text-slate-400"
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.city.message}</p>}
                    </div>
                    <div className="relative">
                      <select
                        id="state"
                        {...register('state')}
                        className="w-full h-10 sm:h-12 px-3.5 sm:px-4 pr-8 border border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 bg-white text-slate-900 transition-all appearance-none"
                      >
                        <option value="">State *</option>
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      {errors.state && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.state.message}</p>}
                    </div>
                    <div>
                      <input
                        id="pincode"
                        {...register('pincode')}
                        placeholder="PIN code *"
                        maxLength={6}
                        className="w-full h-10 sm:h-12 px-3.5 sm:px-4 border border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 bg-white text-slate-900 transition-all placeholder:text-slate-400"
                      />
                      {errors.pincode && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.pincode.message}</p>}
                    </div>
                  </div>

                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2.5 sm:space-y-3">
                <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">Payment Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {(['cod', 'upi'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => { setPayment(method); setValue('paymentMethod', method) }}
                      className={`flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border-2 transition-all text-left cursor-pointer ${
                        payment === method 
                          ? 'border-slate-900 bg-slate-50' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${
                        payment === method ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {method === 'cod' ? <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-slate-900">{method === 'cod' ? 'Cash on Delivery' : 'Pay via UPI'}</p>
                        <p className="text-[10px] text-slate-500 truncate">{method === 'cod' ? 'Pay on delivery' : 'UPI link on WhatsApp'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust Badges Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                <div className="bg-slate-50/80 border border-slate-200/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100/60">
                    <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Free Shipping</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">Fast delivery across India</p>
                  </div>
                </div>

                <div className="bg-slate-50/80 border border-slate-200/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/60">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">100% Authentic</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">Direct WhatsApp order</p>
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="lg:sticky lg:top-24">
              <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-7 space-y-4 sm:space-y-6">
                
                {/* Header */}
                <div>
                  <h2 className="text-xs font-black text-slate-700 uppercase tracking-wider">ORDER SUMMARY</h2>
                  <div className="border-b border-slate-200/80 mt-4" />
                </div>

                {/* Product List */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.productId} className="bg-white border border-slate-200/80 rounded-2xl p-3.5 flex gap-3.5 items-center shadow-xs">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 relative shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-[10px] font-black rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-black text-slate-900 shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Costs Breakdown */}
                <div className="border-t border-slate-200/80 pt-4 space-y-3">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-1">
                      Shipping <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    </span>
                    {shippingFee === 0 ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                        FREE DELIVERY
                      </span>
                    ) : (
                      <span className="font-bold text-slate-900">₹{shippingFee}</span>
                    )}
                  </div>

                  <div className="border-t border-slate-200/80 pt-3">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-base text-slate-900">Total</span>
                      <div className="text-right">
                        <span className="text-[11px] font-bold text-slate-400 mr-1.5">INR</span>
                        <span className="font-extrabold text-xl text-slate-900">₹{total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Including estimated taxes & charges</p>
                  </div>
                </div>

                {/* Desktop WhatsApp Place Order Button */}
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={loading}
                  className="hidden lg:flex w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base items-center justify-center gap-2.5 transition-all shadow-md shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-70 cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Placing Order...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 fill-white text-emerald-500" />
                      Place Order via WhatsApp
                    </span>
                  )}
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
            <span className="text-base font-extrabold text-slate-900">₹{total.toLocaleString('en-IN')}</span>
          </div>
          <button
            type="submit"
            form="checkout-form"
            disabled={loading}
            className="flex-1 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-70 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Placing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4.5 h-4.5 fill-white text-emerald-500" />
                Place Order via WhatsApp
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  const params = useParams()
  const shopSlug = params?.shopSlug as string
  const supabase = createClient()
  const [storeData, setStoreData] = useState<{
    id: string
    upi_id: string | null
    shop_name: string | null
    logo_url: string | null
    announcement: string | null
    theme: ShopTheme | null
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!shopSlug) {
      setError('Invalid store URL')
      setLoading(false)
      return
    }

    async function loadStore() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, upi_id, shop_name, business_name, shop_logo_url, avatar_url, shop_announcement, shop_theme')
          .eq('shop_slug', shopSlug)
          .single()

        if (error) {
          console.error('Checkout load error:', error)
          setError('We could not load this store checkout. It might not exist or may be configured incorrectly.')
        } else if (!data) {
          setError('Store checkout details not found.')
        } else {
          setStoreData({
            id: data.id,
            upi_id: data.upi_id,
            shop_name: data.business_name || data.shop_name,
            logo_url: data.shop_logo_url || data.avatar_url || null,
            announcement: data.shop_announcement || null,
            theme: (data.shop_theme as ShopTheme) || null,
          })
        }
      } catch (err: any) {
        console.error('Checkout load catch error:', err)
        setError('A network error occurred. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadStore()
  }, [shopSlug]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (error || !storeData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm max-w-md w-full space-y-4">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">Checkout Unavailable</h2>
          <p className="text-sm text-slate-500">{error || 'Store settings could not be retrieved.'}</p>
          <a
            href={`/store/${shopSlug}`}
            className="block w-full py-3 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-colors"
          >
            Return to Store
          </a>
        </div>
      </div>
    )
  }

  return (
    <CheckoutPageInner
      storeUserId={storeData.id}
      shopSlug={shopSlug}
      upiId={storeData.upi_id}
      shopName={storeData.shop_name}
      logoUrl={storeData.logo_url}
      announcement={storeData.announcement}
      theme={storeData.theme}
    />
  )
}
