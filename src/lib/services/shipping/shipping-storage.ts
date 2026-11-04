import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { encryptString, decryptString } from '@/lib/security/encryption'
import {
  loginToShiprocket,
  fetchPickupLocations,
  ShiprocketPickupLocation,
} from './shiprocket'

export interface SellerShippingConfig {
  id?: string
  userId: string
  provider: 'shiprocket'
  email: string
  pickupLocation: string
  availablePickupLocations: ShiprocketPickupLocation[]
  isConnected: boolean
  isTestMode: boolean
  token?: string
  tokenExpiresAt?: string
}

/**
 * Retrieves the current seller's active shipping configuration.
 * Returns public-safe metadata (never returns raw passwords).
 */
export async function getSellerShippingConfig(
  userId: string
): Promise<SellerShippingConfig | null> {
  const supabase = await createClient()

  // 1. Try fetching from seller_shipping_configs table
  try {
    const { data, error } = await supabase
      .from('seller_shipping_configs')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'shiprocket')
      .maybeSingle()

    if (!error && data) {
      return {
        id: data.id,
        userId: data.user_id,
        provider: data.provider || 'shiprocket',
        email: data.email,
        pickupLocation: data.pickup_location || '',
        availablePickupLocations: data.available_pickup_locations || [],
        isConnected: Boolean((data.is_connected && data.token) || data.is_test_mode),
        isTestMode: Boolean(data.is_test_mode),
        tokenExpiresAt: data.token_expires_at,
      }
    }
  } catch (err) {
    // Table might not exist yet, fallback to profile metadata
  }

  // 2. Fallback: check profile.shop_theme metadata
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('shop_theme')
      .eq('id', userId)
      .maybeSingle()

    const theme = (profile?.shop_theme as any) || {}
    const config = theme._shipping_config

    if (config) {
      return {
        userId,
        provider: 'shiprocket',
        email: config.email || 'sandbox@resellerpro.test',
        pickupLocation: config.pickupLocation || 'Test Surat Warehouse',
        availablePickupLocations: config.availablePickupLocations || [
          {
            pickup_location: 'Test Surat Warehouse',
            address: 'Shop 104, Surat Textile Market, Ring Road',
            city: 'Surat',
            state: 'Gujarat',
            pin_code: '395002',
            phone: '9876543210',
          },
        ],
        isConnected: Boolean((config.isConnected && config.token) || config.isTestMode),
        isTestMode: Boolean(config.isTestMode),
        tokenExpiresAt: config.tokenExpiresAt,
      }
    }
  } catch (err) {
    console.error('Error fetching profile shipping fallback:', err)
  }

  return null
}

/**
 * Toggles Developer Sandbox / Test Mode for risk-free testing without Shiprocket balance
 */
