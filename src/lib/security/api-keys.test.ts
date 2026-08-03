import { generateApiKey, hashApiKey, isValidApiKeyFormat } from './api-keys'

// Standalone Unit Test Runner for API Keys Module
export function runApiKeyUnitTests() {
  const results: { test: string; passed: boolean; details?: string }[] = []

  // Test 1: Generation Format
  try {
    const { apiKey, apiKeyHash, apiKeyPrefix } = generateApiKey()
    const isValidFormat = /^rp_live_[a-f0-9]{48}$/.test(apiKey)
    const isPrefixCorrect = apiKeyPrefix === apiKey.substring(0, 16)
    const isHashValidLength = apiKeyHash.length === 64

    if (isValidFormat && isPrefixCorrect && isHashValidLength) {
      results.push({ test: 'API Key Generation Format & SHA-256 Hashing', passed: true })
    } else {
      results.push({ test: 'API Key Generation Format', passed: false, details: 'Format or prefix mismatch' })
    }
  } catch (err: any) {
    results.push({ test: 'API Key Generation Format', passed: false, details: err.message })
  }

  // Test 2: Hash Consistency
  try {
    const sampleKey = 'rp_live_1234567890abcdef1234567890abcdef'
    const h1 = hashApiKey(sampleKey)
    const h2 = hashApiKey(sampleKey)
    if (h1 === h2 && h1.length === 64) {
      results.push({ test: 'SHA-256 Hash Deterministic Consistency', passed: true })
    } else {
      results.push({ test: 'SHA-256 Hash Deterministic Consistency', passed: false, details: 'Hashes did not match' })
    }
  } catch (err: any) {
    results.push({ test: 'SHA-256 Hash Deterministic Consistency', passed: false, details: err.message })
  }

  // Test 3: Validation Helper
  try {
    const validKey = 'rp_live_abcdef1234567890abcdef12345678'
    const invalidPrefix = 'invalid_key_12345678901234567890123'
    const shortKey = 'rp_live_short'

    if (isValidApiKeyFormat(validKey) && !isValidApiKeyFormat(invalidPrefix) && !isValidApiKeyFormat(shortKey)) {
      results.push({ test: 'API Key Format Validator (isValidApiKeyFormat)', passed: true })
    } else {
      results.push({ test: 'API Key Format Validator', passed: false, details: 'Validation check failed' })
    }
  } catch (err: any) {
    results.push({ test: 'API Key Format Validator', passed: false, details: err.message })
  }

  return results
}
