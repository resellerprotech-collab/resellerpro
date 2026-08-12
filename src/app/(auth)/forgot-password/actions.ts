'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { MailService } from '@/lib/mail'
import { z } from 'zod'

const ForgotPasswordSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
})

export type ForgotPasswordFormState = {
    success: boolean
    message: string
    errors?: Record<string, string[] | undefined>
}

export async function sendResetEmail(email: string) {
    const supabase = await createClient()

    // Validate input
    const validatedFields = ForgotPasswordSchema.safeParse({ email })

    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Invalid email address.',
        }
    }

    const cleanEmail = email.trim().toLowerCase()

    try {
        // Check if email is registered in profiles
        const adminSupabase = await createAdminClient()
        const { data: profile } = await adminSupabase
            .from('profiles')
            .select('id')
            .ilike('email', cleanEmail)
            .maybeSingle()

        if (!profile) {
            return {
                success: false,
                message: 'Email not registered.',
            }
        }

        const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '')
        const redirectUrl = `${appUrl}/reset-password`

        // 1️⃣ Generate recovery link via Supabase Admin API
        const { data, error: linkError } = await adminSupabase.auth.admin.generateLink({
            type: 'recovery',
            email: cleanEmail,
            options: {
                redirectTo: redirectUrl
            }
        })

        if (!linkError && data?.properties?.action_link) {
            const resetLink = data.properties.action_link

            // 2️⃣ Send password reset email directly via Nodemailer (Gmail SMTP)
            const mailResult = await MailService.sendPasswordReset(cleanEmail, resetLink)

            if (mailResult.success) {
                return {
                    success: true,
                    message: 'Password reset link has been sent to your email. Please check your inbox.',
                }
            } else {
                console.error('MailService password reset send error:', mailResult.error)
            }
        } else {
            console.warn('Generate recovery link error:', linkError?.message)
        }

        // Fallback: Trigger default Supabase auth reset email
        const { error: fallbackError } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
            redirectTo: redirectUrl,
        })

        if (fallbackError) {
            console.error('Password reset fallback error:', fallbackError)
            return {
                success: false,
                message: 'Failed to send reset email. Please check your SMTP settings or try again.',
            }
        }

        return {
            success: true,
            message: 'Password reset link has been sent to your email. Please check your inbox.',
        }
    } catch (error: any) {
        console.error('Unexpected reset password error:', error)
        return {
            success: false,
            message: error?.message || 'An unexpected error occurred. Please try again later.',
        }
    }
}
