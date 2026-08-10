'use client'

import { Separator } from "@/components/ui/separator"
import {
  User,
  Building,
  CreditCard,
  Settings as SettingsIcon,
  Wallet,
  Gift,
  ShieldCheck,
  Globe,
  Store,
  Sparkles,
} from "lucide-react"
import Link from 'next/link'
import { usePathname } from "next/navigation"
import { useRef, useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils/cn"

const settingsNavItems = [
  {
    title: "Profile",
    href: "/settings/profile",
    icon: User,
  },
  {
    title: "Business",
    href: "/settings/business",
    icon: Building,
  },
  {
    title: "Domain",
    href: "/settings/domain",
    icon: Globe,
  },
  {
    title: "Wallet",
    href: "/settings/wallet",
    icon: Wallet,
  },
  {
    title: "Security",
    href: "/settings/security",
    icon: ShieldCheck,
  },
  {
    title: "Referrals",
    href: "/settings/referrals",
    icon: Gift,
  },
  {
    title: "Headless",
    href: "/settings/headless",
    icon: Sparkles,
  },
  {
    title: "Preferences",
    href: "/settings/preferences",
    icon: SettingsIcon,
  },
]

// Group tabs into pages of 3 for dot indicators
const TABS_PER_PAGE = 3
const totalPages = Math.ceil(settingsNavItems.length / TABS_PER_PAGE)

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activePage, setActivePage] = useState(0)

  // Calculate which page is currently in view based on scroll position
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollLeft = container.scrollLeft
    const scrollWidth = container.scrollWidth - container.clientWidth

    if (scrollWidth <= 0) {
      setActivePage(0)
      return
    }

    // Calculate page based on scroll percentage
    const scrollPercentage = scrollLeft / scrollWidth
    const page = Math.round(scrollPercentage * (totalPages - 1))
    setActivePage(Math.min(page, totalPages - 1))
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Scroll to a specific page when clicking a dot
  const scrollToPage = (pageIndex: number) => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollWidth = container.scrollWidth - container.clientWidth
    const targetScroll = (pageIndex / (totalPages - 1)) * scrollWidth

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    })
    setActivePage(pageIndex)
  }

  return (
    <div className="space-y-6 pb-16 block">
      <div className="space-y-0.5">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage your account settings, domain web address, wallet payouts, and preferences.
        </p>
      </div>
      <Separator className="my-5" />

      {/* Horizontal Nav Bar */}
      <div className="relative border-b pb-3">
        <div 
          ref={scrollContainerRef}
          className="flex space-x-1.5 overflow-x-auto scrollbar-hide no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth py-1"
        >
          {settingsNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex-shrink-0",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.title}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="mt-6">{children}</div>
    </div>
  )
}
