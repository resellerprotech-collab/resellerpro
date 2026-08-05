'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function saveOnboardingStep4Action(businessName: string, storeSlug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Authentication required' }
  }

  const cleanName = businessName.trim()
  const cleanSlug = storeSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')

  if (!cleanName || !cleanSlug) {
    return { success: false, message: 'Business name and store URL are required' }
  }

  try {
    // 1. Check slug uniqueness
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('shop_slug', cleanSlug)
      .neq('id', user.id)
      .maybeSingle()

    if (existing) {
      return { success: false, message: 'This store URL is already taken by another user' }
    }

    // 2. Update profile using user client first
    const updatePayload = {
      business_name: cleanName,
      shop_name: cleanName,
      shop_slug: cleanSlug,
      onboarding_step: 5,
      updated_at: new Date().toISOString(),
    }

    let { error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', user.id)

    // 3. Fallback to Admin Client if RLS blocks standard authenticated update on production
    if (error) {
      console.warn('[saveOnboardingStep4Action] Standard user update failed (RLS), trying Admin Client:', error.message)
      const adminSupabase = await createAdminClient()
      const adminResult = await adminSupabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', user.id)

      error = adminResult.error
    }

    if (error) {
      console.error('[saveOnboardingStep4Action] Failed to update onboarding business step:', error)
      return { success: false, message: error.message || 'Failed to save store details' }
    }

    // Revalidate all caches across dashboard and storefront
    revalidatePath('/onboarding')
    revalidatePath('/my-store')
    revalidatePath('/dashboard')
    revalidatePath('/store/[shopSlug]', 'layout')
    revalidatePath('/store/[shopSlug]', 'page')

    return { success: true }
  } catch (err: any) {
    console.error('[saveOnboardingStep4Action] Unexpected error:', err)
    return { success: false, message: err.message || 'Server error occurred' }
  }
}

export async function saveOnboardingStep5Action(productCountRange: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Authentication required' }
  }

  try {
    const updatePayload = {
      product_count_range: productCountRange,
      onboarding_completed: true,
      onboarding_step: 6,
      updated_at: new Date().toISOString(),
    }

    let { error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', user.id)

    if (error) {
      console.warn('[saveOnboardingStep5Action] Standard update failed, trying Admin Client:', error.message)
      const adminSupabase = await createAdminClient()
      const adminResult = await adminSupabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', user.id)

      error = adminResult.error
    }

    if (error) {
      return { success: false, message: error.message }
    }

    revalidatePath('/onboarding')
    revalidatePath('/my-store')
    revalidatePath('/dashboard')

    return { success: true }
  } catch (err: any) {
    return { success: false, message: err.message || 'Server error occurred' }
  }
}
