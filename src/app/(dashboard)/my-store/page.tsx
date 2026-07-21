import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ShopSettingsForm from '@/components/settings/ShopSettingsForm'

export const metadata = {
  title: 'Store Setup - ResellerPro',
  description: 'Customize your public store page, layout, and branding.',
}

export default async function MyStorePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  let { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, shop_slug, shop_description, shop_theme, business_name, avatar_url, shop_logo_url')
    .eq('id', user.id)
    .single()

  if ((profileError || !profile) && user) {
    console.log('Self-healing profile for user in MyStorePage:', user.id)
    const { data: newProfile, error: pError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: user.user_metadata?.full_name || 'User',
        email_verified: false,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select('id, shop_slug, shop_description, shop_theme, business_name, avatar_url, shop_logo_url')
      .single()

    if (!pError && newProfile) {
      profile = newProfile
      profileError = null
    } else {
      console.warn('MyStorePage profile upsert via authenticated client failed, trying admin client:', pError)
      const { createAdminClient } = await import('@/lib/supabase/admin')
      const adminSupabase = await createAdminClient()
      const { data: adminProfile, error: adminError } = await adminSupabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: user.user_metadata?.full_name || 'User',
          email_verified: false,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' })
        .select('id, shop_slug, shop_description, shop_theme, business_name, avatar_url, shop_logo_url')
        .single()

      if (!adminError && adminProfile) {
        profile = adminProfile
        profileError = null
      } else {
        console.error('MyStorePage profile creation via admin client also failed:', adminError)
      }
    }
  }

  if (!profile) {
    return (
      <div className="p-6 space-y-4">
        <div className="text-red-500 font-bold">Profile not found</div>
        <div className="text-xs text-slate-500 font-mono">
          User ID: {user.id}<br />
          Error: {profileError ? JSON.stringify(profileError, null, 2) : 'No profile returned (self-healing failed)'}
        </div>
      </div>
    )
  }

  // Get subscription to check eligibility
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('*, plan:subscription_plans(name, display_name)')
    .eq('user_id', user.id)
    .single()

  const planName = (Array.isArray(subscription?.plan) ? subscription.plan[0]?.name : subscription?.plan?.name)?.toLowerCase() || 'free'
  const planDisplay = (Array.isArray(subscription?.plan) ? subscription.plan[0]?.display_name : subscription?.plan?.display_name) || 'Free Plan'
  const isEligible = ['professional', 'business'].includes(planName)

  // Get product count for the preview
  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Store Setup</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your public storefront branding, color themes, catalog appearance, and social checkout preferences.
        </p>
      </div>
      <div className="border rounded-2xl p-6 bg-card">
        <ShopSettingsForm
          profile={profile}
          isEligible={isEligible}
          planName={planName}
          planDisplay={planDisplay}
          productCount={productCount || 0}
        />
      </div>
    </div>
  )
}