export async function toggleShippingTestMode(
  userId: string,
  enableTestMode: boolean
): Promise<{ success: boolean; message: string }> {
  const adminClient = await createAdminClient()

  const defaultLocations: ShiprocketPickupLocation[] = [
    {
      pickup_location: 'Test Surat Warehouse',
      address: 'Shop 104, Surat Textile Market, Ring Road',
      city: 'Surat',
      state: 'Gujarat',
      pin_code: '395002',
      phone: '9876543210',
    },
    {
      pickup_location: 'Test Jaipur Hub',
      address: 'Plot 45, Sitapura Industrial Area',
      city: 'Jaipur',
      state: 'Rajasthan',
      pin_code: '302022',
      phone: '9829012345',
    },
  ]

  // Update seller_shipping_configs table
  try {
    await adminClient.from('seller_shipping_configs').upsert(
      {
        user_id: userId,
        provider: 'shiprocket',
        email: enableTestMode ? 'sandbox@resellerpro.test' : '',
        pickup_location: 'Test Surat Warehouse',
        available_pickup_locations: defaultLocations,
        is_connected: enableTestMode,
        is_test_mode: enableTestMode,
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,provider' }
    )
  } catch {
    // Fallback
  }

  // Update profile fallback
  try {
    const { data: profile } = await adminClient
      .from('profiles')
      .select('shop_theme')
      .eq('id', userId)
      .maybeSingle()

    const theme = (profile?.shop_theme as any) || {}
    theme._shipping_config = {
      ...(theme._shipping_config || {}),
      provider: 'shiprocket',
      email: enableTestMode ? 'sandbox@resellerpro.test' : (theme._shipping_config?.email || ''),
      pickupLocation: theme._shipping_config?.pickupLocation || 'Test Surat Warehouse',
      availablePickupLocations: theme._shipping_config?.availablePickupLocations || defaultLocations,
      isConnected: enableTestMode || Boolean(theme._shipping_config?.token),
      isTestMode: enableTestMode,
      updatedAt: new Date().toISOString(),
    }

    await adminClient
      .from('profiles')
      .update({ shop_theme: theme })
      .eq('id', userId)
  } catch (err) {
    console.error('Error saving shipping config test mode:', err)
  }

  return {
    success: true,
    message: enableTestMode
      ? 'Developer Sandbox Test Mode activated! You can now test 1-click dispatches with zero cost.'
      : 'Developer Sandbox Test Mode deactivated. Real Shiprocket credentials required.',
  }
}

/**
 * Saves and authenticates the seller's Shiprocket credentials.
 */
export async function saveShiprocketCredentials(
  userId: string,
  email: string,
  password?: string,
  pickupLocation?: string
): Promise<{
  success: boolean
  message: string
  locations?: ShiprocketPickupLocation[]
  selectedPickup?: string
}> {
  const supabase = await createClient()
  const adminClient = await createAdminClient()

  let finalPassword = password

  // If password not provided in update, retrieve previous encrypted password
  if (!finalPassword) {
    try {
      const { data } = await adminClient
        .from('seller_shipping_configs')
        .select('password_encrypted, token, token_expires_at')
        .eq('user_id', userId)
        .maybeSingle()

      if (data?.password_encrypted) {
        finalPassword = decryptString(data.password_encrypted)
      }
    } catch {
      // Fallback
    }

    if (!finalPassword) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('shop_theme')
        .eq('id', userId)
        .maybeSingle()
      const fallbackConfig = (profile?.shop_theme as any)?._shipping_config
      if (fallbackConfig?.password_encrypted) {
        finalPassword = decryptString(fallbackConfig.password_encrypted)
      }
    }
  }

  if (!finalPassword) {
    return {
      success: false,
      message: 'Shiprocket account password is required to connect.',
    }
  }

  // 1. Authenticate with Shiprocket
  const authResult = await loginToShiprocket(email.trim(), finalPassword)
  if (!authResult.success || !authResult.token) {
    return {
      success: false,
      message: authResult.error || 'Invalid Shiprocket email or password.',
    }
  }

  const token = authResult.token
  const expiresAt = new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString()

  // 2. Fetch available pickup locations
  const pickupRes = await fetchPickupLocations(token)
  const availableLocations = pickupRes.locations || []

  // Determine active pickup location
  let chosenPickup = pickupLocation || ''
  if (!chosenPickup && availableLocations.length > 0) {
    chosenPickup = availableLocations[0].pickup_location
  }

  const encryptedPassword = encryptString(finalPassword)

  // 3. Save to seller_shipping_configs table (primary)
  try {
    await adminClient.from('seller_shipping_configs').upsert(
      {
        user_id: userId,
        provider: 'shiprocket',
        email: email.trim(),
        password_encrypted: encryptedPassword,
        token,
        token_expires_at: expiresAt,
        pickup_location: chosenPickup,
        available_pickup_locations: availableLocations,
        is_connected: true,
        is_test_mode: false,
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,provider' }
    )
  } catch (err) {
    // Table may not exist yet
  }

  // 4. Save to profile fallback as safety net
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('shop_theme')
      .eq('id', userId)
      .maybeSingle()

    const theme = (profile?.shop_theme as any) || {}
    theme._shipping_config = {
      provider: 'shiprocket',
      email: email.trim(),
      password_encrypted: encryptedPassword,
      token,
      tokenExpiresAt: expiresAt,
      pickupLocation: chosenPickup,
      availablePickupLocations: availableLocations,
      isConnected: true,
      isTestMode: false,
      updatedAt: new Date().toISOString(),
    }

    await adminClient
      .from('profiles')
      .update({ shop_theme: theme })
      .eq('id', userId)
  } catch (err) {
    console.error('Error saving shipping config to profile fallback:', err)
  }

  return {
    success: true,
    message: 'Shiprocket account successfully connected!',
    locations: availableLocations,
    selectedPickup: chosenPickup,
  }
}

