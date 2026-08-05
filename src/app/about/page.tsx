import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import {
    Users,
    Rocket,
    Target,
    Heart,
    Quote,
    TrendingUp,
    Smartphone,
    ShieldCheck,
    Zap,
    Store,
    Globe,
    XCircle,
    AlertCircle
} from 'lucide-react'

export const metadata = {
    title: 'About Us | ResellerPro - Empowering the Reseller Revolution',
    description: 'Our story, mission, and vision. Why we built ResellerPro to help WhatsApp and Instagram resellers scale their businesses professionally.',
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900">
            <Navbar />

            <main className="pt-16">

                {/* Hero Section — matches HeroSection light style */}
                <section className="relative py-14 overflow-hidden bg-white">
                    {/* Background glow blobs */}
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <div className="absolute top-[-15%] right-[-8%] w-[480px] h-[480px] bg-gradient-to-br from-blue-500/15 via-blue-400/8 to-transparent rounded-full blur-[100px]" />
                        <div className="absolute bottom-[-10%] left-[-8%] w-[380px] h-[380px] bg-gradient-to-tr from-cyan-500/10 via-blue-400/8 to-transparent rounded-full blur-[80px]" />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
                    </div>

                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                      
                        <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] mb-4" style={{ fontFamily: "'Switzer', sans-serif" }}>
                            Empowering the{' '}
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                Reseller Revolution
                            </span>
                        </h1>
                        <p className="text-sm  text-black max-w-2xl mx-auto leading-relaxed">
                            We're on a mission to give 10,000+ small resellers the technology they need to operate like global brands.
                        </p>
                    </div>
                </section>

                {/* The Problem Section */}
                <section className="py-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        <div className="space-y-5">
                        
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">The Reseller Struggle is Real</h2>
                            <div className="space-y-3 text-sm text-slate-500 leading-relaxed">
                                <p>
                                    You know the feeling. Your WhatsApp is exploding with inquiries, but orders are getting lost in the chat history. You're manually copying addresses into your notes, and you have no idea how much net profit you actually made this month.
                                </p>
                                <p>
                                    The constant shuffle between Instagram DMs, WhatsApp chats, and paper spreadsheets isn't just tiring — it's preventing you from scaling.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                {[
                                    'Orders lost in DMs',
                                    'Manual bookkeeping chaos',
                                    'No customer history',
                                    'Confusion between platforms'
                                ].map((pain, i) => (
                                    <div
                                        key={i}
                                        className="group relative flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-rose-50/40 via-slate-50/60 to-white border border-slate-200/80 hover:border-red-200 hover:shadow-md hover:shadow-red-500/5 transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-red-100/80 text-red-600 group-hover:bg-red-500 group-hover:text-white transition-all duration-300 flex-shrink-0 shadow-xs">
                                            <XCircle className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs md:text-sm font-semibold text-slate-800 group-hover:text-red-700 transition-colors">
                                            {pain}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-3 bg-blue-500/10 rounded-3xl blur-2xl -z-10" />
                            <img
                                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"
                                alt="Digital struggle"
                                className="rounded-2xl shadow-xl border border-slate-200/60 grayscale hover:grayscale-0 transition-all duration-700 w-full"
                            />
                        </div>
                    </div>
                </section>

                {/* The Origin Story */}
                <section className="py-12 bg-slate-50/80 border-y border-slate-200/60">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-2xl mx-auto text-center mb-10">
                           
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Why We Built <span className="text-blue-700">ResellerPro</span></h2>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                ResellerPro wasn't born in a sterile corporate boardroom. It was born out of watching real entrepreneurs struggle to handle success.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-5">
                            {[
                                { icon: Smartphone, label: 'Watching the Chaos', color: 'bg-orange-100 text-orange-600', text: 'We saw small sellers spending 12 hours a day on their phones, not talking to customers, but doing data entry. We knew there was a better way.' },
                                { icon: Users, label: 'Talking to Sellers', color: 'bg-blue-100 text-blue-600', text: 'We interviewed hundreds of WhatsApp and Instagram resellers. We didn\'t build what we thought they needed — we built what they told us they needed.' },
                                { icon: Rocket, label: 'Building the Solution', color: 'bg-green-100 text-green-600', text: 'We focused on simplicity. A tool that anyone can use in 2 minutes, without needing a degree in computer science.' },
                            ].map((item, i) => (
                                <div key={i} className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 mb-2">{item.label}</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-5">
                        <div className="p-8 bg-slate-900 text-white rounded-2xl overflow-hidden relative">
                            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
                            <Target className="w-9 h-9 text-blue-400 mb-5 relative z-10" />
                            <h3 className="text-xl font-bold mb-3 relative z-10">Our Mission</h3>
                            <p className="text-sm text-slate-400 leading-relaxed relative z-10">
                                To simplify the business journey for the next generation of digital entrepreneurs. We provide the CRM power of a multi-million dollar brand without the complexity or the high cost.
                            </p>
                        </div>
                        <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl overflow-hidden relative">
                            <div className="absolute -top-8 -left-8 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                            <TrendingUp className="w-9 h-9 text-white/80 mb-5 relative z-10" />
                            <h3 className="text-xl font-bold mb-3 relative z-10">Our Vision</h3>
                            <p className="text-sm text-white/80 leading-relaxed relative z-10">
                                To become the operating system for social commerce. We envision a world where every small reseller can compete globally using ResellerPro as their core business engine.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Differentiators */}
                <section className="py-12 bg-slate-50/80 border-y border-slate-200/60">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-xl mx-auto text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">What Makes Us Different</h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { icon: Store, label: 'Custom Store (Website)', text: 'Create & share your own custom online store website for direct customer orders.' },
                                { icon: Heart, label: 'Indian First', text: 'Built specifically for the Indian reseller ecosystem.' },
                                { icon: ShieldCheck, label: 'Privacy Deep', text: 'We never share your business data. Period.' },
                                { icon: Zap, label: 'Speed Obsessed', text: 'Process an order in < 30 seconds.' }
                            ].map((item, i) => (
                                <div key={i} className="p-5 bg-white rounded-2xl border border-slate-200/80 text-center group hover:border-blue-400/50 hover:shadow-md transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-600 group-hover:text-white transition-all text-slate-600">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 mb-1">{item.label}</h4>
                                    <p className="text-xs text-slate-500">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Founder Note */}
                <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-900 rounded-2xl p-8 md:p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="w-32 h-32 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border-2 border-slate-700">
                                <img src="https://i.pravatar.cc/300?img=68" alt="Founder" className="w-full h-full object-cover" />
                            </div>
                            <div className="space-y-3">
                                <Quote className="w-8 h-8 text-blue-400 opacity-60" />
                                <h3 className="text-lg md:text-xl font-bold italic leading-snug">
                                    "We believe that small sellers deserve big tools. Your passion moves products; our technology moves the paperwork."
                                </h3>
                                <div>
                                    <p className="text-sm font-bold">The ResellerPro Team</p>
                                    <p className="text-xs text-slate-400">Founded with ❤️ in India</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    )
}
