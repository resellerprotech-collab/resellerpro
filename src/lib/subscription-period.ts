import { checkAndDowngradeSubscription } from '@/lib/subscription-utils'

export interface SubscriptionPeriod {
  periodStart: Date
  periodEnd: Date
  periodStartISO: string
  periodEndISO: string
  subscription: any
}

/**
 * Calculates the current active subscription/usage period for a user.
 * Accepts an optional pre-fetched subscription object to avoid extra DB calls.
 */
export async function getCurrentSubscriptionPeriod(
  userId: string,
  preFetchedSub?: any
): Promise<SubscriptionPeriod> {
  const subscription = preFetchedSub || (await checkAndDowngradeSubscription(userId))

  const now = new Date()

  const rawStart = subscription?.current_period_start
  const rawEnd = subscription?.current_period_end

  let periodStart: Date
  let periodEnd: Date

  if (rawStart && rawEnd) {
    periodStart = new Date(rawStart)
    periodEnd = new Date(rawEnd)

    // If for any reason periodEnd has passed, dynamically project forward in monthly cycles
    while (periodEnd <= now) {
      periodStart = new Date(periodEnd)
      periodEnd = new Date(periodStart)
      periodEnd.setMonth(periodEnd.getMonth() + 1)
    }
  } else {
    // Fallback if dates are missing: default to current calendar month boundaries
    periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
    periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  }

  return {
    periodStart,
    periodEnd,
    periodStartISO: periodStart.toISOString(),
    periodEndISO: periodEnd.toISOString(),
    subscription,
  }
}
