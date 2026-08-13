'use client'

import { useState, useRef } from 'react'
import { CurrentPlanSection } from './CurrentPlanSection'
import { BillingDetailsSection } from './BillingDetailsSection'
import { SubscriptionSection } from './SubscriptionSection'
import { PlanUsageSection } from './PlanUsageSection'
import { UnlockProBanner } from './UnlockProBanner'
import { PricingCards } from './PricingCards'

type BillingViewProps = {
  subscription: any
  plans: any[]
  walletBalance: number
  invoices?: any[]
}

export function BillingView({
  subscription,
  plans,
  walletBalance,
  invoices = [],
}: BillingViewProps) {
  const [isPlansOpen, setIsPlansOpen] = useState(false)
  const subscriptionRef = useRef<HTMLDivElement>(null)

  const isPro = subscription?.plan?.name && subscription.plan.name !== 'free'

  const handleTogglePlans = () => {
    setIsPlansOpen((prev) => {
      const nextState = !prev
      if (nextState) {
        setTimeout(() => {
          subscriptionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
      return nextState
    })
  }

  const handleOpenPlans = () => {
    setIsPlansOpen(true)
    setTimeout(() => {
      subscriptionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4 px-2 md:px-4">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Billing & Subscription</h1>
        <p className="text-slate-500 mt-1 text-sm md:text-base">
          Manage your subscription, billing details and view usage.
        </p>
      </div>

      {/* 1. Current Plan Section */}
      <CurrentPlanSection
        subscription={subscription}
        onUpgradeClick={handleOpenPlans}
      />

      {/* 2. Billing Section */}
      <BillingDetailsSection
        subscription={subscription}
        invoices={invoices}
        onAddPaymentMethod={handleOpenPlans}
      />

      {/* 3. Subscription Section with Dropdown / Bottom screen plans display */}
      <div ref={subscriptionRef}>
        <SubscriptionSection
          subscription={subscription}
          isOpen={isPlansOpen}
          onTogglePlans={handleTogglePlans}
        >
          <PricingCards
            plans={plans}
            currentPlanName={subscription?.plan?.name || 'free'}
            walletBalance={walletBalance}
          />
        </SubscriptionSection>
      </div>

      {/* 4. Plan Usage Section */}
      <PlanUsageSection metrics={subscription?.metrics || {}} />

      {/* 5. Unlock More Banner */}
      {!isPro && <UnlockProBanner onUpgradeClick={handleOpenPlans} />}
    </div>
  )
}
