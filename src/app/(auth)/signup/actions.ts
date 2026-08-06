'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { headers } from 'next/headers'
import { createNotification } from '@/lib/services/notificationService'
import { OtpService } from '@/lib/auth/otp'

// -------------------------------
// Validation schema
// -------------------------------
// TEACHING NOTE: Why validate on the backend even if frontend validates?
// - Frontend can be bypassed (browser dev tools, direct API calls)
// - Backend is the security boundary - NEVER trust client input
// - This is "defense in depth" - multiple layers of security

// SIMPLIFIED SIGNUP SCHEMA
// Only 3 fields collected at signup — business details collected during onboarding.
const SignupSchema = z.object({
  // EMAIL VALIDATION
  // Why these rules?
  // - min 5: Shortest valid email is "a@b.c" (5 characters)
  // - max 254: RFC 5321 standard for email length
  // - trim(): Remove accidental whitespace from copy-paste
  // - toLowerCase(): Emails are case-insensitive, prevents duplicate accounts
  email: z.string()
    .trim()
    .toLowerCase()
    .min(5, 'Email must be at least 5 characters.')
    .max(254, 'Email must not exceed 254 characters.')
    .email('Invalid email address.'),

  // PASSWORD VALIDATION
  // Why these rules?
  // - min 8: NIST SP 800-63B and OWASP recommend minimum 8 characters
  // - max 72: bcrypt (our password hashing algorithm) truncates passwords beyond 72 bytes
  password: z.string()
    .min(8, 'Password must be at least 8 characters.')
    .max(72, 'Password must not exceed 72 characters.'),

  // FULL NAME VALIDATION
  // - min 2: Allow short names like "Li", "Xi", "Ed"
  // - max 50: Reasonable UI/database constraint
  fullName: z.string()
    .trim()
    .min(2, 'Name must be at least 2 characters.')
    .max(50, 'Name must not exceed 50 characters.'),

  // Business details are now optional at signup — collected during onboarding wizard
  businessName: z.string().trim().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  referralCode: z.string().optional().or(z.literal('')),
})

export type SignupFormState = {
  success: boolean
  message: string
  referralCredited?: boolean
  referralAmount?: number
  redirectUrl?: string
  errors?: Record<string, string[]>
}

export async function signup(
  prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {

  const supabase = await createClient()

  /* -------------------------------
     1️⃣ Get client IP
  -------------------------------- */
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('x-real-ip') ||
    'unknown'

  /* -------------------------------
     2️⃣ Validate input
  -------------------------------- */
  const validatedFields = SignupSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
    // Optional at signup (collected during onboarding)
    businessName: formData.get('businessName') || '',
    phone: formData.get('phone') || '',
    referralCode: formData.get('referralCode') || '',
  })

  if (!validatedFields.success) {
    console.error('❌ VALIDATION FAILED', validatedFields.error.flatten())
    return {
      success: false,
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const {
    email,
    password,
    fullName,
    businessName = '',
    phone = '',
    referralCode = '',
  } = validatedFields.data

  /* -------------------------------
     3️⃣ Create Auth user (Admin API)
  -------------------------------- */
  // We use the Admin API to create the user with `email_confirm: true`
  // so they can login immediately without clicking a link.
  const adminSupabase = await createAdminClient()

  const { data: adminUser, error: adminError } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm email at Auth level
    user_metadata: {
      full_name: fullName,
      business_name: businessName ?? '',
      phone,
      referral_code: referralCode ? referralCode.trim().toUpperCase() : null,
    }
  })

  if (adminError) {
    console.error('❌ ADMIN CREATE USER ERROR:', adminError.message)
    const errText = typeof adminError.message === 'string' ? adminError.message : String(adminError.message || 'User creation failed')
    return {
      success: false,
      message: errText,
    }
  }

  if (!adminUser.user) {
    return {
      success: false,
      message: 'Signup failed: User could not be created.',
    }
  }

  // Guaranteed Profile Creation / Self-Healing Upsert
  try {
    const { error: upsertErr } = await adminSupabase
      .from('profiles')
      .upsert({
        id: adminUser.user.id,
        email: email,
        full_name: fullName,
        business_name: businessName || 'My Shop',
        phone: phone || null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id', ignoreDuplicates: true })

    if (upsertErr) {
      console.warn('⚠️ Profile upsert warning during signup:', upsertErr.message)
    }
  } catch (e: any) {
    console.warn('⚠️ Explicit profile upsert failed during signup:', e?.message || e)
  }

  // ---------------------------------------------------------
  // 4️⃣ Sign In Immediately (Create Session)
  // ---------------------------------------------------------
  // Now that the user exists and is confirmed, we can sign them in.
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    console.error('❌ AUTO-LOGIN ERROR:', signInError.message)
    return {
      success: true,
      message: 'Account created. Please sign in.',
      redirectUrl: '/signin',
    }
  }

  // Track session if session created
  if (signInData?.session) {
    try {
      const { trackSession } = await import('@/lib/security/session-tracker')
      const userAgent = headersList.get('user-agent') || 'Unknown'
      await trackSession({
        userId: adminUser.user.id,
        sessionToken: signInData.session.access_token,
        ipAddress: ip,
        userAgent,
        isCurrent: true,
      })
    } catch (e) {
      console.warn('Session tracking error during signup:', e)
    }
  }

  /* -------------------------------
     5️⃣ Log IP usage (using adminSupabase)
  -------------------------------- */
  if (ip && ip !== 'unknown') {
    try {
      await adminSupabase
        .from('signup_ip_log')
        .insert({ ip_address: ip })
    } catch (e) {
      console.error('❌ IP LOG INSERT ERROR:', e)
    }
  }



  /* -------------------------------
     8️⃣ PROCESS REFERRAL
  -------------------------------- */
  let referralResult: any = null

  if (referralCode && referralCode.trim()) {
    // Wait briefly for triggers to run (profiles creation etc)
    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      const { data: referralData, error: referralError } = await adminSupabase
        .rpc('process_signup_referral', {
          p_user_id: adminUser.user.id
        })

      if (!referralError) {
        referralResult = referralData
      } else {
        console.warn('Referral processing error:', referralError)
      }

    } catch (error: any) {
      console.error('⚠️ REFERRAL ERROR (non-critical):', error.message)
    }

    // Create Notification
    if (referralResult?.credited && referralResult?.amount > 0) {
      await createNotification({
        userId: adminUser.user.id,
        type: 'wallet_credited',
        title: 'Wallet credited',
        message: `₹${referralResult.amount} added to your wallet`,
        entityType: 'wallet',
        priority: 'low',
      })
    }
  }

  revalidatePath('/')

  // After signup, always redirect to onboarding so the user can set up their store
  const redirectUrl = '/onboarding'

  return {
    success: true,
    message: 'Signup successful!',
    referralCredited: referralResult?.credited || false,
    referralAmount: referralResult?.amount || 0,
    redirectUrl
  }
}
