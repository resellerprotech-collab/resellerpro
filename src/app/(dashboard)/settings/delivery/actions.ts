'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import {
  saveShiprocketCredentials,
  disconnectShiprocket,
  toggleShippingTestMode,
} from '@/lib/services/shipping/shipping-storage'
import { createAdminClient } from '@/lib/supabase/admin'

export async function saveShiprocketSettingsAction(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Authentication required' }
  }

  const email = (formData.get('email') as string) || ''
  const password = (formData.get('password') as string) || ''
  const pickupLocation = (formData.get('pickupLocation') as string) || ''

  if (!email || !email.includes('@')) {
    return { success: false, message: 'Valid Shiprocket email is required.' }
  }

  const result = await saveShiprocketCredentials(
    user.id,
    email.trim(),
    password ? password.trim() : undefined,
    pickupLocation ? pickupLocation.trim() : undefined
  )

  if (result.success) {
    revalidatePath('/settings/delivery')
    revalidatePath('/orders')
    revalidatePath('/orders/[id]', 'page')
  }

  return result
}

export async function toggleTestModeAction(enableTestMode: boolean) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Authentication required' }
  }

  const result = await toggleShippingTestMode(user.id, enableTestMode)

  revalidatePath('/settings/delivery')
  revalidatePath('/orders')
  revalidatePath('/orders/[id]', 'page')

  return result
}

export async function updatePickupLocationAction(pickupLocation: string) {
  const supabase = await createClient()
  const adminClient = await createAdminClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Authentication required' }
  }

  if (!pickupLocation) {
    return { success: false, message: 'Please select a pickup location.' }
  }

  try {
    await adminClient
      .from('seller_shipping_configs')
      .update({
        pickup_location: pickupLocation,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('provider', 'shiprocket')
  } catch {
    // Fallback
  }

  try {
    const { data: profile } = await adminClient
      .from('profiles')
      .select('shop_theme')
      .eq('id', user.id)
      .maybeSingle()

    if (profile?.shop_theme) {
      const theme = { ...(profile.shop_theme as any) }
      if (theme._shipping_config) {
        theme._shipping_config.pickupLocation = pickupLocation
        await adminClient
          .from('profiles')
          .update({ shop_theme: theme })
          .eq('id', user.id)
      }
    }
  } catch {
    // Ignore
  }

  revalidatePath('/settings/delivery')
  return { success: true, message: 'Pickup location updated.' }
}

export async function disconnectShiprocketAction() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Authentication required' }
  }

  await disconnectShiprocket(user.id)

  revalidatePath('/settings/delivery')
  revalidatePath('/orders')
  revalidatePath('/orders/[id]', 'page')

  return { success: true, message: 'Shiprocket account disconnected.' }
}
