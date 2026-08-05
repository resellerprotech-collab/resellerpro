'use client'

import { useState } from 'react'
import {
  MessageSquare,
  CheckCircle2,
  Copy,
  Package,
  BarChart3,
  ArrowRight,
  PlayCircle,
  Sparkles,
  Rocket,
  Check,
  UserPlus,
  Clock,
  Send,
  TrendingUp,
  Truck,
  DollarSign
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import Link from 'next/link'
import type { ComponentType } from 'react'
import { AnimatedDemoModal } from '@/components/demo/AnimatedDemoModal'
import { motion } from 'framer-motion'

interface StepCardProps {
  number: number
  icon: ComponentType<LucideProps>
  title: string
  description: string
  details: string[]
  theme: {
    bg: string
    text: string
    badgeBg: string
    badgeText: string
    badgeBorder: string
    checkBg: string
    checkBorder: string
    borderAccent: string
    cardBg: string
    cardBorder: string
  }
  index: number
}

function StepPreview({ number }: { number: number }) {
  if (number === 1) {
    return (
      <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-3.5 sm:p-4 text-white shadow-inner space-y-3 font-sans">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">WhatsApp Live Chat</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium border border-emerald-500/30">New Lead</span>
        </div>
        
        <div className="bg-slate-800/80 rounded-lg p-2.5 text-xs text-slate-200 space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span className="font-semibold text-emerald-400">Rohan Verma</span>
            <span>10:42 AM</span>
          </div>
          <p className="text-[11px] leading-relaxed">"Hi, is the Handloom Silk Saree set available in M size? Need delivery by Friday."</p>
        </div>

        <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 text-xs">
          <div className="flex items-center gap-2">
            <UserPlus className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] font-medium text-blue-300">Auto-saved to Lead Pipeline</span>
          </div>
          <span className="text-[10px] font-bold text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded">#1042</span>
        </div>
      </div>
    )
  }

  if (number === 2) {
    return (
      <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-3.5 sm:p-4 text-white shadow-inner space-y-3 font-sans">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-semibold text-slate-300">Pipeline Stage Tracker</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium">3 Active Stages</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-center">
          <div className="bg-blue-500/15 border border-blue-500/30 rounded-lg p-2">
            <div className="text-[10px] text-blue-400 font-bold uppercase">Enquiry</div>
            <div className="text-sm font-extrabold text-white">12</div>
          </div>
          <div className="bg-amber-500/15 border border-amber-500/30 rounded-lg p-2">
            <div className="text-[10px] text-amber-400 font-bold uppercase">Negotiating</div>
            <div className="text-sm font-extrabold text-white">5</div>
          </div>
          <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-lg p-2">
            <div className="text-[10px] text-emerald-400 font-bold uppercase">Converted</div>
            <div className="text-sm font-extrabold text-white">28</div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-slate-800/80 rounded-lg p-2 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-slate-300">Follow-up alert sent for 2 leads</span>
          </div>
          <span className="text-[10px] font-semibold text-amber-400">Just now</span>
        </div>
      </div>
    )
  }

  if (number === 3) {
    return (
      <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-3.5 sm:p-4 text-white shadow-inner space-y-2.5 font-sans">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-semibold text-slate-300 font-sans">1-Click Order Generation</span>
          <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-medium">Smart Paste</span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between bg-slate-800/80 p-2 rounded-md">
            <span className="text-slate-400 text-[11px]">Customer:</span>
            <span className="text-slate-100 font-semibold text-[11px]">Priya Sharma (Mumbai)</span>
          </div>
          <div className="flex justify-between bg-slate-800/80 p-2 rounded-md">
            <span className="text-slate-400 text-[11px]">Product:</span>
            <span className="text-purple-300 font-semibold text-[11px]">Designer Silk Saree (M)</span>
          </div>
          <div className="flex justify-between bg-purple-500/20 border border-purple-500/40 p-2 rounded-md items-center">
            <span className="text-purple-200 font-bold text-xs">Total Amount:</span>
            <span className="text-white font-extrabold text-sm">₹1,499</span>
          </div>
        </div>
      </div>
    )
  }

  if (number === 4) {
    return (
      <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-3.5 sm:p-4 text-white shadow-inner space-y-3 font-sans">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-slate-300">Shipment Dispatch</span>
          </div>
          <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">In Transit</span>
        </div>

        <div className="bg-slate-800/80 rounded-lg p-2.5 text-xs space-y-2">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">AWB: <strong className="text-slate-200">BLUEDART-9042</strong></span>
            <span className="text-emerald-400 font-semibold">Out for Delivery</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full w-4/5 rounded-full" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2 text-emerald-400 text-xs font-semibold">
          <Send className="w-3.5 h-3.5" />
          <span>Auto WhatsApp Tracking Link Sent</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-3.5 sm:p-4 text-white shadow-inner space-y-3 font-sans">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs font-semibold text-slate-300">Profit Analytics</span>
        </div>
        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">+24% This Month</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-800/80 p-2.5 rounded-lg">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-emerald-400" /> Net Profit
          </div>
          <div className="text-base font-extrabold text-emerald-400">₹42,850</div>
        </div>
        <div className="bg-slate-800/80 p-2.5 rounded-lg">
          <div className="text-[10px] text-slate-400">Total Orders</div>
          <div className="text-base font-extrabold text-blue-400">142</div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 text-[11px] text-blue-300 flex justify-between items-center">
        <span>Top Selling Product:</span>
        <strong className="text-white">Anarkali Suits (42 sold)</strong>
      </div>
    </div>
  )
}

function StepCard({
  number,
  icon: Icon,
  title,
  description,
  details,
  theme,
  index
}: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky rounded-[24px] border ${theme.cardBorder} ${theme.borderAccent} ${theme.cardBg} backdrop-blur-xl p-3.5 sm:p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] hover:shadow-xl transition-shadow duration-300 mb-8 sm:mb-14 group min-h-[340px] flex flex-col justify-center`}
      style={{
        top: `calc(90px + ${index * 28}px)`,
        zIndex: index + 1
      }}
    >
      {/* Outer Box containing 2 Inner Boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
        
        {/* Left Inner Box (Content Container) */}
        <div className="lg:col-span-7 bg-white/95 rounded-[10px]  p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
          {/* Header & Step Badge */}
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${theme.bg} ${theme.text} flex items-center justify-center p-2.5 transition-transform duration-300 group-hover:scale-105 shadow-xs`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className={`inline-flex items-center justify-center text-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-extrabold tracking-wider leading-none ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}>
              STEP 0{number}
            </span>
          </div>

          {/* Title & Description */}
          <div className="space-y-1.5">
            <h3 className="text-base sm:text-xl font-extrabold text-slate-900 leading-snug">
              {title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {description}
            </p>
          </div>

          {/* Key Details Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
            {details.map((detail, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-800 font-medium">
                <div className={`w-4 h-4 rounded-full border ${theme.checkBorder} ${theme.checkBg} ${theme.text} flex items-center justify-center flex-shrink-0`}>
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className="text-xs truncate">{detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Inner Box (Visual Preview Graphic Container) */}
        <div className="lg:col-span-5 bg-slate-950/90 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-center shadow-inner overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)] pointer-events-none" />
          <StepPreview number={number} />
        </div>

      </div>
    </motion.div>
  )
}

export default function HowItWorksSection() {
  const [showDemo, setShowDemo] = useState(false)

  const steps = [
    {
      number: 1,
      icon: MessageSquare,
      title: 'Capture & Organize WhatsApp Enquiries',
      description: 'When customer leads message you on WhatsApp or Instagram, capture their details instantly into your central sales pipeline. Stop letting inquiries get lost in endless chat histories or forgotten in daily message chaos.',
      details: [
        'Auto-Save Name & Phone',
        'Organized Lead Pipeline',
        'Follow-up Notifications',
        'Categorize Lead Urgency'
      ],
      theme: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-600',
        badgeBg: 'bg-blue-500/10',
        badgeText: 'text-blue-600',
        badgeBorder: 'border-blue-500/20',
        checkBg: 'bg-blue-500/10',
        checkBorder: 'border-blue-500/30',
        borderAccent: 'hover:border-blue-500/40',
        cardBg: 'bg-white',
        cardBorder: 'border-slate-200/80'
      }
    },
    {
      number: 2,
      icon: CheckCircle2,
      title: 'Track & Manage Pipeline Status',
      description: 'Effortlessly track every customer through your sales funnel. Move leads seamlessly from "New Enquiry" to "Negotiating" to "Converted" with a single tap, ensuring clear visibility over all pending sales opportunities.',
      details: [
        'Visual Kanban Pipeline',
        'Filter Leads by Stage',
        'Automated Activity Logs',
        'Smart Follow-up Reminders'
      ],
      theme: {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-600',
        badgeBg: 'bg-emerald-500/10',
        badgeText: 'text-emerald-600',
        badgeBorder: 'border-emerald-500/20',
        checkBg: 'bg-emerald-500/10',
        checkBorder: 'border-emerald-500/30',
        borderAccent: 'hover:border-emerald-500/40',
        cardBg: 'bg-white',
        cardBorder: 'border-slate-200/80'
      }
    },
    {
      number: 3,
      icon: Copy,
      title: '1-Click Order Conversion via AI Smart Paste',
      description: 'When a customer confirms their purchase, copy-paste their raw WhatsApp address directly into ResellerPro. Our AI Smart Paste extracts Name, Phone, Delivery Address, PIN Code, and Items in seconds with zero manual typing.',
      details: [
        'AI Address & PIN Extraction',
        'Zero Typing Error Rate',
        'Auto Product & Cost Sync',
        'Instant Invoice & GST Billing'
      ],
      theme: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-600',
        badgeBg: 'bg-purple-500/10',
        badgeText: 'text-purple-600',
        badgeBorder: 'border-purple-500/20',
        checkBg: 'bg-purple-500/10',
        checkBorder: 'border-purple-500/30',
        borderAccent: 'hover:border-purple-500/40',
        cardBg: 'bg-white',
        cardBorder: 'border-slate-200/80'
      }
    },
    {
      number: 4,
      icon: Package,
      title: 'Streamline Packaging, Shipping & Delivery',
      description: 'Keep full control over every order from packaging to final courier dispatch. Send automated WhatsApp dispatch updates and real-time tracking links directly to your buyers so they stay informed at every step.',
      details: [
        'Courier & AWB Tracking',
        'Auto WhatsApp Updates',
        'One-Click Status Change',
        'Prepaid & COD Verification'
      ],
      theme: {
        bg: 'bg-amber-500/10',
        text: 'text-amber-600',
        badgeBg: 'bg-amber-500/10',
        badgeText: 'text-amber-600',
        badgeBorder: 'border-amber-500/20',
        checkBg: 'bg-amber-500/10',
        checkBorder: 'border-amber-500/30',
        borderAccent: 'hover:border-amber-500/40',
        cardBg: 'bg-white',
        cardBorder: 'border-slate-200/80'
      }
    },
    {
      number: 5,
      icon: BarChart3,
      title: 'Monitor Real-Time Net Profit & Business Analytics',
      description: 'Gain complete clarity on your financial growth with real-time profit analytics dashboards. Track your exact net profit after product supplier costs, shipping fees, top-selling items, and repeat customer rates.',
      details: [
        'Live Net Profit Tracking',
        'Top Selling Product Stats',
        'Margin & Cost Breakdowns',
        'One-Click Data Exports'
      ],
      theme: {
        bg: 'bg-rose-500/10',
        text: 'text-rose-600',
        badgeBg: 'bg-rose-500/10',
        badgeText: 'text-rose-600',
        badgeBorder: 'border-rose-500/20',
        checkBg: 'bg-rose-500/10',
        checkBorder: 'border-rose-500/30',
        borderAccent: 'hover:border-rose-500/40',
        cardBg: 'bg-white',
        cardBorder: 'border-slate-200/80'
      }
    },
  ]

  return (
    <>
      <section id="workflow" className="relative md:py-2 [overflow-x:clip] bg-white text-slate-900">
        
        {/* Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <motion.div 
            className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[120px]"
            animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-[-10%] w-[500px] h-[500px] bg-slate-100 rounded-full blur-[100px]"
            animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.2]">
              From Chaos to{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent inline-block pb-[0.15em]">
                Clarity
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
              A simple 5-step workflow designed specifically for WhatsApp resellers.<br className="hidden sm:inline" />
              No learning curve required.
            </p>
          </div>

          {/* Sticky Stacked Cards Container (5 Boxes coming bottom to top over each other) */}
          <div className="max-w-5xl mx-auto relative mb-16 sm:mb-24">
            {steps.map((step, idx) => (
              <StepCard
                key={step.number}
                {...step}
                index={idx}
              />
            ))}
          </div>

          {/* Bottom Wide CTA Banner */}
          <div className="relative rounded-[10px] overflow-hidden border border-blue-200/60 p-8 sm:p-14 text-center shadow-xl shadow-blue-500/5 bg-gradient-to-r from-blue-100/70 via-white to-blue-100/70">
            {/* Center X-Axis White Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,1)_0%,rgba(239,246,255,0.75)_50%,rgba(219,234,254,0.85)_100%)] pointer-events-none -z-10" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                Stop Managing Your Business on a Notepad
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                Experience the power of a dedicated CRM built for your reselling business. Setup takes less than 2 minutes.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href="/signup" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 group/btn">
                    <span>Start Free Trial</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </Link>

                <button 
                  onClick={() => setShowDemo(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-full font-bold text-xs sm:text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <PlayCircle className="w-4 h-4 text-blue-600" />
                  <span>Watch Demo</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 sm:gap-6 pt-3 text-[11px] font-medium text-slate-600">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Free Forever Plan</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> No Credit Card Required</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <AnimatedDemoModal open={showDemo} onClose={() => setShowDemo(false)} />
    </>
  )
}

