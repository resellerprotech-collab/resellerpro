import { IosSpinner } from '@/components/ui/ios-spinner'

/**
 * Root-level loading — covers landing page, auth, and public routes.
 * Always light mode (white background) — landing page has no dark mode.
 */
export default function Loading() {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <IosSpinner size="xl" className="text-blue-600" />
    </div>
  )
}