import { createAdminClient } from '@/lib/supabase/admin'
import AdminWebsiteRequestsClient from '@/components/ekodrix-panel/AdminWebsiteRequestsClient'

export const metadata = {
  title: 'Custom Website Requests - Ekodrix Panel',
}

export default async function AdminWebsiteRequestsPage() {
  const supabase = await createAdminClient()

  // Fetch all custom website requests with profile metadata
  const { data: requests, error } = await supabase
    .from('custom_website_requests')
    .select(`
      id,
      user_id,
      status,
      contact_phone,
      contact_email,
      business_name,
      created_at,
      profile:profiles (
        shop_slug,
        store_mode,
        connected_domain,
        api_key_prefix
      )
    `)
    .order('created_at', { ascending: false })

  // Fetch pending count for sidebar / header badge
  const { count: pendingCount } = await supabase
    .from('custom_website_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const formattedRequests = (requests || []).map(r => ({
    ...r,
    profile: Array.isArray(r.profile) ? r.profile[0] : r.profile
  }))

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Custom Website Requests</h1>
        <p className="text-sm text-gray-400 mt-1">
          Review, approve, and manage Ekodrix Headless custom website client requests and API Keys.
        </p>
      </div>

      <AdminWebsiteRequestsClient 
        initialRequests={formattedRequests as any}
        pendingCount={pendingCount || 0}
      />
    </div>
  )
}
