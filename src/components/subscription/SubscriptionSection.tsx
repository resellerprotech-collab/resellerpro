'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'

type SubscriptionSectionProps = {
  subscription: any
  isOpen: boolean
  onTogglePlans: () => void
  children?: React.ReactNode // PricingCards inside expandable panel
}

export function SubscriptionSection({
  subscription,
  isOpen,
  onTogglePlans,
  children,
}: SubscriptionSectionProps) {
  const isFree = subscription?.plan?.name === 'free' || !subscription?.plan?.name
  const planName = subscription?.plan?.display_name || (isFree ? 'Free Plan' : 'Pro Plan')

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all duration-300">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Subscription</h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <RefreshCw className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{planName}</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                {isFree ? 'You are on the Free plan.' : `You are subscribed to the ${planName}.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              onClick={onTogglePlans}
              className="rounded-xl border-slate-200 text-slate-700 font-semibold px-4 py-2 hover:bg-slate-50 text-sm"
            >
              Change plan
            </Button>
            <button
              onClick={onTogglePlans}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors px-2 py-2"
            >
              View all plans
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dropdown / Bottom Screen Expandable Container */}
        {isOpen && (
          <div className="mt-8 pt-8 border-t border-slate-100 animate-in slide-in-from-top-4 duration-300">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Choose Your Plan</h3>
                <p className="text-sm text-slate-500 mt-0.5">Select a plan that fits your business scaling needs.</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onTogglePlans}
                className="text-slate-400 hover:text-slate-600"
              >
                <ChevronUp className="h-5 w-5 mr-1" />
                Close
              </Button>
            </div>
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
