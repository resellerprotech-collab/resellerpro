import { createAdminClient } from '@/lib/supabase/admin'
import { MailService } from '@/lib/mail'
import { addMinutes } from 'date-fns'
import crypto from 'crypto'

export class OtpService {
    /**
     * Resets OTP attempts and unblocks an email.
     */
    static async resetOtpAttempts(email: string) {
        try {
            const supabase = await createAdminClient()
            await supabase
                .from('auth_otp_attempts')
                .delete()
                .eq('email', email)
        } catch (err) {
            console.error('Failed to reset OTP attempts:', err)
        }
    }

    /**
     * Generates a 6-digit OTP, stores it, and sends via email.
     */
    static async sendOtp(email: string) {
        const supabase = await createAdminClient()
        const now = new Date()
        const nowIso = now.toISOString()
        const normalizedEmail = email.trim().toLowerCase()

        // 1. Check for blocks & previous attempt counts
        const { data: attemptData } = await supabase
            .from('auth_otp_attempts')
            .select('*')
            .eq('email', normalizedEmail)
            .single()

        let currentAttemptCount = attemptData?.attempt_count || 0
        const lastAttemptAt = attemptData?.last_attempt_at ? new Date(attemptData.last_attempt_at) : null

        // Check if currently blocked
        if (attemptData?.blocked_until) {
            const blockedUntil = new Date(attemptData.blocked_until)
            if (blockedUntil > now) {
                const diff = Math.max(1, Math.ceil((blockedUntil.getTime() - now.getTime()) / 1000 / 60))
                throw new Error(`Too many attempts. Please try again in ${diff} minute(s).`)
            } else {
                // Block time has expired -> reset count
                currentAttemptCount = 0
            }
        } else if (lastAttemptAt && (now.getTime() - lastAttemptAt.getTime() > 15 * 60 * 1000)) {
            // Last attempt was more than 15 minutes ago -> reset window count
            currentAttemptCount = 0
        }

        // 2. Cooldown Check: 60 seconds resend interval
        const sixtySecondsAgo = new Date(now.getTime() - 60 * 1000).toISOString()

        const { data: recentOtp } = await supabase
            .from('auth_otps')
            .select('created_at')
            .eq('email', normalizedEmail)
            .gte('created_at', sixtySecondsAgo)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (recentOtp) {
            const createdAt = new Date(recentOtp.created_at)
            const elapsedSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000)
            const remainingSeconds = Math.max(1, 60 - elapsedSeconds)
            throw new Error(`Please wait ${remainingSeconds} seconds before requesting a new OTP.`)
        }

        // 3. Track attempt (Max 5 attempts within 15 minutes)
        const newCount = currentAttemptCount + 1
        let blockedUntil: string | null = null

        if (newCount >= 5) {
            blockedUntil = addMinutes(now, 15).toISOString()
        }

        const { error: upsertError } = await supabase
            .from('auth_otp_attempts')
            .upsert({
                email: normalizedEmail,
                attempt_count: blockedUntil ? 0 : newCount,
                last_attempt_at: nowIso,
                blocked_until: blockedUntil
            }, { onConflict: 'email' })

        if (upsertError) {
            console.error('OTP Attempt Upsert Error:', upsertError)
        }

        if (blockedUntil) {
            throw new Error('Too many attempts. Please try again in 15 minutes.')
        }

        // 4. Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const hash = crypto.createHash('sha256').update(otp).digest('hex')
        const expiresAt = addMinutes(now, 5).toISOString()

        // Store in DB
        const { error } = await supabase.from('auth_otps').insert({
            email: normalizedEmail,
            otp_code: hash,
            expires_at: expiresAt,
            verified: false
        })

        if (error) {
            console.error('OTP Store Error:', error)
            if (error.message.includes('schema cache') || error.message.includes('relation "auth_otps" does not exist')) {
                throw new Error('System Error: The OTP table is missing in the database.')
            }
            throw new Error(`Failed to store OTP: ${error.message}`)
        }

        // 5. Send Email
        const result = await MailService.sendOtp(normalizedEmail, otp)
        if (!result.success) {
            console.error('MailService OTP Error:', result.error)
            if (process.env.NODE_ENV !== 'production') {
                console.log(`[DEV MODE] OTP generated for ${normalizedEmail}: ${otp}`)
                return true
            }
            throw new Error(`Failed to send OTP email: ${result.error}`)
        }

        return true
    }

    /**
     * Gets the most recent valid (non-expired, non-verified) OTP for an email.
     */
    static async getRecentOtp(email: string) {
        const supabase = await createAdminClient()
        const normalizedEmail = email.trim().toLowerCase()

        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

        const { data: recentOtp } = await supabase
            .from('auth_otps')
            .select('*')
            .eq('email', normalizedEmail)
            .eq('verified', false)
            .gte('created_at', fiveMinutesAgo)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        return recentOtp || null
    }

    /**
     * Verifies the OTP for a given email.
     */
    static async verifyOtp(email: string, code: string) {
        const supabase = await createAdminClient()
        const now = new Date()
        const normalizedEmail = email.trim().toLowerCase()

        // 1. Check for blocks
        const { data: attemptData } = await supabase
            .from('auth_otp_attempts')
            .select('*')
            .eq('email', normalizedEmail)
            .single()

        if (attemptData?.blocked_until) {
            const blockedUntil = new Date(attemptData.blocked_until)
            if (blockedUntil > now) {
                const diff = Math.max(1, Math.ceil((blockedUntil.getTime() - now.getTime()) / 1000 / 60))
                throw new Error(`Too many attempts. Please try again in ${diff} minute(s).`)
            }
        }

        const hash = crypto.createHash('sha256').update(code.trim()).digest('hex')

        // Find valid OTP
        const { data, error } = await supabase
            .from('auth_otps')
            .select('*')
            .eq('email', normalizedEmail)
            .eq('otp_code', hash)
            .eq('verified', false)
            .gt('expires_at', now.toISOString())
            .single()

        if (error || !data) {
            // Track failure
            const newFailCount = (attemptData?.failed_verifications || 0) + 1
            let blockedUntil: string | null = null

            if (newFailCount >= 5) {
                blockedUntil = addMinutes(now, 15).toISOString()
            }

            await supabase
                .from('auth_otp_attempts')
                .upsert({
                    email: normalizedEmail,
                    failed_verifications: blockedUntil ? 0 : newFailCount,
                    blocked_until: blockedUntil
                }, { onConflict: 'email' })

            if (blockedUntil) {
                throw new Error('Too many failed verification attempts. Please try again in 15 minutes.')
            }

            return false
        }

        // Mark as verified
        await supabase
            .from('auth_otps')
            .update({ verified: true })
            .eq('id', data.id)

        // Reset attempts on success
        await supabase
            .from('auth_otp_attempts')
            .upsert({
                email: normalizedEmail,
                attempt_count: 0,
                failed_verifications: 0,
                blocked_until: null
            }, { onConflict: 'email' })

        return true
    }
}
