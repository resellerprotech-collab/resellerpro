/**
 * Legacy compatibility shim.
 * All new code should import directly from '@/lib/toast'.
 * This file is kept to avoid breaking any un-migrated legacy references.
 */

"use client"

import { toast as unifiedToast } from "@/lib/toast"

interface LegacyToastOptions {
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | string
  action?: any
  duration?: number
  [key: string]: any
}

function legacyToastFn(options: LegacyToastOptions | string) {
  if (typeof options === 'string') {
    return unifiedToast.info(options)
  }
  const { title, description, variant } = options
  const msg = title ? (description ? `${title}: ${description}` : title) : (description || '')
  if (variant === 'destructive') {
    return unifiedToast.error(msg)
  }
  return unifiedToast.success(msg)
}

Object.assign(legacyToastFn, unifiedToast)

export function useToast() {
  return {
    toast: legacyToastFn as typeof legacyToastFn & typeof unifiedToast,
    toasts: []
  }
}

export { unifiedToast as toast }

