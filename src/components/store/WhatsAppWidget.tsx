'use client'

import { MessageCircle } from 'lucide-react'
import type { ShopTheme, Profile } from '@/types'

interface WhatsAppWidgetProps {
  profile: Profile
  theme?: ShopTheme | null
}

export function WhatsAppWidget({ profile, theme }: WhatsAppWidgetProps) {
  // If explicitly disabled in settings, do not render
  if (theme?.chatWidgetEnabled === false) {
    return null
  }

  const rawPhone =
    theme?.socialWhatsApp ||
    profile?.whatsapp_number ||
    profile?.business_phone ||
    profile?.phone ||
    ''

  const cleanNum = rawPhone.replace(/\D/g, '')
  const formattedNum = cleanNum ? (cleanNum.length === 10 ? `91${cleanNum}` : cleanNum) : ''
  const message = theme?.chatWidgetMessage || 'Hi! I found your store online. I have a question.'
  const waUrl = formattedNum ? `https://wa.me/${formattedNum}?text=${encodeURIComponent(message)}` : '#'

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <div className="bg-white px-4 py-2.5 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 hidden sm:block animate-fade-in-up">
        <p className="text-xs font-bold text-slate-700 tracking-wide">
          Hi! Need help? Chat on WhatsApp
        </p>
      </div>
      <a
        href={waUrl}
        target={formattedNum ? "_blank" : "_self"}
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-300 text-white relative group"
      >
        <MessageCircle className="w-7 h-7 fill-white/20 text-white" />
        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-25 group-hover:opacity-0" />
      </a>
    </div>
  )
}
