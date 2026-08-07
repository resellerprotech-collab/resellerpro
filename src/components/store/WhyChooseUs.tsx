'use client'

import type { ShopTheme } from '@/types'
import { Truck, ShieldCheck, RotateCcw, Award, Headphones, Check } from 'lucide-react'

interface Feature {
  id: string
  icon: any
  title: string
  description: string
}

interface WhyChooseUsProps {
  primaryColor?: string
  customTitle?: string
  customSubtitle?: string
  theme?: ShopTheme | null
}

export function WhyChooseUs({ primaryColor = '#6366f1', theme }: WhyChooseUsProps) {
  // If trust badges section is explicitly disabled in settings, hide it
  if (theme?.trustBadgesEnabled === false) {
    return null
  }

  const defaultBadges: Record<string, { id: string; icon: any; defaultTitle: string; defaultDesc: string }> = {
    secure_payment: {
      id: 'secure_payment',
      icon: ShieldCheck,
      defaultTitle: 'Secure Payments',
      defaultDesc: '',
    },
    fast_delivery: {
      id: 'fast_delivery',
      icon: Truck,
      defaultTitle: 'Fast Shipping',
      defaultDesc: theme?.shippingInfo || '',
    },
    easy_returns: {
      id: 'easy_returns',
      icon: RotateCcw,
      defaultTitle: 'Easy Returns',
      defaultDesc: theme?.returnPolicy || '',
    },
    quality: {
      id: 'quality',
      icon: Award,
      defaultTitle: 'Premium Quality',
      defaultDesc: '',
    },
    support: {
      id: 'support',
      icon: Headphones,
      defaultTitle: '24/7 Support',
      defaultDesc: '',
    },
    authentic: {
      id: 'authentic',
      icon: Check,
      defaultTitle: '100% Authentic',
      defaultDesc: '',
    },
  }

  // Selected badge IDs from theme settings, or default list
  const selectedBadgeIds = (theme?.trustBadges && theme.trustBadges.length > 0)
    ? theme.trustBadges
    : ['fast_delivery', 'secure_payment', 'easy_returns', 'quality', 'support']

  const features = selectedBadgeIds
    .map((id) => {
      const base = defaultBadges[id]
      const custom = theme?.trustBadgeItems?.[id]
      if (!base && !custom) return null

      return {
        id,
        icon: base?.icon || ShieldCheck,
        iconUrl: custom?.iconUrl || '',
        title: custom?.title || base?.defaultTitle || id,
        description: custom?.description !== undefined ? custom.description : (base?.defaultDesc || ''),
      }
    })
    .filter(Boolean) as Array<{ id: string; icon: any; iconUrl: string; title: string; description: string }>

  if (features.length === 0) return null

  return (
    <section className="py-12 bg-slate-50/70 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
       
          <h2 className="text-xl md:text-3xl lg:text-4xl  text-black font-medium">
            Built for Your Peace of Mind
          </h2>
           <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 max-w-xl mx-auto">
          Trusted by 5,000+ businesses and individuals worldwide
        </p>
        </div>

        <div className="flex flex-wrap items-stretch justify-center gap-4 sm:gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.id || i}
                className="bg-white rounded-2xl p-5 border border-slate-100/80 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 flex flex-col items-center text-center group min-w-[150px] sm:min-w-[180px] max-w-[240px] flex-1"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 shrink-0 overflow-hidden"
                  style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                >
                  {feature.iconUrl ? (
                    <img src={feature.iconUrl} alt={feature.title} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">{feature.title}</h3>
                {feature.description && (
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{feature.description}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
