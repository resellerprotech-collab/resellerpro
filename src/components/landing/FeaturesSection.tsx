"use client"

import React from 'react'
import { motion } from 'framer-motion'
import {
  Zap,
  Store,
  Database,
  ShieldCheck,
  TrendingUp,
  ClipboardPaste,
  Check,
  Search,
  Lock,
  User,
  RotateCw,
  Shield,
  ArrowRight,
  X,
  CheckCircle2,
  ChevronDown,
  MoreHorizontal,
  LayoutGrid,
  ShoppingBag,
  Circle,
  StoreIcon,
  Package2,
  DatabaseIcon,
  ShieldAlert,
  ChartNoAxesCombined,
  Copy
} from 'lucide-react'

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-14 lg:py-20 overflow-hidden bg-white text-slate-900">

      {/* Background Elements matching HeroSection */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-transparent rounded-full blur-[120px]"
          animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-tr from-slate-100 via-blue-50 to-transparent rounded-full blur-[100px]"
          animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <div className="absolute top-[30%] left-[20%] w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[90px]" />

        {/* Hero Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.2]" style={{ fontFamily: "'Switzer', sans-serif" }}>
            Everything you need to grow <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent inline-block pb-[0.2em] pt-1">
              your business
            </span>
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Powerful tools designed specifically for resellers. Manage orders, track customers, and scale your business with confidence.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="space-y-4 sm:space-y-5">

          {/* Top Row: 3 Equal-Width Bento Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">

            {/* Card 1: Custom Store Creation */}
            <div className="bg-white border border-slate-200/80 hover:border-blue-500/40 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className='flex gap-2 text-blue-600'>
                  <Package2 />
                  <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                    Custom Store Creation
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Create your own branded online store in minutes. Fully customizable templates, your domain, your brand.
                </p>

                {/* Features Check List */}
                <ul className="space-y-2 mb-3">
                  {[
                    'Custom domains & branding',
                    'Mobile responsive design',
                    'SEO optimized pages',
                    'Select your favorite theme & color palette',
                    'Customize fonts, buttons & style'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-[10px] text-slate-700">
                      <div>
                        <Circle className='w-2 h-2 bg-blue-600 rounded border-none' />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Store Mockup Card (Website Image) */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2 sm:p-2.5 shadow-inner overflow-hidden">
                {/* Window Header */}
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60 mb-2">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-md px-2.5 py-0.5 text-[8px] font-medium text-slate-600 flex items-center gap-1 shadow-2xs">
                    <span className="text-[8px] text-emerald-500">🔒</span>
                    <span className="truncate max-w-[140px]">yourstore.resellerpro.store</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Search className="w-2.5 h-2.5" />
                    <LayoutGrid className="w-2.5 h-2.5" />
                  </div>
                </div>

                {/* Real Website Store Image Preview with Auto-Scroll Animation */}
                <div className="relative rounded-lg overflow-hidden border border-slate-200 shadow-xs h-32 sm:h-36 bg-white">
                  <motion.img
                    src="/images/custom_store_website_mockup.png"
                    alt="Custom Store Website Mockup"
                    className="w-full min-h-[160%] object-cover object-top"
                    animate={{
                      y: ["0%", "-35%", "0%"]
                    }}
                    transition={{
                      duration: 7,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />
                </div>
              </div>
            </div>

            {/* Card 2: CRM Database */}
            <div className="bg-white border border-slate-200/80 hover:border-blue-500/40 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className='flex gap-2 text-green-600'>
                  <DatabaseIcon />
                  <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                    CRM Database
                  </h3>
                </div>


                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  All your customer data organized in one place. Track order history, preferences, and build lasting relationships.
                </p>

                {/* Customer List Mockup Widget */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 shadow-inner space-y-2 mb-3">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-900 px-0.5">
                    <span>Customers</span>
                  </div>

                  {/* Search Bar */}
                  <div className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] text-slate-500 flex items-center gap-1.5 shadow-xs">
                    <Search className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px]">Search customers...</span>
                  </div>

                  {/* Customer Rows */}
                  <div className="space-y-1">
                    {[
                      { name: 'Rahul Krishnan', email: 'rahul@example.com', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80' },
                      { name: 'Priya Sharma', email: 'priya@example.com', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80' },
                      { name: 'Amit Verma', email: 'amit@example.com', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80' },
                      { name: 'Neha Patel', email: 'neha@example.com', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80' }
                    ].map((cust, i) => (
                      <div key={i} className="flex items-center justify-between bg-white p-1 rounded-lg border border-slate-200/60">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <img src={cust.img} alt={cust.name} className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-slate-900 truncate leading-tight">
                              {cust.name}
                            </p>
                            <p className="text-[8px] text-slate-500 truncate leading-tight">
                              {cust.email}
                            </p>
                          </div>
                        </div>
                        <MoreHorizontal className="w-3 h-3 text-slate-400 flex-shrink-0 mr-0.5" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Stat Badges */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-center">
                  <div className="text-base font-extrabold text-green-600">10K+</div>
                  <div className="text-[9px] font-medium text-green-700">Customers</div>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-center">
                  <div className="text-base font-extrabold text-green-600">50K+</div>
                  <div className="text-[9px] font-medium text-green-700">Orders</div>
                </div>
              </div>
            </div>

            {/* Card 3: Security by Design */}
            <div className="bg-white border border-slate-200/80 hover:border-blue-500/40 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
              <div>
                {/* Top Section: Title, Description & Pill Tags */}
                <div className="space-y-2 mb-3">
                  <div className='flex gap-2 text-purple-600'>
                    <ShieldAlert />
                    <h3 className="text-lg font-bold text-slate-900">
                      Security by Design
                    </h3>
                  </div>


                  <p className="text-xs text-slate-600 leading-relaxed">
                    Industry-standard security measures to protect your business and customer information.
                  </p>

                  {/* Security Pill Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { icon: Lock, label: 'Data Encryption' },
                      { icon: User, label: 'Secure Access' },
                      { icon: RotateCw, label: 'Regular Backups' },
                      { icon: Shield, label: 'Privacy Focused' }
                    ].map((tag, idx) => (
                      <div key={idx} className="bg-blue-50 border border-blue-200 rounded-full px-2.5 py-1 text-[10px] font-semibold text-blue-600 flex items-center gap-1 shadow-2xs">
                        <tag.icon className="w-2.5 h-2.5 text-blue-600 flex-shrink-0" />
                        <span>{tag.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Middle Section: 3D Shield Visual Showcase Container (filling middle space) */}
                <div className="bg-gradient-to-br from-blue-50/50 via-slate-50 to-indigo-50/50 border border-slate-200/80 rounded-xl p-3 shadow-inner relative overflow-hidden flex items-center justify-center my-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-50 blur-xl pointer-events-none" />

                  <svg className="w-28 h-28 overflow-visible relative z-10" viewBox="0 0 100 100" fill="none">
                    <defs>
                      <linearGradient id="shieldOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#818cf8" stopOpacity="0.05" />
                      </linearGradient>
                      <linearGradient id="shieldInnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#4f46e5" />
                      </linearGradient>
                      <linearGradient id="pedestalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>

                    {/* Floating Orbital Rings */}
                    <ellipse cx="50" cy="50" rx="44" ry="22" fill="none" stroke="#2563eb" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 3" transform="rotate(-20 50 50)" />
                    <ellipse cx="50" cy="50" rx="46" ry="18" fill="none" stroke="#2563eb" strokeOpacity="0.25" strokeWidth="1" transform="rotate(15 50 50)" />

                    {/* Orbital Particles */}
                    <circle cx="12" cy="40" r="2" fill="#2563eb" opacity="0.7" />
                    <circle cx="90" cy="35" r="2.5" fill="#2563eb" opacity="0.8" />
                    <circle cx="20" cy="70" r="1.5" fill="#2563eb" opacity="0.5" />
                    <circle cx="85" cy="72" r="1.5" fill="#2563eb" opacity="0.6" />

                    {/* Elliptical Pedestal Platform */}
                    <ellipse cx="50" cy="80" rx="38" ry="10" fill="url(#pedestalGrad)" stroke="#2563eb" strokeOpacity="0.25" strokeWidth="1" />
                    <ellipse cx="50" cy="77" rx="30" ry="7" fill="url(#pedestalGrad)" stroke="#2563eb" strokeOpacity="0.3" strokeWidth="1" />

                    {/* Outer Translucent Shield */}
                    <path
                      d="M 50 12 C 68 12, 82 20, 82 44 C 82 72, 50 90, 50 90 C 50 90, 18 72, 18 44 C 18 20, 32 12, 50 12 Z"
                      fill="url(#shieldOuterGrad)"
                      stroke="#2563eb"
                      strokeOpacity="0.35"
                      strokeWidth="1.5"
                    />

                    {/* Inner Solid Gradient Shield */}
                    <path
                      d="M 50 20 C 64 20, 74 27, 74 46 C 74 68, 50 82, 50 82 C 50 82, 26 68, 26 46 C 26 27, 36 20, 50 20 Z"
                      fill="url(#shieldInnerGrad)"
                      className="drop-shadow-md"
                    />

                    {/* Lock Icon inside inner shield */}
                    <path
                      d="M 43 45 V 40 C 43 36, 46 33, 50 33 C 54 33, 57 36, 57 40 V 45"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <rect x="41" y="44" width="18" height="15" rx="3" fill="white" />
                    <circle cx="50" cy="50" r="1.5" fill="#2563eb" />
                    <path d="M 50 50 V 54" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Bottom Live Security & Protection Widget */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 shadow-inner space-y-2 mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-900">Live Security Shield</span>
                  </div>
                  <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    256-Bit SSL Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 pt-0.5">
                  <div className="bg-white p-2 rounded-lg border border-slate-200/60 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900 text-[10px] leading-tight">SOC-2 Ready</p>
                      <p className="text-[8px] text-slate-500 leading-tight">End-to-end protected</p>
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200/60 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900 text-[10px] leading-tight">Auto Backups</p>
                      <p className="text-[8px] text-slate-500 leading-tight">Every 24 Hours</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Row: 2 Asymmetric Bento Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">

            {/* Card 4: Real-time Analytics (7 cols on lg) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 hover:border-blue-500/40 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

                {/* Left Info Column */}
                <div className="md:col-span-5 space-y-2.5">
                  <div className="flex gap-2 text-rose-500">
                    <ChartNoAxesCombined />
                    <h3 className="text-lg font-bold text-slate-900">
                      Real-time Analytics
                    </h3>
                  </div>


                  <p className="text-xs text-slate-600 leading-relaxed">
                    Track your business performance with detailed analytics. Know your best products, top customers, and revenue trends at a glance.
                  </p>

                  <button className="border-2 border-slate-200 hover:border-blue-500/50 text-slate-900 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1.5 group">
                    <span>View Analytics</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Right Dashboard Mockup */}
                <div className="md:col-span-7 bg-slate-50 border border-slate-200/80 rounded-xl p-3 shadow-inner space-y-2.5">

                  {/* 4 Stat Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { label: 'Total Revenue', value: '₹48,500', change: '+24%' },
                      { label: 'Total Orders', value: '1,246', change: '+16%' },
                      { label: 'New Customers', value: '847', change: '+22%' },
                      { label: 'Conversion Rate', value: '3.24%', change: '+8%' }
                    ].map((stat, i) => (
                      <div key={i} className="bg-white p-2 rounded-lg border border-slate-200/60">
                        <span className="text-[8px] text-slate-500 block font-medium truncate">{stat.label}</span>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-[11px] font-extrabold text-slate-900 truncate">{stat.value}</span>
                          <span className="text-[7px] font-bold text-green-600 bg-green-500/10 px-1 py-0.2 rounded">
                            {stat.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Revenue Overview Chart Box */}
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-slate-900">Revenue Overview</span>
                      <div className="flex items-center gap-0.5 text-[8px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        <span>This Month</span>
                        <ChevronDown className="w-2 h-2" />
                      </div>
                    </div>

                    {/* SVG Spline Area Chart */}
                    <div className="h-20 w-full relative">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 300 70" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Y-axis gridlines */}
                        <line x1="0" y1="12" x2="300" y2="12" stroke="currentColor" className="text-slate-200" strokeDasharray="3 3" />
                        <line x1="0" y1="32" x2="300" y2="32" stroke="currentColor" className="text-slate-200" strokeDasharray="3 3" />
                        <line x1="0" y1="52" x2="300" y2="52" stroke="currentColor" className="text-slate-200" strokeDasharray="3 3" />

                        {/* Area */}
                        <path
                          d="M 0 60 Q 30 55, 60 42 T 120 35 T 180 38 T 240 22 T 300 10 L 300 68 L 0 68 Z"
                          fill="url(#chartGrad)"
                        />
                        {/* Spline Path */}
                        <path
                          d="M 0 60 Q 30 55, 60 42 T 120 35 T 180 38 T 240 22 T 300 10"
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        {/* Data point dot */}
                        <circle cx="300" cy="10" r="3" fill="#2563eb" className="animate-ping" />
                        <circle cx="300" cy="10" r="2.5" fill="#2563eb" />
                      </svg>
                    </div>

                    {/* X-axis date labels */}
                    <div className="flex justify-between text-[8px] text-slate-500 pt-0.5 mt-0.5 border-t border-slate-200/40">
                      <span>May 1</span>
                      <span>May 8</span>
                      <span>May 15</span>
                      <span>May 22</span>
                      <span>May 29</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* Card 5: Smart Paste (5 cols on lg) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 hover:border-blue-500/40 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

                {/* Left Info Column */}
                <div className="md:col-span-6 space-y-2.5">
                  <div className="flex gap-2 text-amber-500">
                    <Copy/>
                    <h3 className="text-lg font-bold text-slate-900">
                      Smart Paste
                    </h3>
                  </div>


                  <p className="text-xs text-slate-600 leading-relaxed">
                    Simply paste customer details from WhatsApp, emails, or any source and our AI will automatically detect and organize the information.
                  </p>

                  <ul className="space-y-1.5 pt-0.5">
                    {[
                      { icon: <Circle className='w-2 h-2 bg-blue-600 rounded border-none' />, label: 'AI-powered extraction' },
                      { icon: <Circle className='w-2 h-2 bg-blue-600 rounded border-none' />, label: 'Multi-source support' },
                      { icon: <Circle className='w-2 h-2 bg-blue-600 rounded border-none' />, label: '99% accuracy rate' }
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                        <span className="text-xs">{item.icon}</span>
                        <span>{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Floating Smart Paste Card */}
                <div className="md:col-span-6 bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 shadow-inner space-y-2">

                  {/* Header */}
                  <div className="flex items-center justify-between pb-0.5">
                    <span className="text-[11px] font-bold text-slate-900">Smart Paste</span>
                    <X className="w-3 h-3 text-slate-400 cursor-pointer" />
                  </div>

                  {/* Textarea box */}
                  <div className="bg-white border border-slate-200 rounded-lg p-2 text-[9px] font-mono leading-relaxed text-slate-600">
                    <p className="text-slate-400 mb-0.5">Paste customer details here...</p>
                    <p className="font-semibold text-slate-900">Name: Rajesh Kumar</p>
                    <p>Email: rajesh@example.com</p>
                    <p>Phone: +91 98765 43210</p>
                    <p>Address: 123, MG Road,</p>
                    <p>Bangalore, KA 560001</p>
                  </div>

                  {/* Extract Button */}
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-[11px] py-1.5 rounded-lg shadow-sm shadow-blue-500/20 transition-all text-center">
                    Extract Information
                  </button>

                  {/* Success Toast */}
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg py-1.5 px-2 flex items-center justify-center gap-1 text-[9px] font-bold text-green-600">
                    <CheckCircle2 className="w-3 h-3 text-green-500 fill-green-500/20" />
                    <span>Information extracted successfully!</span>
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>

        {/* Footer Trust Banner */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 text-slate-600 text-xs sm:text-sm font-medium">
          <span>Trusted by 10,000+ resellers worldwide</span>

          <div className="flex items-center -space-x-2 overflow-hidden">
            <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="Reseller User" />
            <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" alt="Reseller User" />
            <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80" alt="Reseller User" />
            <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80" alt="Reseller User" />
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-[8px] ring-2 ring-white shadow-xs">
              10K+
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}


