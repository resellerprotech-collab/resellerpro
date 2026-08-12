'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Bell, Plus, Sun, Moon, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useTheme } from 'next-themes'
import { NotificationDrawer } from '@/components/notifications/NotificationDrawer'
import { GlobalSearch } from '@/components/layout/GlobalSearch'
import { useOfflineQueue } from '@/lib/hooks/useOfflineQueue'
import { RequireVerification } from '../shared/RequireVerification'
import { usePlanLimits } from '@/hooks/usePlanLimits'
import { LimitReachedModal } from '../subscription/LimitReachedModal'
import { ThemeToggleToast } from './ThemeToggleToast'

export default function Header() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { checkLimit, limitModalProps } = usePlanLimits()
  const { isOnline } = useOfflineQueue() // ✅ Initialize hook globally

  return (
    <header className="flex items-center justify-between pl-14 pr-3 lg:px-4 h-14 sm:h-16 border-b border-slate-200/80 dark:border-slate-800/80 gap-2 sm:gap-3 min-w-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md lg:bg-background lg:backdrop-blur-none transition-all shadow-2xs lg:shadow-none">
      {/* Left Side: Offline Indicator */}
      <div className="hidden sm:flex items-center gap-2">
        {!isOnline && (
          <Badge variant="destructive" className="items-center gap-1 flex">
            <WifiOff className="h-3 w-3" />
            <span className="text-xs">Offline</span>
          </Badge>
        )}
      </div>

      {/* Right Side: Search, Quick Add, Theme Toggle, Notifications */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 justify-end flex-1 min-w-0 max-w-3xl">
        <GlobalSearch />

        {/* Quick Add */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5 h-9 w-9 sm:w-auto p-0 sm:px-3 text-xs shrink-0 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white dark:text-white shadow-xs shadow-indigo-500/20 active:scale-95 transition-all">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Quick Add</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Create New</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <RequireVerification>
              <DropdownMenuItem onClick={() => checkLimit('enquiries') && router.push('/enquiries/new')}>
                New Enquiry
              </DropdownMenuItem>
            </RequireVerification>
            <RequireVerification>
              <DropdownMenuItem onClick={() => checkLimit('orders') && router.push('/orders/new')}>
                New Order
              </DropdownMenuItem>
            </RequireVerification>
            <RequireVerification>
              <DropdownMenuItem onClick={() => checkLimit('products') && router.push('/products/new')}>
                New Product
              </DropdownMenuItem>
            </RequireVerification>
            <RequireVerification>
              <DropdownMenuItem onClick={() => checkLimit('customers') && router.push('/customers/new')}>
                New Customer
              </DropdownMenuItem>
            </RequireVerification>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all active:scale-95"
        >
          <Sun className="h-4 w-4 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 sm:h-5 sm:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <ThemeToggleToast />

        {/* Notifications */}
        <div className="shrink-0 flex items-center">
          <NotificationDrawer />
        </div>
      </div>
      <LimitReachedModal {...limitModalProps} />
    </header>
  )
}

function NotificationItem({
  title,
  description,
  time,
  unread,
}: {
  title: string
  description: string
  time: string
  unread?: boolean
}) {
  return (
    <div className="flex gap-3 p-3 hover:bg-accent cursor-pointer transition-colors border-b last:border-0">
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{title}</p>
          {unread && <div className="h-2 w-2 rounded-full bg-primary" />}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  )
}
