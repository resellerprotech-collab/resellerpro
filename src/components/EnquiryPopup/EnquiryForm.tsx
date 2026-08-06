
'use client'

import { useState } from 'react'
import { User, Mail, SquarePen, Lock, ArrowRight, CheckCircle2 } from 'lucide-react'

interface FormData {
    name: string
    whatsapp: string
    email: string
    message: string
}

export default function EnquiryForm() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        whatsapp: '',
        email: '',
        message: ''
    })
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('submitting')

        try {
            const res = await fetch('/api/enquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!res.ok) throw new Error('Failed to submit')

            setStatus('success')
        } catch (error) {
            console.error(error)
            setStatus('error')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name } = e.target
        let { value } = e.target

        if (name === 'whatsapp') {
            // Allow digits and optional plus sign
            value = value.replace(/[^\d+]/g, '')
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    if (status === 'success') {
        return (
            <div className="py-6 px-3 text-center flex flex-col items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
                <h3 className="text-base font-bold text-slate-900">Thank you!</h3>
                <p className="text-xs text-slate-500 mt-0.5">We'll contact you shortly on WhatsApp.</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Name Input */}
            <div className="border border-slate-200 rounded-xl p-2.5 flex items-center gap-2.5 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <div className="w-8 h-8 rounded-lg bg-[#EBF2FE] flex items-center justify-center text-[#1D61F2] shrink-0">
                    <User className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <label className="block text-[11px] font-semibold text-slate-900 leading-none mb-0.5">
                        Name <span className="text-slate-900">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="w-full text-xs font-normal text-slate-800 placeholder:text-slate-400 bg-transparent outline-none border-none p-0 leading-tight focus:ring-0"
                    />
                </div>
            </div>

            {/* WhatsApp Number Input */}
            <div className="border border-slate-200 rounded-xl p-2.5 flex items-center gap-2.5 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <div className="w-8 h-8 rounded-lg bg-[#E6F8EE] flex items-center justify-center text-[#16A34A] shrink-0">
                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.197 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 2.159.684 4.159 1.854 5.803L2.05 22l4.316-1.74A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.802 0-3.472-.477-4.922-1.312l-.352-.204-2.56.1.677-2.497-.227-.36A7.955 7.955 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <label className="block text-[11px] font-semibold text-slate-900 leading-none mb-0.5">
                        WhatsApp Number <span className="text-slate-900">*</span>
                    </label>
                    <input
                        type="tel"
                        name="whatsapp"
                        required
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full text-xs font-normal text-slate-800 placeholder:text-slate-400 bg-transparent outline-none border-none p-0 leading-tight focus:ring-0"
                    />
                </div>
            </div>

            {/* Email Input */}
            <div className="border border-slate-200 rounded-xl p-2.5 flex items-center gap-2.5 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <div className="w-8 h-8 rounded-lg bg-[#EBF2FE] flex items-center justify-center text-[#1D61F2] shrink-0">
                    <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <label className="block text-[11px] font-semibold text-slate-900 leading-none mb-0.5">
                        Email <span className="text-slate-900">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@exXXXX.com"
                        className="w-full text-xs font-normal text-slate-800 placeholder:text-slate-400 bg-transparent outline-none border-none p-0 leading-tight focus:ring-0"
                    />
                </div>
            </div>

            {/* Message Textarea */}
            <div className="border border-slate-200 rounded-xl p-2.5 flex items-start gap-2.5 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <div className="w-8 h-8 rounded-lg bg-[#EBF2FE] flex items-center justify-center text-[#1D61F2] shrink-0 mt-0.5">
                    <SquarePen className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <label className="block text-[11px] font-semibold text-slate-900 leading-none mb-0.5">
                        Message
                    </label>
                    <textarea
                        name="message"
                        rows={1}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        className="w-full text-xs font-normal text-slate-800 placeholder:text-slate-400 bg-transparent outline-none border-none p-0 leading-tight resize-y focus:ring-0 min-h-[34px]"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-[#1D61F2] hover:bg-[#1652d2] active:scale-[0.99] text-white font-bold rounded-xl py-2.5 px-3.5 flex items-center justify-between shadow-sm shadow-blue-500/15 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer mt-3"
            >
                {status === 'submitting' ? (
                    <div className="w-full flex items-center justify-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="text-xs">Sending...</span>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-1.5">
                            <svg className="w-4.5 h-4.5 fill-current text-white" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.197 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 2.159.684 4.159 1.854 5.803L2.05 22l4.316-1.74A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.802 0-3.472-.477-4.922-1.312l-.352-.204-2.56.1.677-2.497-.227-.36A7.955 7.955 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
                            </svg>
                        </div>
                        <span className="text-[13.5px] font-bold text-white tracking-wide">
                            Start Chat on WhatsApp
                        </span>
                        <ArrowRight className="w-4.5 h-4.5 text-white" />
                    </>
                )}
            </button>

            {status === 'error' && (
                <p className="text-[11px] text-red-500 text-center font-medium mt-1">
                    Something went wrong. Please try again.
                </p>
            )}

            {/* Footer Trust Badge */}
            <div className="flex items-center justify-center gap-1.5 pt-0.5 text-slate-400">
                <Lock className="w-3 h-3 text-slate-400" />
                <span className="text-[11px] font-medium text-slate-400">
                    Your information is safe with us.
                </span>
            </div>
        </form>
    )
}

