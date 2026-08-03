'use server'

import { createClient } from '@/lib/supabase/server'
import { generateApiKey } from '@/lib/security/api-keys'
import { revalidatePath } from 'next/cache'

export async function updateHeadlessSettings(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Authentication required' }
  }

  try {
    const store_mode = formData.get('store_mode') as 'standard' | 'headless'
    const connected_domain = (formData.get('connected_domain') as string)?.trim() || null

    if (!['standard', 'headless'].includes(store_mode)) {
      return { success: false, message: 'Invalid store mode' }
    }

    const updatePayload: Record<string, any> = {
      store_mode,
      connected_domain,
      headless_updated_at: new Date().toISOString()
    }

    // If switching to headless mode for the first time without an existing key, auto-generate key
    const { data: profile } = await supabase
      .from('profiles')
      .select('api_key_hash')
      .eq('id', user.id)
      .single()

    let newApiKey: string | null = null
    if (store_mode === 'headless' && !profile?.api_key_hash) {
      const generated = generateApiKey()
      updatePayload.api_key_hash = generated.apiKeyHash
      updatePayload.api_key_prefix = generated.apiKeyPrefix
      newApiKey = generated.apiKey
    }

    const { error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', user.id)

    if (error) {
      return { success: false, message: error.message }
    }

    revalidatePath('/settings/headless')
    revalidatePath('/my-store')
    revalidatePath('/(dashboard)', 'layout')

    return {
      success: true,
      message: `Store mode updated to ${store_mode.toUpperCase()}`,
      newApiKey
    }
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to update headless settings' }
  }
}

export async function generateNewApiKey() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Authentication required' }
  }

  try {
    const generated = generateApiKey()

    const { error } = await supabase
      .from('profiles')
      .update({
        api_key_hash: generated.apiKeyHash,
        api_key_prefix: generated.apiKeyPrefix,
        headless_updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) {
      return { success: false, message: error.message }
    }

    return {
      success: true,
      message: 'API Key regenerated successfully. Previous key is now invalid.',
      apiKey: generated.apiKey,
      apiKeyPrefix: generated.apiKeyPrefix
    }
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to generate API Key' }
  }
}
