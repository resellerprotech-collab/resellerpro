'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  ChevronUp,
  ChevronDown,
  Store,
  Share2,
  ShoppingBag,
  Package,
  Paintbrush,
  Rocket,
} from 'lucide-react'

interface ChecklistItem {
  id: string
  label: string
  icon: React.ElementType
  href?: string
  done: boolean
}

interface OnboardingChecklistCardProps {
  hasProducts: boolean
  shopSlug: string | null
  hasOrders: boolean
  hasCustomized: boolean
}

const COLLAPSED_KEY = 'rp_onboarding_checklist_collapsed'
const GUIDE_COMPLETED_KEY = 'rp_onboarding_guide_completed'

export function OnboardingChecklistCard({
  hasProducts,
  shopSlug,
  hasOrders,
  hasCustomized,
}: OnboardingChecklistCardProps) {
  const [mounted, setMounted] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [hasShared, setHasShared] = useState(false)
  const [hidden, setHidden] = useState(false)

  // Build items list (needed by the auto-dismiss hook below)
  const items: ChecklistItem[] = [
    {
      id: 'store_created',
      label: 'Create your store',
      icon: Store,
      done: true,
    },
    {
      id: 'first_product',
      label: 'Add your first product',
      icon: Package,
      href: '/products/new',
      done: hasProducts,
    },
    {
      id: 'customize_store',
      label: 'Customize your store',
      icon: Paintbrush,
      href: '/settings/shop',
      done: hasCustomized,
    },
    {
      id: 'share_store',
      label: 'Share your store',
      icon: Share2,
      href: shopSlug ? `/store/${shopSlug}` : undefined,
      done: hasShared,
    },
    {
      id: 'first_order',
      label: 'Get your first order',
      icon: ShoppingBag,
      href: '/orders',
      done: hasOrders,
    },
  ]

  const completedCount = items.filter(i => i.done).length
  const allDone = completedCount === items.length
  const progressPct = (completedCount / items.length) * 100

  // --- ALL hooks must be above any early returns ---

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      setCollapsed(localStorage.getItem(COLLAPSED_KEY) === '1')
      setHasShared(localStorage.getItem('rp_store_shared') === '1')
      
      // If already marked completed in the past, initialize as hidden to avoid flickering
      if (localStorage.getItem(GUIDE_COMPLETED_KEY) === '1') {
        setHidden(true)
      }
    }

    // Register event listener for real-time updates when shared on dashboard
    const handleShareUpdate = () => {
      setHasShared(localStorage.getItem('rp_store_shared') === '1')
    }
    window.addEventListener('rp_store_shared_updated', handleShareUpdate)
    return () => {
      window.removeEventListener('rp_store_shared_updated', handleShareUpdate)
    }
  }, [])

  // Auto-hide when all steps are completed
  useEffect(() => {
    if (allDone && mounted) {
      // Brief delay so user sees 5/5 complete before it disappears
      const timer = setTimeout(() => {
        setHidden(true)
        localStorage.setItem(GUIDE_COMPLETED_KEY, '1')
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [allDone, mounted])

  // --- Early returns AFTER all hooks ---

  if (!mounted) return null
  if (hidden) return null

  function toggleCollapse() {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem(COLLAPSED_KEY, next ? '1' : '0')
  }

  // Find the next incomplete step
  const nextStep = items.find(i => !i.done)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-5 right-5 z-50"
        style={{ width: '320px' }}
      >
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl shadow-black/10 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-700/60 overflow-hidden">

          {/* Header — always visible */}
          <div
            className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
            onClick={toggleCollapse}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <Rocket className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white leading-tight">
                  Setup guide
                </h4>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight mt-0.5">
                  {allDone ? 'All done!' : `${completedCount} of ${items.length} complete`}
                </p>
              </div>
            </div>

            <div className="flex items-center flex-shrink-0">
              <div className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 dark:text-slate-500">
                {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </div>
            </div>
          </div>

          {/* Progress bar — always visible */}
          <div className="px-4 pb-2">
            <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Expandable checklist */}
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-2 pb-2 space-y-0.5">
                  {items.map((item) => {
                    const Icon = item.icon
                    const isNext = nextStep?.id === item.id
                    const content = (
                      <div className={`
                        flex items-center gap-2.5 px-2 py-2 rounded-lg transition-all
                        ${isNext && !item.done ? 'bg-blue-50/70 dark:bg-blue-950/30' : ''}
                        ${!item.done && item.href ? 'hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer' : ''}
                      `}>
                        {/* Status dot */}
                        <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          item.done
                            ? 'bg-emerald-500'
                            : isNext
                              ? 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-950'
                              : 'border-[1.5px] border-slate-300 dark:border-slate-600'
                        }`}>
                          {item.done && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                          {isNext && !item.done && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                        </div>

                        {/* Label */}
                        <span className={`text-[13px] leading-tight flex-1 ${
                          item.done
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : isNext
                              ? 'text-blue-700 dark:text-blue-400 font-medium'
                              : 'text-slate-600 dark:text-slate-400'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                    )

                    if (item.href && !item.done) {
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          target={item.href.startsWith('http') || item.id === 'share_store' ? '_blank' : undefined}
                          onClick={() => {
                            if (item.id === 'share_store') {
                              localStorage.setItem('rp_store_shared', '1')
                              setHasShared(true)
                            }
                          }}
                        >
                          {content}
                        </Link>
                      )
                    }

                    return <div key={item.id}>{content}</div>
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
