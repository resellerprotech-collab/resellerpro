'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'

type UnlockProBannerProps = {
  onUpgradeClick: () => void
}

export function UnlockProBanner({ onUpgradeClick }: UnlockProBannerProps) {
  return (
    <Card className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 via-blue-50/40 to-indigo-50/60 shadow-xs overflow-hidden">
      <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
            <Zap className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Unlock more with Pro</h3>
            <p className="text-sm text-slate-600 mt-0.5">
              Get unlimited orders, advanced analytics, custom domain and more.
            </p>
          </div>
        </div>

        <Button
          onClick={onUpgradeClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-6 py-2.5 shadow-sm transition-all whitespace-nowrap"
        >
          Upgrade to Pro
        </Button>
      </CardContent>
    </Card>
  )
}
