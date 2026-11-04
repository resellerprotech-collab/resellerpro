'use client'

import { useEffect } from 'react'
import clarity from '@microsoft/clarity'

const CLARITY_PROJECT_ID = 'yrh5xy4itw'

/** Module-level flag to ensure Clarity is only initialised once per session. */
let clarityInitialised = false

/**
 * ClarityAnalytics — a reusable client component that initialises
 * Microsoft Clarity globally across all routes.
 *
 * Clarity automatically masks sensitive input fields (passwords, credit cards, etc.)
 * by default. For any additional sensitive text elements, add the CSS class
 * `clarity-mask` to the element to redact its content from recordings.
 */
export default function ClarityAnalytics() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return

    // Initialise Clarity once per session
    if (!clarityInitialised) {
      clarity.init(CLARITY_PROJECT_ID)
      clarityInitialised = true
    }
  }, [])

  return null
}

