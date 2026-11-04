import crypto from 'crypto'

/**
 * Derives a consistent 32-byte key from available environment secrets.
 */
function getEncryptionKey(): Buffer {
  const secret =
    process.env.ENCRYPTION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'resellerpro-default-secure-shipping-secret-salt-2026'

  return crypto.createHash('sha256').update(secret).digest()
}

/**
 * Encrypts a string using AES-256-GCM.
 * Output format: iv:authTag:ciphertext (hex encoded)
 */
export function encryptString(plainText: string): string {
  if (!plainText) return ''
  try {
    const key = getEncryptionKey()
    const iv = crypto.randomBytes(12) // 96-bit IV for GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

    let encrypted = cipher.update(plainText, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    const authTag = cipher.getAuthTag().toString('hex')

    return `${iv.toString('hex')}:${authTag}:${encrypted}`
  } catch (error) {
    console.error('Encryption failed:', error)
    throw new Error('Failed to encrypt sensitive data')
  }
}

/**
 * Decrypts an AES-256-GCM encrypted string.
 */
export function decryptString(cipherPayload: string): string {
  if (!cipherPayload) return ''
  try {
    const parts = cipherPayload.split(':')
    if (parts.length !== 3) {
      // Legacy or unencrypted fallback
      return cipherPayload
    }

    const [ivHex, authTagHex, encryptedHex] = parts
    const key = getEncryptionKey()
    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    console.error('Decryption failed:', error)
    return ''
  }
}

