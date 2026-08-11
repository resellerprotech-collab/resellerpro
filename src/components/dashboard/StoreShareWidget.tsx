'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, ExternalLink, MessageCircle, Globe, Clock, Lock } from 'lucide-react'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

interface StoreShareWidgetProps {
  shopSlug: string
  storeStatus?: string
}

export function StoreShareWidget({ shopSlug, storeStatus = 'open' }: StoreShareWidgetProps) {

  
  const displayHost = typeof window !== 'undefined' ? window.location.host : 'resellerpro.in'
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || 'https://resellerpro.in')
  
  const displayUrl = `${displayHost}/store/${shopSlug}`
  const fullUrl = `${baseUrl}/store/${shopSlug}`

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl)
    toast.success('Store link copied to clipboard')
    if (typeof window !== 'undefined') {
      localStorage.setItem('rp_store_shared', '1')
      window.dispatchEvent(new Event('rp_store_shared_updated'))
    }
  }

  const handleShare = () => {
    window.open(`https://wa.me/?text=Check%20out%20my%20store:%20${fullUrl}`, '_blank')
    if (typeof window !== 'undefined') {
      localStorage.setItem('rp_store_shared', '1')
      window.dispatchEvent(new Event('rp_store_shared_updated'))
    }
  }

  return (
    <Card className={cn("p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border shadow-sm mb-6 transition-colors",
      storeStatus === 'open' ? 'border-emerald-200/80 bg-emerald-50/50 dark:border-emerald-500/30 dark:bg-emerald-950/20' :
      storeStatus === 'vacation' ? 'border-amber-200/80 bg-amber-50/50 dark:border-amber-500/30 dark:bg-amber-950/20' :
      'border-red-200/80 bg-red-50/50 dark:border-red-500/30 dark:bg-red-950/20'
    )}>
      <div className="flex items-center gap-4">
        <div className={cn("p-3 rounded-xl shadow-sm border",
          storeStatus === 'open' ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400' :
          storeStatus === 'vacation' ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400' :
          'bg-red-100 dark:bg-red-900/40 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400'
        )}>
          {storeStatus === 'open' ? <Globe className="w-6 h-6" /> :
           storeStatus === 'vacation' ? <Clock className="w-6 h-6" /> :
           <Lock className="w-6 h-6" />}
        </div>
        <div>
          <p className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100">
            {storeStatus === 'open' ? '🟢 Your Store is LIVE' : storeStatus === 'vacation' ? '🟡 Store on Vacation' : '🔴 Store Closed'}
          </p>
          <div className="flex items-center text-xs font-mono mt-0.5 select-all text-emerald-700 dark:text-emerald-300 font-medium">
            {displayUrl}
          </div>
        </div>
      </div>

      <div className="flex w-full md:w-auto items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleCopy} className="flex-1 md:flex-none gap-1.5 h-9 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200">
          <Copy className="w-3.5 h-3.5" /> Copy Link
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare} className="flex-1 md:flex-none gap-1.5 h-9 text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/40 border-green-200 dark:border-green-800/40 bg-white dark:bg-slate-900 shadow-sm">
          <MessageCircle className="w-3.5 h-3.5" /> Share
        </Button>
        <Button size="sm" onClick={() => window.open(`/store/${shopSlug}`, '_blank')} className="gap-1 flex-shrink-0 h-9 px-3 shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
          Visit <ExternalLink className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  )
}
