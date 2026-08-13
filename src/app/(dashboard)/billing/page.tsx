export const dynamic = 'force-dynamic'

import { Card, CardContent } from '@/components/ui/card'
import { getSubscriptionData, getAvailablePlans, getBillingHistory } from './actions'
import { ClientScrollHandler } from './ClientScrollHandler'
import { BillingView } from '@/components/subscription/BillingView'
import Script from 'next/script'

export const metadata = {
  title: 'Billing & Subscription - ResellerPro',
  description: 'Manage your subscription and billing details.',
}

export default async function BillingPage() {
  const subscription = await getSubscriptionData()
  const plans = await getAvailablePlans()
  const invoices = await getBillingHistory()

  // Get wallet balance
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let walletBalance = 0
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('wallet_balance')
      .eq('id', user.id)
      .single()
    walletBalance = parseFloat(profile?.wallet_balance || '0')
  }

  if (!subscription) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your subscription, billing details and view usage.</p>
        </div>
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              Unable to load subscription data. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      {/* Client-side scroll handler for hash anchors */}
      <ClientScrollHandler />

      {/* Razorpay Checkout Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <BillingView
        subscription={subscription}
        plans={plans}
        walletBalance={walletBalance}
        invoices={invoices}
      />
    </>
  )
}
