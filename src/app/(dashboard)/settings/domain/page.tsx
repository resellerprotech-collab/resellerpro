import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DomainSettingsForm } from '@/components/settings/DomainSettingsForm'

export default async function DomainSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  // Get current user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('shop_slug')
    .eq('id', user.id)
    .single()

  // Get subscription status
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('*, plan:subscription_plans(name, display_name)')
    .eq('user_id', user.id)
    .maybeSingle()

  const planName = (Array.isArray(subscription?.plan) ? subscription.plan[0]?.name : (subscription?.plan as any)?.name)?.toLowerCase() || 'free'
  const isEligible = ['professional', 'business', 'pro', 'premium'].includes(planName)

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Domain & Web Address</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage your storefront URL address, free subdomain, and custom white-label domain setup.
        </p>
      </div>

      <DomainSettingsForm 
        shopSlug={profile?.shop_slug || ''} 
        isProUser={isEligible} 
      />
    </div>
  )
}
