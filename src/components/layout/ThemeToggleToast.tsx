'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

/**
 * Shows a brief toast message when the user toggles dark/light mode.
 * Only used in the dashboard — landing page has no theme toggle.
 */
export function ThemeToggleToast() {
  const { theme } = useTheme()
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    // Skip on first mount — only show on actual toggle
    const dark = theme === 'dark'
    setIsDark(dark)
    setMessage(dark ? 'Dark mode on' : 'Light mode on')
    setVisible(true)

    const timer = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(timer)
  }, [theme]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) return null

  return (
    <div
      aria-live="polite"
      className={[
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]',
        'flex items-center gap-2 px-4 py-2.5 rounded-full shadow-xl',
        'text-sm font-semibold select-none pointer-events-none',
        'transition-all duration-300 ease-out',
        isDark
          ? 'bg-slate-800 text-white border border-slate-700/60'
          : 'bg-white text-slate-800 border border-slate-200',
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-3',
      ].join(' ')}
    >
      {isDark
        ? <Moon className="w-3.5 h-3.5 text-blue-400" />
        : <Sun className="w-3.5 h-3.5 text-amber-500" />
      }
      {message}
    </div>
  )
}
