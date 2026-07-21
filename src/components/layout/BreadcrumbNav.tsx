'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export default function BreadcrumbNav() {
  const pathname = usePathname()
  
  const segments = pathname
    ?.split('/')
    .filter(Boolean)
    .map((segment, index, array) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      href: '/' + array.slice(0, index + 1).join('/'),
      isLast: index === array.length - 1,
    }))

  if (!segments || segments.length === 0) return null

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {segments.map((segment, index) => (
        <div key={segment.href} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4" />
          {segment.isLast ? (
            <span className="font-medium text-foreground">{segment.name}</span>
          ) : (
            <Link
              href={segment.href}
              className="hover:text-foreground transition-colors"
            >
              {segment.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}