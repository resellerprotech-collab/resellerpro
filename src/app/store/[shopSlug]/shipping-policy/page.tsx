import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import type { ShopTheme } from '@/types'
import { Truck, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react'

interface Props {
  params: { shopSlug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createAdminClient()
  const { data: profile } = await supabase.from('profiles').select('shop_name, business_name').eq('shop_slug', params.shopSlug).single()
  const storeName = profile?.shop_name || profile?.business_name || 'Store'
  return { title: `Shipping & Delivery Policy | ${storeName}` }
}

export default async function ShippingPolicyPage({ params }: Props) {
  const { shopSlug } = params
  const supabase = await createAdminClient()
  const { data: profile } = await supabase.from('profiles').select('*').eq('shop_slug', shopSlug).single()
  if (!profile) return notFound()

  const storeName = profile.shop_name || profile.business_name || 'Store'
  const theme = profile.shop_theme as ShopTheme | null

  return (
    <div className="min-h-screen bg-white pb-12">
      <StoreHeader shopSlug={shopSlug} shopName={storeName} logoUrl={profile.shop_logo_url || profile.avatar_url} theme={theme} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Customer Transparency</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shipping & Delivery Policy</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-6 bg-slate-50/70 p-6 sm:p-10 rounded-3xl border border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600" /> Dispatch & Shipping Timeline
            </h2>
            <p className="text-slate-600 mt-1">
              All confirmed orders are processed and dispatched within 24 to 48 business hours. Delivery typically takes 3 to 5 business days depending on your delivery pincode across India.
            </p>
          </div>

          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" /> Delivery Charges & Free Shipping
            </h2>
            <p className="text-slate-600 mt-1">
              We offer FREE Delivery on all orders above ₹999. For orders below ₹999, a nominal shipping charge of ₹49 applies at checkout.
            </p>
          </div>

          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" /> Cash on Delivery (COD) Guidelines
            </h2>
            <p className="text-slate-600 mt-1">
              COD is available on eligible pincodes. Please ensure your contact phone number and address are complete to prevent any delivery delay.
            </p>
          </div>

          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600" /> Tracking Your Shipment
            </h2>
            <p className="text-slate-600 mt-1">
              Once your package is handed over to our courier partner, you will receive an SMS and WhatsApp notification with your live tracking ID.
            </p>
          </div>
        </div>
      </main>

      <StoreFooter profile={profile} theme={theme} />
    </div>
  )
}
