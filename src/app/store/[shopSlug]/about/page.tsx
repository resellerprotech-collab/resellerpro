import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import { WhyChooseUs } from '@/components/store/WhyChooseUs'
import { Testimonials } from '@/components/store/Testimonials'
import type { ShopTheme } from '@/types'
import { ShieldCheck, Award, Heart, Sparkles, MapPin, Mail, Phone } from 'lucide-react'

interface Props {
  params: { shopSlug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createAdminClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('shop_name, business_name')
    .eq('shop_slug', params.shopSlug)
    .single()

  const storeName = profile?.shop_name || profile?.business_name || 'Store'
  return {
    title: `About Us | ${storeName}`,
    description: `Learn more about ${storeName}, our mission, values, and quality promise.`,
  }
}

export default async function AboutPage({ params }: Props) {
  const { shopSlug } = params
  const supabase = await createAdminClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('shop_slug', shopSlug)
    .single()

  if (!profile) return notFound()

  const storeName = profile.shop_name || profile.business_name || 'Store'
  const theme = profile.shop_theme as ShopTheme | null
  const primaryColor = theme?.primaryColor || '#6366f1'

  return (
    <div className="min-h-screen bg-white pb-12">
      <StoreHeader
        shopSlug={shopSlug}
        shopName={storeName}
        logoUrl={profile.shop_logo_url || profile.avatar_url}
        announcement={profile.shop_announcement}
        theme={theme}
        activePage="about"
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Banner */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-slate-100 text-slate-700 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Our Story & Mission
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            About {storeName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-3 leading-relaxed">
            {theme?.footerAbout || profile.shop_description || `Welcome to ${storeName}. We are dedicated to providing high quality products, fast shipping, and exceptional customer service.`}
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100/80 text-center">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-900 shadow-sm">
              <Award className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mb-2">Quality Handpicked</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every item in our collection undergoes strict quality inspection to ensure premium craftsmanship before reaching your hands.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100/80 text-center">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-900 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mb-2">Trust & Security</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Shop with total confidence. We support Cash on Delivery, instant order tracking, and encrypted safe payment processing.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100/80 text-center">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-900 shadow-sm">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mb-2">Customer First</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our support team is available round-the-clock via WhatsApp and phone to guide your purchases and answer any queries.
            </p>
          </div>
        </div>

        {/* Why Choose Us Trust Section */}
        <WhyChooseUs primaryColor={primaryColor} />

        {/* Customer Reviews */}
        <Testimonials primaryColor={primaryColor} />
      </main>

      <StoreFooter profile={profile} theme={theme} />
    </div>
  )
}
