'use client'

import { MessageCircle } from 'lucide-react'
import type { ShopTheme, Profile } from '@/types'

import { useCartStore } from '@/store/useCartStore'
import { useWishlistStore } from '@/store/useWishlistStore'

interface WhatsAppWidgetProps {
  profile: Profile
  theme?: ShopTheme | null
}

export function WhatsAppWidget({ profile, theme }: WhatsAppWidgetProps) {
  const isCartOpen = useCartStore((s) => s.isOpen)
  const isWishlistOpen = useWishlistStore((s) => s.isOpen)

  // If cart drawer or wishlist drawer is open, or explicitly disabled in settings, do not render
  if (isCartOpen || isWishlistOpen || theme?.chatWidgetEnabled === false) {
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
    <a
      href={waUrl}
      target={formattedNum ? '_blank' : '_self'}
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 group cursor-pointer"
    >
      <div className="relative flex items-center justify-center">
        {/* Hover Tooltip Message */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white px-4 py-2.5 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
          <p className="text-xs font-bold text-slate-700 tracking-wide">
            Hi! Need help? Chat on WhatsApp
          </p>
        </div>

        {/* Floating Icon Button */}
        <div className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/40 group-hover:scale-110 active:scale-95 transition-all duration-300 text-white relative shrink-0">
          <MessageCircle className="w-7 h-7 fill-white/20 text-white" />
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-25 group-hover:opacity-0" />
        </div>
      </div>
    </a>
  )
}
