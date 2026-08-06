import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import type { ShopTheme } from '@/types'
import { MessageCircle, Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react'

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

  const storeName = profile?.business_name || profile?.shop_name || 'Store'
  return {
    title: `Contact Us | ${storeName}`,
    description: `Get in touch with ${storeName}. WhatsApp support, email, business address, and business hours.`,
  }
}

export default async function ContactPage({ params }: Props) {
  const { shopSlug } = params
  const supabase = await createAdminClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('shop_slug', shopSlug)
    .single()

  if (!profile) return notFound()

  const storeName = profile.business_name || profile.shop_name || 'Store'
  const theme = profile.shop_theme as ShopTheme | null

  const waNum = theme?.socialWhatsApp || profile.whatsapp_number || profile.business_phone
  const waClean = waNum?.replace(/\D/g, '')
  const waLink = waClean ? `https://wa.me/91${waClean}?text=${encodeURIComponent('Hi! I wanted to inquire about a product on your store.')}` : null

  const address = theme?.footerAddress || profile.business_address
  const email = theme?.footerEmail || profile.business_email
  const phone = theme?.footerPhone || profile.business_phone || profile.whatsapp_number

  return (
    <div className="min-h-screen bg-white">
      <StoreHeader
        shopSlug={shopSlug}
        shopName={storeName}
        logoUrl={profile.shop_logo_url || profile.avatar_url}
        announcement={profile.shop_announcement}
        theme={theme}
        activePage="contact"
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-black tracking-widest uppercase text-slate-400 block mb-1">
            We Are Here To Help
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Contact {storeName}</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-2">
            Have questions about an order, shipping, or products? Reach out directly via WhatsApp or email.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Direct Support Card */}
          <div className="space-y-6">
            {/* WhatsApp Quick Box */}
            {waLink && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-emerald-950">Fastest Support on WhatsApp</h3>
                    <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                      Instant response for product inquiries, order updates, and custom requests.
                    </p>
                  </div>
                </div>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase rounded-xl transition-all shadow text-center flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat Directly on WhatsApp
                </a>
              </div>
            )}

            {/* Business Contact Cards */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100/80 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Business Details</h3>

              {address && (
                <div className="flex items-start gap-3 text-xs text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-900">Address</span>
                    <span>{address}</span>
                  </div>
                </div>
              )}

              {email && (
                <div className="flex items-start gap-3 text-xs text-slate-700">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-900">Email</span>
                    <a href={`mailto:${email}`} className="hover:underline">{email}</a>
                  </div>
                </div>
              )}

              {phone && (
                <div className="flex items-start gap-3 text-xs text-slate-700">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-900">Phone / Support</span>
                    <a href={`tel:${phone}`} className="hover:underline">{phone}</a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 text-xs text-slate-700 pt-2 border-t border-slate-200/60">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-slate-900">Working Hours</span>
                  <span>Monday – Saturday (9:00 AM – 8:00 PM IST)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Contact Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-md">
            <h3 className="font-extrabold text-lg text-slate-900 mb-1">Send a Message</h3>
            <p className="text-xs text-slate-500 mb-6">Fill out the form below and our customer service team will get back to you shortly.</p>

            <form action="#" method="POST" className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  required
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email or Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. rahul@example.com or 9876543210"
                  required
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Order ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. ORD-1092"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  placeholder="How can we help you today?"
                  required
                  className="w-full p-4 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-900 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase rounded-xl transition-all shadow flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Message
              </button>
            </form>
          </div>
        </div>
      </main>

      <StoreFooter profile={profile} theme={theme} />
    </div>
  )
}
