import crypto from 'crypto'

const API_KEY_PREFIX = 'rp_live_'

/**
 * Generate a new secure API Key and its SHA-256 hash.
 * Returns the raw key (shown once to merchant) and its hash (saved in DB).
 */
export function generateApiKey(): { apiKey: string; apiKeyHash: string; apiKeyPrefix: string } {
  const randomBytes = crypto.randomBytes(24).toString('hex')
  const apiKey = `${API_KEY_PREFIX}${randomBytes}`
  const apiKeyHash = hashApiKey(apiKey)
  const apiKeyPrefix = apiKey.substring(0, 16) // e.g. "rp_live_12345678"

  return {
    apiKey,
    apiKeyHash,
    apiKeyPrefix,
  }
}

/**
 * Hash an incoming API key using SHA-256.
 */
export function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex')
}

/**
 * Validate standard API key format.
 */
export function isValidApiKeyFormat(apiKey: string): boolean {
  return typeof apiKey === 'string' && apiKey.startsWith(API_KEY_PREFIX) && apiKey.length >= 30
}
