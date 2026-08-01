'use client'

import { Truck, ShieldCheck, RotateCcw, Award, Headphones } from 'lucide-react'

interface Feature {
  icon: any
  title: string
  description: string
}

interface WhyChooseUsProps {
  primaryColor?: string
  customTitle?: string
  customSubtitle?: string
}

export function WhyChooseUs({ primaryColor = '#6366f1' }: WhyChooseUsProps) {
  const features: Feature[] = [
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Reliable doorstep delivery across India with real-time tracking.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payments',
      description: '100% safe transaction guarantee via UPI, Cards, and Cash on Delivery.',
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: 'Hassle-free 7-day replacement and return policy for peace of mind.',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Handpicked products rigorously quality-checked before dispatch.',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Dedicated WhatsApp and phone support for instant assistance.',
    },
  ]

  return (
    <section className="py-12 bg-slate-50/70 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black tracking-widest uppercase text-slate-500 mb-1 block">
            Why Shop With Us
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Built for Your Peace of Mind
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Every order is backed by our commitment to quality, security, and exceptional service.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-slate-100/80 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 flex flex-col items-center text-center group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">{feature.title}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
