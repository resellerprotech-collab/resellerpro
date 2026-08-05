import { IosSpinner } from '@/components/ui/ios-spinner'

// Shared inline spinner — inherits dark/light mode from context
export function LoadingSpinner({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return (
    <IosSpinner
      size={size}
      className={className ?? 'text-blue-600 dark:text-blue-400'}
    />
  )
}