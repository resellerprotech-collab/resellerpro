'use client'

import React from 'react'
import { Users, ShoppingBag, Globe, Award, ShieldCheck, Heart, Truck, Smile, TrendingUp, Package, Star } from 'lucide-react'
import type { ShopTheme } from '@/types'

export interface StatItem {
  id?: string
  icon?: React.ComponentType<{ className?: string }>
  iconName?: string
  value: string
  label: string
}

interface StoreStatsBannerProps {
  stats?: StatItem[]
  theme?: ShopTheme | null
  className?: string
  bgColor?: string
}

// Clean direct icon lookup map
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  'shopping-bag': ShoppingBag,
  globe: Globe,
  award: Award,
  package: Package,
  'shield-check': ShieldCheck,
  heart: Heart,
  truck: Truck,
  smile: Smile,
  star: Star,
  trending: TrendingUp,
}

const defaultStats: StatItem[] = [
  {
    id: 'customers',
    icon: Users,
    value: '50K+',
    label: 'Happy Customers',
  },
  {
    id: 'products',
    icon: ShoppingBag,
    value: '10K+',
    label: 'Products Sold',
  },
  {
    id: 'countries',
    icon: Globe,
    value: '25+',
    label: 'Countries Delivered',
  },
  {
    id: 'feedback',
    icon: Award,
    value: '99%',
    label: 'Positive Feedback',
  },
]

export function StoreStatsBanner({
  stats,
  theme,
  className = '',
  bgColor = '#FAF8F5',
}: StoreStatsBannerProps) {
  // If explicitly disabled in theme settings
  if (theme?.aboutStatsEnabled === false) {
    return null
  }

  // Resolve display stats from theme settings, passed stats prop, or default stats
  const displayStats: StatItem[] = (theme?.aboutStats && theme.aboutStats.length > 0)
    ? theme.aboutStats
    : (stats && stats.length > 0)
      ? stats
      : defaultStats

  return (
    <div className={`w-full py-3 sm:py-5 px-4 ${className}`}>
      <div
        className="max-w-7xl mx-auto rounded-xl border border-[#F0EBE1] py-4 sm:py-5 px-2 shadow-xs"
        style={{ backgroundColor: bgColor }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#E7E1D4]">
          {displayStats.map((item, index) => {
            const IconComponent = item.icon || (item.iconName ? ICON_MAP[item.iconName] : null) || Users

            return (
              <div
                key={item.id || index}
                className="flex flex-col items-center text-center p-2 sm:p-3"
              >
                {/* Minimalist Icon */}
                <div className="mb-1.5 text-[#1C1917]">
                  <IconComponent className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[1.75]" />
                </div>

                {/* Stat Big Number */}
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1C1917] tracking-tight leading-none mb-1">
                  {item.value}
                </span>

                {/* Stat Label */}
                <span className="text-[10px] sm:text-xs text-stone-500 font-medium tracking-tight">
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default StoreStatsBanner
