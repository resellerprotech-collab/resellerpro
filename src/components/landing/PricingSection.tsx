'use client'

import { Check, Send, TrendingUp, Sparkles, Star, RotateCcw, ShieldCheck, Headphones, Layers, BotIcon } from 'lucide-react'
import Link from 'next/link'

interface PricingCardProps {
  name: string
  badge?: string
  launchingSoon?: boolean
  price: string
  period?: string
  subtitle: string
  description?: string
  features: string[]
  popular?: boolean
  note?: string
  icon: React.ReactNode
  buttonText?: string
}

function PricingCard({
  name,
  launchingSoon,
  price,
  period = '/mo',
  subtitle,
  description,
  features,
  popular,
  note,
  icon,
  buttonText = 'Get Started',
}: PricingCardProps) {
  return (
    <div
      className={`relative p-6 rounded-2xl transition-all duration-300 flex flex-col h-full bg-card ${
        popular
          ? 'border-2 border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/10 lg:scale-[1.02] z-10'
          : 'border border-border/80 hover:border-border hover:shadow-md'
      }`}
    >
      {/* Top Badge for Popular */}
      {popular && (
        <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-blue-600 text-white px-3.5 py-1 rounded-full text-[11px] font-bold shadow-md tracking-wide uppercase flex items-center gap-1.5">
           
            <span>MOST POPULAR</span>
          </div>
        </div>
      )}

      {/* Top Badge for Launching Soon */}
      {launchingSoon && (
        <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3.5 py-1 rounded-full text-[11px] font-bold shadow-md tracking-wide uppercase flex items-center gap-1.5">
           
            <span>LAUNCHING SOON</span>
          </div>
        </div>
      )}

      {/* Card Header */}
      <div className="mb-4">
        {/* Icon & Title on the same line */}
        <div className="flex items-center gap-3 mb-2">
          <div className="inline-flex flex-shrink-0">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-foreground">{name}</h3>
        </div>

        {/* Subtitle & Description */}
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-foreground/90">{subtitle}</p>
          {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
        </div>
      </div>

      {/* Price */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl md:text-4xl font-bold  tracking-tight text-foreground" style={{fontFamily:'sans-serif'}}>
            {price}
          </span>
          <span className="text-muted-foreground font-medium text-xs ml-1">
            {period}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="mb-5">
        <Link href={launchingSoon ? '#notify' : `/signup?plan=${name.toLowerCase()}`} className="w-full">
          <button
            className={`w-full py-2.5 px-4 rounded-full font-bold text-xs transition-all duration-300 ${
              popular
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/25 hover:shadow-md'
                : launchingSoon
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-sm'
                : 'border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40'
            }`}
          >
            {launchingSoon ? 'Join Waitlist' : buttonText}
          </button>
        </Link>
      </div>

      {/* Features Divider */}
      <div className="border-t border-border/60 mb-4" />

      {/* Features List */}
      <div className="space-y-2.5 flex-grow">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2.5 group">
            <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
              launchingSoon 
                ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400' 
                : 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400'
            }`}>
              <Check className="w-2.5 h-2.5" strokeWidth={3} />
            </div>
            <span className="text-xs text-foreground/80 group-hover:text-foreground transition-colors font-medium">
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      {note && (
        <div className="mt-4 pt-3 border-t border-border/40 text-center">
          <small className="text-[11px] text-muted-foreground font-medium">
            {note}
          </small>
        </div>
      )}
    </div>
  )
}

export default function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      price: '₹0',
      subtitle: 'Perfect for new resellers',
      description: 'Launch your business online for free.',
      note: 'Includes 25 completed orders/month',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <Send className="w-5 h-5" />
        </div>
      ),
      features: [
        'Your Own Online Store',
        'Orders, Products & Customers',
        'WhatsApp Smart Paste',
        'Invoice Generator',
        'Basic Analytics',
        'Email Support',
      ],
    },
    {
      name: 'Pro',
      price: '₹999',
      subtitle: 'For growing businesses',
      description: 'Build a professional brand and sell without limits.',
      popular: true,
      icon: (
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/30">
          <TrendingUp className="w-5 h-5" />
        </div>
      ),
      features: [
        'Everything in Starter',
        'Unlimited Orders',
        'Premium Store Setup',
        'Custom Domain',
        'Profit & Expense Tracking',
        'Advanced Analytics',
        'Priority Support',
      ],
    },
    {
      name: 'AI Commerce',
      price: '₹1,999',
      subtitle: 'Your AI sales team, available 24×7.',
      description: 'Automate customer support & sales.',
      launchingSoon: true,
      icon: (
        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
          <BotIcon className="w-5 h-5" />
        </div>
      ),
      features: [
        'AI Sales Agent',
        'WhatsApp Automation',
        'Human-Like Replies',
        'Smart Product Suggestions',
        'Instant Customer Support',
        'Automated Order Handling',
        'Custom AI Training',
        'Team Workspace',
        'Business Insights',
        'Premium Support',
      ],
    },
  ]

  return (
    <section id="pricing" className="py-16 md:py-20 bg-background relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Pill & Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-[11px] font-bold tracking-wide uppercase mb-4">
            <div className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px]">
              <Layers className="w-2 h-2" />
            </div>
            <span>PRICING PLANS</span>
          </div> */}

          <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-3">
            Simple & <span className="text-blue-600 dark:text-blue-400">Transparent Pricing</span>
          </h2>
          <p className="text-sm text-black dark:text-white">
            Choose a plan that fits your business needs. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch mb-12">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              {...plan}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
