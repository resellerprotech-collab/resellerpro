
'use client'

import { useEffect, useRef } from 'react'
import { usePopupController } from '@/hooks/usePopupController'
import EnquiryForm from './EnquiryForm'
import { X } from 'lucide-react'

export default function EnquiryPopup() {
    const { isVisible, closePopup } = usePopupController()
    const popupRef = useRef<HTMLDivElement>(null)

    // Handle ESC key to close & sync visibility state
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closePopup()
            }
        }

        if (isVisible) {
            document.addEventListener('keydown', handleEscKey)
            document.body.setAttribute('data-popup-open', 'true')
            window.dispatchEvent(new CustomEvent('enquiry-popup-visibility', { detail: { isVisible: true } }))
        } else {
            document.body.removeAttribute('data-popup-open')
            window.dispatchEvent(new CustomEvent('enquiry-popup-visibility', { detail: { isVisible: false } }))
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey)
            document.body.removeAttribute('data-popup-open')
            window.dispatchEvent(new CustomEvent('enquiry-popup-visibility', { detail: { isVisible: false } }))
        }
    }, [isVisible, closePopup])

    if (!isVisible) return null

    return (
        <div className="fixed bottom-0 right-0 sm:bottom-5 sm:right-5 z-[1000] w-full sm:w-auto p-3 sm:p-0 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div
                ref={popupRef}
                className="w-full sm:w-[350px] bg-white rounded-[20px] sm:rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 p-4 sm:p-4.5 relative overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-2.5 mb-3.5">
                    <div className="flex items-start gap-2.5">
                        {/* Chat Icon with Light Blue Badge */}
                        <div className="w-11 h-11 rounded-full bg-[#EBF2FE] flex items-center justify-center shrink-0">
                            <div className="w-7 h-7 rounded-full bg-[#1D61F2] flex items-center justify-center text-white relative shadow-sm">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                                    <circle cx="8" cy="10" r="1.2" fill="white" />
                                    <circle cx="12" cy="10" r="1.2" fill="white" />
                                    <circle cx="16" cy="10" r="1.2" fill="white" />
                                </svg>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-[#0F172A] leading-tight">
                                Have questions?
                            </h3>
                            <p className="text-[11px] sm:text-[11.5px] text-slate-500 font-normal leading-snug mt-0.5">
                                We're here to help! Fill out the form and we'll get back to you on WhatsApp.
                            </p>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={closePopup}
                        className="w-7 h-7 rounded-full border border-slate-200/80 bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                        aria-label="Close popup"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Form */}
                <EnquiryForm />
            </div>
        </div>
    )
}