/**
 * Gets a fresh, valid Shiprocket token for order fulfillment.
 * Automatically refreshes token if expired.
 */
export async function getValidShiprocketToken(
  userId: string
): Promise<{ token: string; pickupLocation: string; isTestMode?: boolean } | null> {
  const adminClient = await createAdminClient()

  let record: any = null

  // 1. Check seller_shipping_configs table
  try {
    const { data } = await adminClient
      .from('seller_shipping_configs')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'shiprocket')
      .maybeSingle()
    record = data
  } catch {
    // Fallback
  }

  // 2. Check profile fallback if needed
  if (!record) {
    const { data: profile } = await adminClient
      .from('profiles')
      .select('shop_theme')
      .eq('id', userId)
      .maybeSingle()

    const fallback = (profile?.shop_theme as any)?._shipping_config
    if (fallback) {
      record = {
        email: fallback.email,
        password_encrypted: fallback.password_encrypted,
        token: fallback.token,
        token_expires_at: fallback.tokenExpiresAt,
        pickup_location: fallback.pickupLocation,
        is_test_mode: fallback.isTestMode,
      }
    }
  }

  if (!record) {
    return null
  }

  // If in Developer Sandbox Test Mode, return simulated token immediately!
  if (record.is_test_mode) {
    return {
      token: 'SANDBOX_DEV_TOKEN',
      pickupLocation: record.pickup_location || 'Test Surat Warehouse',
      isTestMode: true,
    }
  }

  if (!record.email) {
    return null
  }

  const now = new Date()
  const expiresAt = record.token_expires_at ? new Date(record.token_expires_at) : null

  // Check if token is still valid (with 1 hour buffer)
  if (record.token && expiresAt && expiresAt.getTime() > now.getTime() + 60 * 60 * 1000) {
    return {
      token: record.token,
      pickupLocation: record.pickup_location || 'Primary',
      isTestMode: false,
    }
  }

  // Token expired: re-authenticate using stored encrypted password
  if (record.password_encrypted) {
    const password = decryptString(record.password_encrypted)
    if (password) {
      const auth = await loginToShiprocket(record.email, password)
      if (auth.success && auth.token) {
        const newExpiry = new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString()

        try {
          await adminClient
            .from('seller_shipping_configs')
            .update({
              token: auth.token,
              token_expires_at: newExpiry,
              is_connected: true,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
            .eq('provider', 'shiprocket')
        } catch {
          // Fallback
        }

        return {
          token: auth.token,
          pickupLocation: record.pickup_location || 'Primary',
          isTestMode: false,
        }
      }
    }
  }

  return null
}

/**
 * Disconnects the seller's Shiprocket credentials.
 */
export async function disconnectShiprocket(userId: string): Promise<boolean> {
  const adminClient = await createAdminClient()

  try {
    await adminClient
      .from('seller_shipping_configs')
      .delete()
      .eq('user_id', userId)
      .eq('provider', 'shiprocket')
  } catch {
    // Ignore
  }

  try {
    const { data: profile } = await adminClient
      .from('profiles')
      .select('shop_theme')
      .eq('id', userId)
      .maybeSingle()

    if (profile?.shop_theme) {
      const theme = { ...(profile.shop_theme as any) }
      delete theme._shipping_config
      await adminClient
        .from('profiles')
        .update({ shop_theme: theme })
        .eq('id', userId)
    }
  } catch {
    // Ignore
  }

  return true
}
