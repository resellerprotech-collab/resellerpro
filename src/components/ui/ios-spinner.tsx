import React from 'react'
import { cn } from '@/lib/utils/cn'

export function IosSpinner({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  }

  return (
    <div className={cn('relative inline-block', sizeMap[size], className)} aria-label="Loading">
      {[...Array(12)].map((_, i) => (
        <span
          key={i}
          className="absolute left-[44.5%] top-[37%] w-[11%] h-[26%] rounded-full bg-current opacity-20 animate-ios-spinner"
          style={{
            transform: `rotate(${i * 30}deg) translate(0, -130%)`,
            animationDelay: `${(i * 0.0833).toFixed(4)}s`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * Full-screen fixed overlay spinner.
 * Pass `forcedLight` on landing page (always white bg).
 * In dashboard it auto-adapts to dark/light mode.
 */
export function IosPageOverlayLoader({ forcedLight = false }: { forcedLight?: boolean }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <IosSpinner
        size="xl"
        className={forcedLight ? 'text-blue-600' : 'text-blue-600 dark:text-blue-400'}
      />
    </div>
  )
}
