'use client'

import { useState } from 'react'
import { ShieldAlert, ArrowRight, X } from 'lucide-react'
import { useVerification } from '@/components/auth/VerificationProvider'

interface VerificationBannerProps {
    email: string
    isVerified: boolean
}

export function VerificationBanner({ email, isVerified }: VerificationBannerProps) {
    const { openVerificationModal } = useVerification()
    const [isVisible, setIsVisible] = useState(true)

    if (isVerified || !isVisible) return null

    return (
        <div className="relative w-full bg-slate-900 dark:bg-slate-950 border-b border-slate-800 px-4 py-2.5">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">

                {/* Left — icon + text */}
                <div className="flex items-start sm:items-center gap-2.5 pr-8 sm:pr-0">
                    <ShieldAlert className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                    <p className="text-xs sm:text-sm text-slate-300 leading-snug">
                        <span className="font-semibold text-white">Email not verified.</span>
                        {' '}
                        <span className="hidden sm:inline">Verify <span className="text-slate-400">{email}</span> to unlock all features.</span>
                        <span className="sm:hidden">Verify your email to unlock all features.</span>
                    </p>
                </div>

                {/* Right — action */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                        onClick={openVerificationModal}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors duration-150 whitespace-nowrap"
                    >
                        Verify now
                        <ArrowRight className="h-3.5 w-3.5" />
                    </button>

                    {/* Divider */}
                    <span className="h-4 w-px bg-slate-700 hidden sm:block" />

                    <button
                        onClick={() => setIsVisible(false)}
                        aria-label="Dismiss"
                        className="text-slate-500 hover:text-slate-300 transition-colors duration-150 p-0.5 rounded"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {/* Mobile dismiss — top-right corner */}
            <button
                onClick={() => setIsVisible(false)}
                aria-label="Dismiss"
                className="absolute top-2.5 right-3 sm:hidden text-slate-500 hover:text-slate-300 transition-colors duration-150"
            >
                <X className="h-3.5 w-3.5" />
            </button>
        </div>
    )
}
