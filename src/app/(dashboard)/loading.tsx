import { IosSpinner } from '@/components/ui/ios-spinner'

/**
 * Dashboard-level loading — adapts to user's dark/light mode preference.
 * bg-background CSS variable switches between white (light) and dark (dark mode).
 */
export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <IosSpinner size="xl" className="text-blue-600 dark:text-blue-400" />
    </div>
  )
}
