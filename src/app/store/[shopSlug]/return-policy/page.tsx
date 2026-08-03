import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import type { ShopTheme } from '@/types'
import { RotateCcw, ShieldCheck, CheckCircle2, Truck, Clock, Lock, FileText } from 'lucide-react'

interface Props {
  params: { shopSlug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createAdminClient()
  const { data: profile } = await supabase.from('profiles').select('shop_name, business_name').eq('shop_slug', params.shopSlug).single()
  const storeName = profile?.shop_name || profile?.business_name || 'Store'
  return { title: `Return & Refund Policy | ${storeName}` }
}

function getPolicyIcon(iconName?: string) {
  switch (iconName) {
    case 'truck': return <Truck className="w-5 h-5 text-indigo-600 flex-shrink-0" />
    case 'rotate': return <RotateCcw className="w-5 h-5 text-emerald-600 flex-shrink-0" />
    case 'shield': return <ShieldCheck className="w-5 h-5 text-indigo-600 flex-shrink-0" />
    case 'clock': return <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0" />
    case 'check': return <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
    case 'lock': return <Lock className="w-5 h-5 text-indigo-600 flex-shrink-0" />
    case 'file': return <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0" />
    default: return <RotateCcw className="w-5 h-5 text-emerald-600 flex-shrink-0" />
  }
}

export default async function ReturnPolicyPage({ params }: Props) {
  const { shopSlug } = params
  const supabase = await createAdminClient()
  const { data: profile } = await supabase.from('profiles').select('*').eq('shop_slug', shopSlug).single()
  if (!profile) return notFound()

  const storeName = profile.shop_name || profile.business_name || 'Store'
  const theme = profile.shop_theme as ShopTheme | null
  const returnBlocks = theme?.policyBlocks?.returns

  return (
    <div className="min-h-screen bg-white pb-12">
      <StoreHeader shopSlug={shopSlug} shopName={storeName} logoUrl={profile.shop_logo_url || profile.avatar_url} theme={theme} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Hassle-Free Returns</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Return & Refund Policy</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-8 bg-slate-50/70 p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
          {returnBlocks && returnBlocks.length > 0 ? (
            returnBlocks.map((block) => (
              <div key={block.id} className="space-y-2">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2.5">
                  {getPolicyIcon(block.icon)}
                  <span>{block.heading}</span>
                </h2>
                {block.subheading && (
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    {block.subheading}
                  </p>
                )}
                {block.description && (
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap mt-1">
                    {block.description}
                  </p>
                )}
                {block.points && block.points.length > 0 && (
                  <ul className="list-disc pl-5 text-slate-600 space-y-1.5 pt-1">
                    {block.points.map((pt, idx) => (
                      <li key={idx} className="font-medium">{pt}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          ) : theme?.returnPolicyText ? (
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 mb-3">
                <RotateCcw className="w-5 h-5 text-emerald-600" /> Merchant Return & Refund Guidelines
              </h2>
              <div className="text-slate-700 font-medium whitespace-pre-wrap leading-relaxed">
                {theme.returnPolicyText}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 font-medium">
              No return policy information provided yet.
            </div>
          )}
        </div>
      </main>

      <StoreFooter profile={profile} theme={theme} />
    </div>
  )
}
