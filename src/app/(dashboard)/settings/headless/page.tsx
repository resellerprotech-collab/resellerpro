import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import HeadlessSettingsForm from '@/components/settings/HeadlessSettingsForm'

export const metadata = {
  title: 'Headless Settings - ResellerPro',
  description: 'Manage your custom Next.js website headless connection and API keys.',
}

export default async function HeadlessSettingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('store_mode, connected_domain, api_key_prefix')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-6 max-w-4xl py-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Headless Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure Headless Mode to connect custom Next.js storefronts built by the Ekodrix team.
        </p>
      </div>

      <HeadlessSettingsForm
        initialStoreMode={(profile?.store_mode as 'standard' | 'headless') || 'standard'}
        initialConnectedDomain={profile?.connected_domain || null}
        apiKeyPrefix={profile?.api_key_prefix || null}
      />
    </div>
  )
}
