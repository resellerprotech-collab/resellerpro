import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import type { ShopTheme } from '@/types'
import { RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react'

interface Props {
  params: { shopSlug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createAdminClient()
  const { data: profile } = await supabase.from('profiles').select('shop_name, business_name').eq('shop_slug', params.shopSlug).single()
  const storeName = profile?.shop_name || profile?.business_name || 'Store'
  return { title: `Return & Refund Policy | ${storeName}` }
}

export default async function ReturnPolicyPage({ params }: Props) {
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
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Hassle-Free Returns</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Return & Refund Policy</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-6 bg-slate-50/70 p-6 sm:p-10 rounded-3xl border border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-600" /> 7-Day Replacement Guarantee
            </h2>
            <p className="text-slate-600 mt-1">
              We want you to love your purchase! If you receive a damaged, defective, or incorrect product, you can request a replacement or return within 7 days of delivery.
            </p>
          </div>

          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Return Eligibility Criteria
            </h2>
            <ul className="list-disc pl-5 text-slate-600 mt-1 space-y-1">
              <li>Item must be unused, unwashed, and in original brand packaging.</li>
              <li>All tags, labels, and warranty cards must remain intact.</li>
              <li>Unboxing video proof is recommended for transit damage claims.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600" /> Refund Processing
            </h2>
            <p className="text-slate-600 mt-1">
              Once the returned item is inspected at our warehouse, refunds are initiated within 3-5 business days directly to your original payment method or UPI ID.
            </p>
          </div>
        </div>
      </main>

      <StoreFooter profile={profile} theme={theme} />
    </div>
  )
}
