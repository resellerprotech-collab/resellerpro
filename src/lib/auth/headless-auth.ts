import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hashApiKey, isValidApiKeyFormat } from '@/lib/security/api-keys'

export interface HeadlessAuthStore {
  id: string // profile/store owner user_id
  shop_slug: string
  business_name: string
  connected_domain: string | null
  store_mode: 'standard' | 'headless'
}

export interface HeadlessAuthResult {
  success: boolean
  error?: string
  statusCode?: number
  store?: HeadlessAuthStore
}

/**
 * Validate incoming Headless API Request using Authorization: Bearer rp_live_xxx header.
 * Ensures key is valid, store is in headless mode, and returns isolated store context.
 */
export async function authenticateHeadlessRequest(req: NextRequest): Promise<HeadlessAuthResult> {
  const authHeader = req.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      success: false,
      error: 'Missing or invalid Authorization header. Expected format: Bearer rp_live_xxxxxxxx',
      statusCode: 401
    }
  }

  const apiKey = authHeader.replace('Bearer ', '').trim()

  if (!isValidApiKeyFormat(apiKey)) {
    return {
      success: false,
      error: 'Invalid API key format',
      statusCode: 401
    }
  }

  const apiKeyHash = hashApiKey(apiKey)
  const supabase = await createAdminClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, shop_slug, business_name, connected_domain, store_mode, api_key_hash')
    .eq('api_key_hash', apiKeyHash)
    .single()

  if (error || !profile) {
    return {
      success: false,
      error: 'Invalid API Key',
      statusCode: 401
    }
  }

  if (profile.store_mode !== 'headless') {
    return {
      success: false,
      error: 'Headless mode is disabled for this store account.',
      statusCode: 403
    }
  }

  return {
    success: true,
    store: {
      id: profile.id,
      shop_slug: profile.shop_slug,
      business_name: profile.business_name,
      connected_domain: profile.connected_domain,
      store_mode: profile.store_mode as 'standard' | 'headless'
    }
  }
}
