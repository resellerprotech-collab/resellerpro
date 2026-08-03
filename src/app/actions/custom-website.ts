'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateApiKey } from '@/lib/security/api-keys'
import { revalidatePath } from 'next/cache'

/**
 * Submit custom website request from merchant
 */
export async function submitCustomWebsiteRequest(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Authentication required' }
  }

  try {
    const adminSupabase = await createAdminClient()

    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('business_name, phone, email')
      .eq('id', user.id)
      .single()

    // Check if request already exists
    const { data: existing } = await adminSupabase
      .from('custom_website_requests')
      .select('id, status')
      .eq('user_id', user.id)
      .maybeSingle()

    if (existing) {
      return { success: false, message: `You already have an active request in ${existing.status.toUpperCase()} status.` }
    }

    const { error } = await adminSupabase
      .from('custom_website_requests')
      .insert({
        user_id: user.id,
        status: 'pending',
        contact_phone: profile?.phone || null,
        contact_email: profile?.email || user.email,
        business_name: profile?.business_name || null,
        notes: (formData.get('notes') as string) || null
      })

    if (error) {
      console.error('custom_website_requests insert error:', error)
      return { success: false, message: error.message || 'Database error' }
    }

    revalidatePath('/settings/headless')
    revalidatePath('/my-store')

    return { success: true, message: "We've received your request. Our team will contact you shortly!" }
  } catch (err: any) {
    console.error('submitCustomWebsiteRequest error:', err)
    return { success: false, message: err.message || 'Failed to submit request' }
  }
}

/**
 * Admin action to update request status (Approve, Reject, Set Status)
 */
export async function updateRequestStatusByAdmin(requestId: string, targetUserId: string, newStatus: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Authentication required' }

  const adminSupabase = await createAdminClient()

  try {
    // 1. Update request status
    const { error: reqErr } = await adminSupabase
      .from('custom_website_requests')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)

    if (reqErr) throw reqErr

    // 2. If APPROVED, enable Headless mode automatically and generate key if needed
    if (newStatus === 'approved') {
      const { data: profile } = await adminSupabase
        .from('profiles')
        .select('api_key_hash')
        .eq('id', targetUserId)
        .single()

      const updatePayload: Record<string, any> = {
        store_mode: 'headless',
        headless_updated_at: new Date().toISOString()
      }

      let generatedKey: string | null = null
      if (!profile?.api_key_hash) {
        const generated = generateApiKey()
        updatePayload.api_key_hash = generated.apiKeyHash
        updatePayload.api_key_prefix = generated.apiKeyPrefix
        generatedKey = generated.apiKey
      }

      await adminSupabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', targetUserId)

      revalidatePath('/settings/headless')
      revalidatePath('/my-store')
      revalidatePath('/ekodrix-panel/website-requests')

      return {
        success: true,
        message: `Request approved! Headless mode enabled for store.`,
        generatedKey
      }
    }

    revalidatePath('/ekodrix-panel/website-requests')
    return { success: true, message: `Request status updated to ${newStatus.toUpperCase()}` }
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to update request' }
  }
}

/**
 * Admin action to manage store API Key directly (generate/regenerate/revoke)
 */
export async function adminManageApiKey(targetUserId: string, action: 'generate' | 'regenerate' | 'revoke') {
  const adminSupabase = await createAdminClient()

  try {
    if (action === 'revoke') {
      await adminSupabase
        .from('profiles')
        .update({
          api_key_hash: null,
          api_key_prefix: null,
          headless_updated_at: new Date().toISOString()
        })
        .eq('id', targetUserId)

      revalidatePath('/settings/headless')
      revalidatePath('/ekodrix-panel/website-requests')

      return { success: true, message: 'API Key revoked successfully.' }
    }

    const generated = generateApiKey()

    await adminSupabase
      .from('profiles')
      .update({
        api_key_hash: generated.apiKeyHash,
        api_key_prefix: generated.apiKeyPrefix,
        store_mode: 'headless',
        headless_updated_at: new Date().toISOString()
      })
      .eq('id', targetUserId)

    revalidatePath('/settings/headless')
    revalidatePath('/ekodrix-panel/website-requests')

    return {
      success: true,
      message: `API Key ${action === 'generate' ? 'generated' : 'regenerated'} successfully.`,
      apiKey: generated.apiKey,
      apiKeyPrefix: generated.apiKeyPrefix
    }
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to update API Key' }
  }
}
