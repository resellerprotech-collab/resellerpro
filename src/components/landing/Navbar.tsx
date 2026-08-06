'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { usePathname } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  useEffect(() => {
    const handlePopupVisibility = (e: CustomEvent<{ isVisible: boolean }>) => {
      setIsPopupOpen(!!e.detail?.isVisible)
    }

    if (typeof window !== 'undefined') {
      setIsPopupOpen(document.body.getAttribute('data-popup-open') === 'true')
    }

    window.addEventListener('enquiry-popup-visibility' as any, handlePopupVisibility)
    return () => {
      window.removeEventListener('enquiry-popup-visibility' as any, handlePopupVisibility)
    }
  }, [])

  const isAuthOrDashboardPage =
    pathname === '/signup' ||
    pathname === '/signin' ||
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/onboarding') ||
    pathname?.startsWith('/store')

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="flex items-center gap-1 cursor-pointer group"
            >
              <div className="relative -m-2">
                <NextImage
                  src="/logo.svg"
                  alt="ResellerPro Logo"
                  width={64}
                  height={64}
                  className="h-14 w-12 object-contain mr-2"
                />
              </div>
              <span className="text-[18px] font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                ResellerPro
              </span>
            </Link>

            {/* Center Links */}
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'Pricing', 'About', 'Contact'].map((item) => {
                const href = `/${item.toLowerCase()}`
                const isActive = pathname === href
                return (
                  <Link
                    key={item}
                    href={href}
                    className={`text-sm font-semibold transition-colors ${
                      isActive ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
                    }`}
                  >
                    {item}
                  </Link>
                )
              })}
            </div>

            {/* Right Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/signin">
                <button className="bg-blue-600 sm:bg-transparent text-sm px-5 py-2 sm:py-2.5 font-semibold text-white sm:text-slate-700 sm:hover:text-blue-600 transition-colors rounded-full sm:rounded-none cursor-pointer">
                  Sign in
                </button>
              </Link>
              <Link href="/signup">
                <button className="hidden sm:block px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transform hover:-translate-y-0.5 cursor-pointer">
                  Start now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Fixed Bottom Sticky Bar - "Get Started Now ->" */}
      {!isAuthOrDashboardPage && !isPopupOpen && (
        <div className="mobile-bottom-cta fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <Link href="/signup" className="w-full block">
            <button className="w-full bg-[#1D61F2] hover:bg-[#1652d2] active:scale-[0.99] text-white font-bold rounded-xl py-3 px-4 flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer">
              <span className="text-base font-bold tracking-wide">Get Started Now</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </Link>
        </div>
      )}
    </>
  )
}