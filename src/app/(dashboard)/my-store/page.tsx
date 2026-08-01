import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ShopSettingsForm from '@/components/settings/ShopSettingsForm'
import { DomainSettingsForm } from '@/components/settings/DomainSettingsForm'

export default async function MyStorePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  // Get current user profile
  let { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Self-healing fallback if profile row doesn't exist
  if (!profile) {
    console.warn(`[MyStorePage] Profile missing for user ${user.id}, attempting self-healing creation...`)
    
    const defaultSlug = user.email ? user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : `user${user.id.slice(0, 6)}`
    
    const { data: newProfile } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email || '',
        business_name: user.user_metadata?.business_name || 'My Shop',
        shop_slug: defaultSlug,
        shop_theme: { primaryColor: '#4f46e5', layout: 'grid' },
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single()

    if (newProfile) {
      profile = newProfile
      profileError = null
    }
  }

  if (!profile) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <h2 className="text-xl font-bold text-red-600">Account Setup Error</h2>
        <p className="text-sm text-slate-600">
          We could not load or initialize your seller profile. Please contact support or try logging out and logging back in.
        </p>
        <div className="text-xs font-mono bg-slate-100 p-3 rounded text-left overflow-auto">
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

  const planName = (Array.isArray(subscription?.plan) ? subscription.plan[0]?.name : (subscription?.plan as any)?.name)?.toLowerCase() || 'free'
  const planDisplay = (Array.isArray(subscription?.plan) ? subscription.plan[0]?.display_name : (subscription?.plan as any)?.display_name) || 'Free Plan'
  const isEligible = true

  // Get product count for the preview
  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Get active products for banner click actions
  const { data: dbProducts } = await supabase
    .from('products')
    .select('id, name, category')
    .eq('user_id', user.id)
    .eq('is_active', true)

  const activeProducts = dbProducts || []
  const distinctCategories: string[] = Array.from(
    new Set(
      activeProducts
        .map((p: { category: string | null }) => p.category)
        .filter((c: string | null): c is string => typeof c === 'string' && c.trim().length > 0)
    )
  )

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Store Setup & Domain Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure your store web address, custom domains, branding appearance, color themes, and social checkout preferences.
        </p>
      </div>

      {/* Domain Management Panel (Subdomain + Custom Domain) */}
      <DomainSettingsForm shopSlug={profile.shop_slug || ''} isProUser={isEligible} />

      {/* Main Store Customizer */}
      <div className="border rounded-2xl p-6 bg-card shadow-sm">
        <ShopSettingsForm
          profile={profile}
          isEligible={isEligible}
          planName={planName}
          planDisplay={planDisplay}
          productCount={productCount || 0}
          products={activeProducts.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name }))}
          categories={distinctCategories}
        />
      </div>
    </div>
  )
}
