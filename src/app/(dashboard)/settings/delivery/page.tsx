import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getSellerShippingConfig } from '@/lib/services/shipping/shipping-storage'
import { DeliverySettingsForm } from '@/components/settings/DeliverySettingsForm'

export const dynamic = 'force-dynamic'

export default async function DeliverySettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  // Get current shipping config
  const shippingConfig = await getSellerShippingConfig(user.id)

  // Check subscription status
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('*, plan:subscription_plans(name, display_name)')
    .eq('user_id', user.id)
    .maybeSingle()

  const planName =
    (Array.isArray(subscription?.plan)
      ? subscription.plan[0]?.name
      : (subscription?.plan as any)?.name
    )?.toLowerCase() || 'free'

  const isEligible = ['professional', 'business', 'pro', 'premium'].includes(planName)

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Delivery & Courier Integration
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Connect your Shiprocket account to dispatch orders with 1-click doorstep pickups, automated AWB tracking numbers, and printable shipping labels.
        </p>
      </div>

      <DeliverySettingsForm
        initialConfig={
          shippingConfig
            ? {
                isConnected: shippingConfig.isConnected,
                isTestMode: shippingConfig.isTestMode,
                email: shippingConfig.email,
                pickupLocation: shippingConfig.pickupLocation,
                availablePickupLocations: shippingConfig.availablePickupLocations,
              }
            : null
        }
        isEligible={isEligible}
      />
    </div>
  )
}
