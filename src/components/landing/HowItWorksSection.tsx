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
  Check
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
  }
}

function StepCard({
  number,
  icon: Icon,
  title,
  description,
  details,
  theme,
}: StepCardProps) {
  return (
    <div className="bg-card/90 dark:bg-card/80 backdrop-blur-xl border border-border hover:border-primary/40 rounded-2xl p-3.5 sm:p-5 lg:p-6 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between group">
      <div>
        {/* Step Badge & Icon Header */}
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${theme.bg} ${theme.text} flex items-center justify-center p-2 sm:p-3 transition-transform duration-300 group-hover:scale-105`}>
            <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <span className={`inline-flex items-center justify-center text-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold tracking-wider leading-none ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}>
            STEP 0{number}
          </span>
        </div>

        {/* Content */}
        <div className="mb-3 sm:mb-5">
          <h3 className="text-xs sm:text-lg font-bold text-foreground mb-1 sm:mb-2">
            {title}
          </h3>
          <p className="text-[8px] sm:text-xs text-muted-foreground leading-tight sm:leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Details List */}
      <div className="space-y-1.5 sm:space-y-2 pt-3 sm:pt-4 border-t border-border/50 mt-auto">
        {details.map((detail, idx) => (
          <div key={idx} className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-foreground/80 font-medium">
            <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border ${theme.checkBorder} ${theme.checkBg} ${theme.text} flex items-center justify-center flex-shrink-0`}>
              <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 stroke-[3]" />
            </div>
            <span className="text-[10px] sm:text-xs truncate">{detail}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HowItWorksSection() {
  const [showDemo, setShowDemo] = useState(false)

  const steps = [
    {
      number: 1,
      icon: MessageSquare,
      title: 'Add WhatsApp Enquiries',
      description: 'When you receive a customer message, quickly add it as an enquiry. Never lose a lead again.',
      details: [
        'Save Name & Phone',
        'Track pending leads',
        'Set reminders'
      ],
      theme: {
        bg: 'bg-blue-500/10 dark:bg-blue-500/20',
        text: 'text-blue-600 dark:text-blue-400',
        badgeBg: 'bg-blue-500/10',
        badgeText: 'text-blue-600 dark:text-blue-400',
        badgeBorder: 'border-blue-500/20',
        checkBg: 'bg-blue-500/10',
        checkBorder: 'border-blue-500/30'
      }
    },
    {
      number: 2,
      icon: CheckCircle2,
      title: 'Track Enquiry Status',
      description: 'Visualize your sales pipeline. Move customers from "Enquiry" to "Converted" with a click.',
      details: [
        'Status labels',
        'Filter by progress',
        'Follow-up alerts'
      ],
      theme: {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        badgeBg: 'bg-emerald-500/10',
        badgeText: 'text-emerald-600 dark:text-emerald-400',
        badgeBorder: 'border-emerald-500/20',
        checkBg: 'bg-emerald-500/10',
        checkBorder: 'border-emerald-500/30'
      }
    },
    {
      number: 3,
      icon: Copy,
      title: 'Convert to Order',
      description: 'Customer said yes? Instantly convert the chat into a formal order without re-typing details.',
      details: [
        'Smart Paste details',
        'Select products',
        'Auto-calculate total'
      ],
      theme: {
        bg: 'bg-purple-500/10 dark:bg-purple-500/20',
        text: 'text-purple-600 dark:text-purple-400',
        badgeBg: 'bg-purple-500/10',
        badgeText: 'text-purple-600 dark:text-purple-400',
        badgeBorder: 'border-purple-500/20',
        checkBg: 'bg-purple-500/10',
        checkBorder: 'border-purple-500/30'
      }
    },
    {
      number: 4,
      icon: Package,
      title: 'Manage & Ship',
      description: 'Keep track of what needs to be packed, shipped, or delivered. Update customers in real-time.',
      details: [
        'Shipment tracking',
        'WhatsApp templates',
        'One-click updates'
      ],
      theme: {
        bg: 'bg-amber-500/10 dark:bg-amber-500/20',
        text: 'text-amber-600 dark:text-amber-400',
        badgeBg: 'bg-amber-500/10',
        badgeText: 'text-amber-600 dark:text-amber-400',
        badgeBorder: 'border-amber-500/20',
        checkBg: 'bg-amber-500/10',
        checkBorder: 'border-amber-500/30'
      }
    },
    {
      number: 5,
      icon: BarChart3,
      title: 'View Analytics',
      description: 'Understand your profit margins. See which products are selling and who your best customers are.',
      details: [
        'Daily profit reports',
        'Order trends',
        'Export data'
      ],
      theme: {
        bg: 'bg-blue-500/10 dark:bg-blue-500/20',
        text: 'text-blue-600 dark:text-blue-400',
        badgeBg: 'bg-blue-500/10',
        badgeText: 'text-blue-600 dark:text-blue-400',
        badgeBorder: 'border-blue-500/20',
        checkBg: 'bg-blue-500/10',
        checkBorder: 'border-blue-500/30'
      }
    },
  ]

  return (
    <>
      <section id="workflow" className="relative py-14 lg:py-20 overflow-hidden bg-gradient-to-b from-background via-secondary/20 to-background">
        
        {/* Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <motion.div 
            className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px]"
            animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-[-10%] w-[500px] h-[500px] bg-secondary/40 rounded-full blur-[100px]"
            animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            {/* Top Pill Badge */}
            {/* <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold shadow-2xs">
             
              <span>5-Step Simple Workflow</span>
            </div> */}

            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.2]">
              From Chaos to{' '}
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent inline-block pb-[0.15em]">
                Clarity
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-black dark:text-white max-w-2xl mx-auto leading-relaxed">
              A simple 5-step workflow designed specifically for WhatsApp resellers.<br className="hidden sm:inline" />
              No learning curve required.
            </p>
          </div>

          {/* 6 Steps Grid (2 Columns on Mobile, 3 Columns on Desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 mb-14">
            {steps.map((step) => (
              <StepCard
                key={step.number}
                {...step}
              />
            ))}

            {/* Card 6: "Ready to start?" CTA Card */}
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-lg shadow-blue-500/20 min-h-[180px] sm:min-h-[220px] group/cta">
              {/* Background ambient lighting */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_60%)] pointer-events-none" />
              
              {/* Rocket Badge */}
              <div className="relative mb-2 sm:mb-3">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/90 dark:bg-white text-blue-600 flex items-center justify-center shadow-md transform group-hover/cta:scale-110 transition-transform duration-300">
                  <Rocket className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600 transform -rotate-12" />
                </div>
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-200 absolute -bottom-1 -left-1" />
              </div>

              <h3 className="text-sm sm:text-xl font-bold text-white mb-0.5 sm:mb-1">
                Ready to start?
              </h3>
              <p className="text-[10px] sm:text-xs text-white/80 mb-3 sm:mb-4 font-medium">
                Join 10,000+ resellers today.
              </p>

              <Link href="/signup">
                <button className="bg-white text-blue-600 font-bold px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full text-[10px] sm:text-xs hover:bg-slate-100 transition-colors shadow-md flex items-center gap-1 sm:gap-1.5 group/btn">
                  <span>Get Started Free</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>

          {/* Bottom Wide CTA Banner (Horizontal X-Axis Gradient with White Center Slope) */}
          <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden border border-blue-200/60 dark:border-blue-800/40 p-8 sm:p-14 text-center shadow-xl shadow-blue-500/5 bg-gradient-to-r from-blue-100/70 via-white to-blue-100/70 dark:from-blue-950/50 dark:via-card dark:to-blue-950/50">
            {/* Center X-Axis White Glow with Soft Blue Edges */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,1)_0%,rgba(239,246,255,0.75)_50%,rgba(219,234,254,0.85)_100%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.95)_0%,rgba(30,58,138,0.35)_100%)] pointer-events-none -z-10" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
                Stop Managing Your Business on a Notepad
              </h3>
              <p className="text-xs sm:text-sm text-black dark:text-white max-w-xl mx-auto leading-relaxed">
                Experience the power of a dedicated CRM built for your reselling business. Setup takes less than 2 minutes.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href="/signup" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 via-primary to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 group/btn">
                    <span>Start Free Trial</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </Link>

                <button 
                  onClick={() => setShowDemo(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-white/80 dark:bg-card/90 text-foreground border border-border/80 rounded-full font-bold text-xs sm:text-sm hover:bg-white dark:hover:bg-card transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <PlayCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Watch Demo</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 sm:gap-6 pt-3 text-[11px] font-medium text-muted-foreground">
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
