"use client"

import { useState } from 'react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import {
    Mail,
    MessageSquare,
    ShieldCheck,
    Clock,
    HelpCircle,
    MapPin,
    Send,
    CheckCircle2,
    Sparkles
} from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        email: '',
        message: '',
        subject: 'General Inquiry'
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'whatsapp' ? value.replace(/\D/g, '') : value
        }))
    }

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <Navbar />

            <main className="pt-16">
                {/* Hero */}
                <section className="relative py-4 md:py-14 overflow-hidden bg-white">
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <div className="absolute top-[-15%] right-[-8%] w-[480px] h-[480px] bg-gradient-to-br from-blue-500/15 via-blue-400/8 to-transparent rounded-full blur-[100px]" />
                        <div className="absolute bottom-[-10%] left-[-8%] w-[380px] h-[380px] bg-gradient-to-tr from-cyan-500/10 via-blue-400/8 to-transparent rounded-full blur-[80px]" />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
                    </div>
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] mb-4" style={{ fontFamily: "'Switzer', sans-serif" }}>
                            We're Here to <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">Help You Grow</span>
                        </h1>
                        <p className="text-sm  text-black max-w-2xl mx-auto leading-relaxed">
                            Have questions about pricing, features, or onboarding? Our team is ready to assist you in streamlining your reselling business
                        </p>
                    </div>
                </section>

                <section className=" max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-10">
                        {/* Info Column */}
                        <div className="lg:col-span-5 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Get in Touch</h2>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 group hover:border-blue-500/50 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100/80 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all flex-shrink-0">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-900 mb-0.5">Email Support</h4>
                                            <p className="text-blue-600 font-semibold text-xs">support@resellerpro.in</p>
                                            <p className="text-[11px] text-slate-500 mt-0.5">For technical and account help</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 group hover:border-emerald-500/50 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100/80 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all flex-shrink-0">
                                            <MessageSquare className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-900 mb-0.5">WhatsApp Support</h4>
                                            <p className="text-emerald-600 font-semibold text-xs">Chat with us on WhatsApp</p>
                                            <p className="text-[11px] text-slate-500 mt-0.5">Fastest response for sales/general questions</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 p-6 bg-slate-900 text-white rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-blue-400" />
                                    <h4 className="font-bold text-base">Response Time</h4>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    We typically respond within <span className="text-white font-bold">24 hours</span> on business days. Our team is dedicated to your success.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <HelpCircle className="w-5 h-5 text-blue-600" />
                                    Quick Links
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link href="/pricing" className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-blue-400 hover:text-blue-600 transition-all text-xs font-bold text-slate-700">
                                        Pricing Plans
                                    </Link>
                                    <Link href="/features" className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-blue-400 hover:text-blue-600 transition-all text-xs font-bold text-slate-700">
                                        Feature List
                                    </Link>
                                    <Link href="/about" className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-blue-400 hover:text-blue-600 transition-all text-xs font-bold text-slate-700">
                                        Our Story
                                    </Link>
                                    <Link href="/signup" className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-blue-400 hover:text-blue-600 transition-all text-xs font-bold text-slate-700">
                                        Start Free Trial
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="lg:col-span-7">
                            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-lg relative">
                                <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -z-10"></div>
                                {status === 'success' ? (
                                    <div className="text-center py-16 space-y-4">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900">Message Received!</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                                            Thank you for reaching out. A ResellerPro expert will contact you shortly on your provided WhatsApp number.
                                        </p>
                                        <button
                                            onClick={() => setStatus('idle')}
                                            className="text-blue-600 font-bold text-xs hover:underline"
                                        >
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Your Name *</label>
                                                <input
                                                    name="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Rahul Krishnan"
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">WhatsApp Number *</label>
                                                <input
                                                    name="whatsapp"
                                                    required
                                                    type="tel"
                                                    value={formData.whatsapp}
                                                    onChange={handleChange}
                                                    placeholder="+91 XXXXX XXXXX"
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address *</label>
                                            <input
                                                name="email"
                                                required
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="rahul@example.com"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all outline-none"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Inquiry Type</label>
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all outline-none appearance-none"
                                            >
                                                <option>Sales Inquiry</option>
                                                <option>Technical Support</option>
                                                <option>Partnership</option>
                                                <option>General Question</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Your Message</label>
                                            <textarea
                                                name="message"
                                                rows={4}
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="How can we help your business grow?"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all outline-none resize-none"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={status === 'submitting'}
                                            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer"
                                        >
                                            {status === 'submitting' ? 'Sending...' : 'Send Message'}
                                            <Send className="w-4 h-4" />
                                        </button>
                                        {status === 'error' && (
                                            <p className="text-center text-red-500 font-semibold text-xs">Something went wrong. Please try again or chat with us on WhatsApp.</p>
                                        )}
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trust Section */}
                <section className="py-12 bg-slate-50/80 border-t border-slate-200/60">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="flex items-center gap-3 text-center md:text-left flex-col md:flex-row">
                                <div className="w-10 h-10 rounded-xl bg-blue-100/80 flex items-center justify-center text-blue-600 flex-shrink-0">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs text-slate-900">Data Privacy Commitment</h4>
                                    <p className="text-[11px] text-slate-500">Your business data is protected with industry-standard encryption.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-center md:text-left flex-col md:flex-row border-y md:border-y-0 md:border-x border-slate-200/60 py-6 md:py-0 md:px-6">
                                <div className="w-10 h-10 rounded-xl bg-blue-100/80 flex items-center justify-center text-blue-600 flex-shrink-0">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs text-slate-900">Built for Indian Resellers</h4>
                                    <p className="text-[11px] text-slate-500">Specifically tailored for the local social commerce ecosystem.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-center md:text-left flex-col md:flex-row">
                                <div className="w-10 h-10 rounded-xl bg-blue-100/80 flex items-center justify-center text-blue-600 flex-shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs text-slate-900">Based in India</h4>
                                    <p className="text-[11px] text-slate-500">Serving resellers nationwide with localized support.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SEO Content */}
                <section className="py-6 D:py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-xl font-bold mb-4 text-center text-slate-900 uppercase tracking-tight">Need WhatsApp CRM Support?</h2>
                    <div className="space-y-3 text-xs text-slate-500 text-center leading-relaxed">
                        <p>
                            We understand that choosing the right <strong>reseller CRM</strong> is a big decision for your growing business. Whether you need a <strong>WhatsApp CRM support</strong> expert to walk you through our features or you're looking for <strong>reseller CRM contact</strong> details to discuss a large-scale enterprise plan, we are here for you.
                        </p>
                        <p>
                            ResellerPro is committed to providing top-tier <strong>CRM customer support in India</strong>. Our team is available via email and WhatsApp to ensure you never face a hurdle while scaling your business from Instagram to the world.
                        </p>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    )
}
