'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Crown, Check, ArrowRight } from 'lucide-react'

type CurrentPlanSectionProps = {
  subscription: any
  onUpgradeClick: () => void
}

export function CurrentPlanSection({ subscription, onUpgradeClick }: CurrentPlanSectionProps) {
  const isFree = subscription?.plan?.name === 'free' || !subscription?.plan?.name
  const planName = subscription?.plan?.display_name || (isFree ? 'Free Plan' : 'Pro Plan')
  const status = subscription?.status || 'active'
  const isStatusActive = status === 'active'

  // Features list
  const freeFeatures = [
    'Your own online store',
    'Orders, products & customers',
    'WhatsApp smart paste',
    'Invoice generator',
    'Basic analytics',
    'Email support',
  ]

  const activeFeatures = subscription?.plan?.features && Array.isArray(subscription.plan.features) && subscription.plan.features.length > 0
    ? subscription.plan.features
    : freeFeatures

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <CardContent className="p-6 md:p-8">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Current Plan</h2>
          <Badge
            className={`px-3 py-1 text-xs font-semibold rounded-full border flex items-center gap-1.5 ${
              isStatusActive
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                : 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-50'
            }`}
          >
            <Check className="h-3.5 w-3.5" />
            <span className="capitalize">{status}</span>
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Plan Info & Action */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <Crown className="h-7 w-7 text-blue-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{planName}</h3>
                <p className="text-sm font-medium text-slate-600">
                  {isFree ? (
                    <>
                      <span className="font-bold text-slate-900">₹0/month</span>
                      <span className="mx-1 font-normal">•</span>
                      <span>Free forever</span>
                    </>
                  ) : (
                    <>
                      <span className="font-bold text-slate-900">
                        ₹{subscription?.plan?.price ?? subscription?.plan_details?.price ?? 499}/month
                      </span>
                      <span className="mx-1 font-normal">•</span>
                      <span>Billed monthly</span>
                    </>
                  )}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {isFree
                    ? 'Perfect to start your business online.'
                    : 'Unlocks higher limits and growth tools for your business.'}
                </p>
              </div>
            </div>

            {isFree && (
              <div>
                <Button
                  onClick={onUpgradeClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-6 py-5 shadow-sm transition-all flex items-center gap-2"
                >
                  Upgrade to Pro
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Right Column: Plan Features checklist */}
          <div className="lg:col-span-6 lg:border-l lg:border-slate-100 lg:pl-10">
            <ul className="space-y-3">
              {activeFeatures.map((feature: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                  <div className="h-5 w-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 mt-0.5">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span className="leading-snug break-words">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
