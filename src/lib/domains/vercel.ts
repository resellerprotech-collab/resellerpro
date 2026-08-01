/**
 * Vercel Domains Integration Service
 * Automates custom domain registration, verification, and SSL certificate issuance
 * for ₹999 Pro Subscribers via Vercel REST API.
 */

const VERCEL_API_URL = 'https://api.vercel.com'

function getVercelConfig() {
  const projectId = process.env.VERCEL_PROJECT_ID
  const authToken = process.env.VERCEL_AUTH_TOKEN
  const teamId = process.env.VERCEL_TEAM_ID

  return { projectId, authToken, teamId }
}

/**
 * Clean domain string by stripping protocols and path suffixes
 */
export function cleanDomain(domainInput: string): string {
  return domainInput
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/^www\./, '')
}

export interface VercelDomainResponse {
  name: string
  apexName: string
  projectId: string
  verified: boolean
  verification?: Array<{
    type: string
    domain: string
    value: string
    reason: string
  }>
  error?: {
    code: string
    message: string
  }
}

/**
 * Adds custom domain to Vercel Project via REST API
 */
export async function addDomainToVercel(domain: string): Promise<{ success: boolean; data?: VercelDomainResponse; error?: string }> {
  const { projectId, authToken, teamId } = getVercelConfig()

  const normalizedDomain = cleanDomain(domain)
  if (!normalizedDomain) {
    return { success: false, error: 'Invalid domain name' }
  }

  // Graceful fallback for local development without Vercel keys
  if (!projectId || !authToken) {
    console.warn('[Vercel Domains API] Missing VERCEL_PROJECT_ID or VERCEL_AUTH_TOKEN. Running in simulation mode.')
    return {
      success: true,
      data: {
        name: normalizedDomain,
        apexName: normalizedDomain,
        projectId: projectId || 'simulated-project',
        verified: true,
      },
    }
  }

  try {
    const url = `${VERCEL_API_URL}/v10/projects/${projectId}/domains${teamId ? `?teamId=${teamId}` : ''}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: normalizedDomain }),
    })

    const data = await response.json()

    if (!response.ok) {
      if (data.error?.code === 'domain_already_in_use') {
        return { success: false, error: 'This domain is already registered with another site or account.' }
      }
      return { success: false, error: data.error?.message || 'Failed to add domain to Vercel' }
    }

    return { success: true, data }
  } catch (err: any) {
    console.error('[Vercel API Error]:', err)
    return { success: false, error: err.message || 'Network error connecting to domain manager' }
  }
}

/**
 * Verifies domain DNS propagation & SSL status on Vercel
 */
export async function verifyDomainOnVercel(domain: string): Promise<{ verified: boolean; error?: string }> {
  const { projectId, authToken, teamId } = getVercelConfig()

  const normalizedDomain = cleanDomain(domain)
  if (!projectId || !authToken) {
    return { verified: true } // Simulation mode
  }

  try {
    const url = `${VERCEL_API_URL}/v9/projects/${projectId}/domains/${normalizedDomain}/verify${teamId ? `?teamId=${teamId}` : ''}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    const data = await response.json()
    return { verified: Boolean(data.verified), error: data.error?.message }
  } catch (err: any) {
    return { verified: false, error: err.message }
  }
}

/**
 * Removes custom domain from Vercel Project
 */
export async function removeDomainFromVercel(domain: string): Promise<{ success: boolean; error?: string }> {
  const { projectId, authToken, teamId } = getVercelConfig()

  const normalizedDomain = cleanDomain(domain)
  if (!projectId || !authToken) {
    return { success: true }
  }

  try {
    const url = `${VERCEL_API_URL}/v9/projects/${projectId}/domains/${normalizedDomain}${teamId ? `?teamId=${teamId}` : ''}`
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    if (!response.ok) {
      const data = await response.json()
      return { success: false, error: data.error?.message || 'Failed to remove domain' }
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
