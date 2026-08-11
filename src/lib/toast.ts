import { toast as sonnerToast } from 'sonner'

// --- Duration constants ---
const DURATION = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 4000,
  loading: Infinity,
} as const

// --- Deduplication helper ---
function toastId(message: string): string {
  return message.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// --- Toast options type ---
type ToastOptions = {
  description?: string
  id?: string | number
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// --- Helper methods ---

function success(message: string, options?: ToastOptions) {
  return sonnerToast.success(message, {
    duration: DURATION.success,
    id: options?.id ?? toastId(message),
    description: options?.description,
    action: options?.action,
  })
}

function error(message: string, options?: ToastOptions) {
  return sonnerToast.error(message, {
    duration: DURATION.error,
    id: options?.id ?? toastId(message),
    description: options?.description,
    action: options?.action,
  })
}

function warning(message: string, options?: ToastOptions) {
  return sonnerToast.warning(message, {
    duration: DURATION.warning,
    id: options?.id ?? toastId(message),
    description: options?.description,
    action: options?.action,
  })
}

function info(message: string, options?: ToastOptions) {
  return sonnerToast.info(message, {
    duration: DURATION.info,
    id: options?.id ?? toastId(message),
    description: options?.description,
    action: options?.action,
  })
}

function loading(message: string, options?: { id?: string | number; description?: string }) {
  return sonnerToast.loading(message, {
    duration: DURATION.loading,
    id: options?.id,
    description: options?.description,
  })
}

function promise<T>(
  promiseFn: Promise<T>,
  messages: {
    loading: string
    success: string | ((data: T) => string)
    error: string | ((err: unknown) => string)
    description?: string
  },
  options?: { id?: string | number }
) {
  return sonnerToast.promise(promiseFn, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
    id: options?.id,
  })
}

function dismiss(id?: string | number) {
  return sonnerToast.dismiss(id)
}

// --- Exported toast object ---
export const toast = {
  success,
  error,
  warning,
  info,
  loading,
  promise,
  dismiss,
}
