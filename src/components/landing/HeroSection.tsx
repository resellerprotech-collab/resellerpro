"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle, TrendingUp, Users, ShoppingBag, Play, Star, Zap, ShieldCheck, Bell, Search, Home, PieChart, MessageSquare, User, Wallet } from 'lucide-react'
import Link from 'next/link'
import { AnimatedDemoModal } from '@/components/demo/AnimatedDemoModal'
import NextImage from 'next/image'
import { motion } from 'framer-motion'
import { IosSpinner } from '@/components/ui/ios-spinner'

export default function HeroSection() {
  const router = useRouter()
  const [showDemo, setShowDemo] = useState(false)
  const [navigating, setNavigating] = useState(false)

  const handleStartFree = () => {
    setNavigating(true)
    router.push('/signup')
  }

  return (
    <>
      {/* iOS Spinner overlay — shown centered on page while navigating */}
      {navigating && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <IosSpinner size="xl" className="text-blue-600" />
        </div>
      )}
    <section className="relative pt-16 pb-0 lg:pt-12 lg:pb-12 overflow-hidden bg-white text-slate-900">
      {/* Background Elements */}

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-transparent rounded-full blur-[120px]"
          animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/15 via-blue-400/10 to-transparent rounded-full blur-[100px]"
          animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
        <motion.div 
          className="absolute top-[20%] left-[15%] w-2 h-2 bg-blue-600/40 rounded-full"
          animate={{ y: [0, -20, 0], rotate: [0, 1, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-[60%] right-[20%] w-3 h-3 bg-blue-400/60 rounded-full"
          animate={{ y: [0, -15, 0], rotate: [0, -1, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-[30%] left-[40%] w-1.5 h-1.5 bg-blue-500/30 rounded-full"
          animate={{ y: [0, -20, 0], rotate: [0, 1, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Mobile Block — full width, outside container */}
      <div className="block lg:hidden">

          {/* TOP: Text content — padded */}
          <div className="px-5 pt-10 pb-5 space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold leading-[1.15] text-slate-900" style={{ fontFamily: "'Switzer', sans-serif" }}>
              Supercharge your{' '}
              <span className="relative inline-block">
                <motion.span
                  className="relative z-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent inline-block pb-[0.15em]"
                  style={{ backgroundSize: '200% 200%' }}
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  Reselling
                </motion.span>
              </span>{' '}
              Business
            </h1>
            <p className="text-[10px] md:text-sm max-w-xl leading-relaxed text-slate-600 pr-4">
              The all-in-one platform to manage orders, track customers, and grow your business.
              Built for modern resellers who demand simplicity and power.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {[
                { icon: Zap, text: 'Lightning Fast' },
                { icon: ShieldCheck, text: 'Secure' },
                { icon: Users, text: '24/7 Support' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-blue-200/80 text-[9px] text-slate-600 shadow-xs">
                  <feature.icon className="w-2.5 h-2.5 text-blue-600" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1 w-full">
              <button
                onClick={handleStartFree}
                disabled={navigating}
                className="px-5 py-3 w-full justify-center bg-blue-600 text-white rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] flex items-center gap-2 relative overflow-hidden group/btn cursor-pointer disabled:opacity-80"
              >
                {navigating ? (
                  <IosSpinner size="sm" className="text-white" />
                ) : (
                  <span className="relative z-10 flex items-center gap-1.5">
                    Get Started Now
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
                <motion.div
                  className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
              </button>
              <button
                onClick={() => setShowDemo(true)}
                className="px-4 py-3 bg-white text-slate-900 rounded-xl font-semibold border border-slate-200 hover:border-blue-500/50 hover:bg-slate-50 text-sm transition-all duration-300 flex items-center justify-center gap-2 group shadow-xs w-full cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Play className="w-3 h-3 text-blue-600 fill-blue-600" />
                </div>
                Watch Demo
              </button>
            </div>
          </div>

          {/* BOTTOM: Phone section — light blue gradient background */}
          <div className="relative overflow-hidden rounded-t-[36px] bg-gradient-to-br from-blue-50/80 via-slate-50 to-blue-100/50 border-t border-slate-200/60" style={{ height: '450px' }}>

            {/* Blue radial glow */}
            <div className="flex absolute inset-0 items-center justify-center pointer-events-none">
              <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-400/20 blur-[80px]" />
              <div className="absolute w-[250px] h-[250px] rounded-full bg-blue-300/30 blur-[50px]" />
            </div>

            {/* Floating: Sales Up */}
            <motion.div
              className="absolute top-6 right-5 z-30"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="bg-white/95 backdrop-blur-xl px-3 py-2 rounded-2xl shadow-lg border border-slate-200/80">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-900">Sales Up!</p>
                    <p className="text-[9px] text-green-600 font-medium">+24% today</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating: Order Confirmed */}
            <motion.div
              className="absolute bottom-8 left-5 z-30"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              <div className="bg-white/95 backdrop-blur-xl px-3 py-2 rounded-2xl shadow-lg border border-slate-200/80">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-900">Order Confirmed!</p>
                    <p className="text-[9px] text-gray-500">₹2,450 received</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Phone mockup — larger & centred, cropped at bottom */}
            <div className="absolute inset-x-0 top-0 flex justify-center pt-8">
              <div className="relative" style={{ transform: 'scale(0.88)', transformOrigin: 'top center' }}>
                {/* Phone Frame */}
                <div
                  className="relative bg-gradient-to-br from-[#8a8a8a] via-[#a0a0a0] to-[#7a7a7a] p-[2.5px] rounded-[54px] shadow-[0_25px_60px_-10px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.15)_inset]"
                  style={{ width: '280px', height: '590px' }}
                >
                  <div className="w-full h-full rounded-[51.5px] bg-[#1a1a1a] p-[2px]">
                    <div className="w-full h-full rounded-[49.5px] bg-black p-[1px]">
                      <div className="relative w-full h-full rounded-[48.5px] overflow-hidden bg-white">
                        {/* Dynamic Island */}
                        <div className="absolute top-0 left-0 right-0 z-50 pt-[11px]">
                          <div className="relative flex items-center justify-between px-4">
                            <span className="text-[14px] font-semibold text-black tracking-tight">9:41</span>
                            <div className="absolute left-1/2 -translate-x-1/2">
                              <div className="w-[85px] h-[28px] bg-black rounded-[20px] flex items-center gap-2 px-3">
                                <div className="w-[12px] h-[12px] rounded-full bg-[#1a1a1a] ring-[1.5px] ring-[#2a2a2a] flex items-center justify-center">
                                  <div className="w-[6px] h-[6px] rounded-full bg-[#0d1b2a]">
                                    <div className="w-[2px] h-[2px] rounded-full bg-[#1e3a5f] ml-[1px] mt-[1px]" />
                                  </div>
                                </div>
                                <div className="flex items-center gap-[6px]">
                                  <div className="w-[8px] h-[8px] rounded-full bg-[#1a1a1a]" />
                                  <div className="w-[5px] h-[5px] rounded-full bg-[#0f0f0f]" />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[12px] font-semibold text-black">5G</span>
                              <div className="flex items-center">
                                <div className="w-[25px] h-[13px] border-[1.5px] border-black rounded-[4px] flex items-center p-[2px]">
                                  <div className="h-full w-[80%] bg-black rounded-[2px]" />
                                </div>
                                <div className="w-[1.5px] h-[5px] bg-black rounded-r-[1px] ml-[0.5px]" />
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Screen Content */}
                        <div className="h-full w-full bg-gradient-to-b from-[#f8fafc] via-white to-[#f1f5f9] flex flex-col">
                          <div className="flex justify-between items-end px-8 pt-[14px] h-[52px]"><div /></div>
                          <div className="px-4 pt-3 pb-2 flex justify-between items-center">
                            <div className="flex items-center gap-2.5">
                              <div className="w-[42px] h-[42px] rounded-[14px] bg-white flex items-center justify-center shadow-md shadow-blue-500/20 overflow-hidden border border-slate-200/80">
                                <NextImage src="/logo.svg" alt="RS" width={28} height={28} className="w-[28px] h-[28px] object-contain" />
                              </div>
                              <div>
                                <p className="text-[11px] text-gray-500 leading-tight">Welcome back</p>
                                <p className="text-[14px] font-semibold text-gray-900 leading-tight">Rahul Krishnan</p>
                              </div>
                            </div>
                            <div className="relative w-[38px] h-[38px] rounded-full bg-gray-100 flex items-center justify-center">
                              <Bell className="w-[18px] h-[18px] text-gray-700" />
                              <div className="absolute -top-0.5 -right-0.5 w-[16px] h-[16px] bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                                <span className="text-[9px] font-bold text-white">3</span>
                              </div>
                            </div>
                          </div>
                          <div className="px-4 py-2">
                            <div className="flex items-center gap-2.5 px-3.5 py-[10px] bg-gray-100 rounded-[14px]">
                              <Search className="w-[16px] h-[16px] text-gray-400" />
                              <span className="text-[12px] text-gray-400">Search orders, customers...</span>
                            </div>
                          </div>
                          <div className="mx-4 mt-1 p-4 rounded-[20px] bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl shadow-blue-500/25 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <div className="relative z-10">
                              <span className="text-blue-100 text-[11px] font-medium">Total Revenue</span>
                              <h3 className="text-[28px] font-bold tracking-tight leading-none mt-1">₹48,500</h3>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 px-4 py-3">
                            {[
                              { icon: ShoppingBag, value: '156', label: 'Orders', color: 'orange' },
                              { icon: Users, value: '847', label: 'Customers', color: 'cyan' },
                              { icon: Wallet, value: '₹18K', label: 'Profit', color: 'green' },
                            ].map((stat, i) => (
                              <div key={i} className="bg-white p-2.5 rounded-[14px] shadow-xs border border-gray-100">
                                <div className={`w-[28px] h-[28px] rounded-[10px] flex items-center justify-center mb-1.5 ${stat.color === 'orange' ? 'bg-orange-100' : stat.color === 'cyan' ? 'bg-cyan-100' : 'bg-green-100'}`}>
                                  <stat.icon className={`w-[14px] h-[14px] ${stat.color === 'orange' ? 'text-orange-600' : stat.color === 'cyan' ? 'text-cyan-600' : 'text-green-600'}`} />
                                </div>
                                <div className="text-[15px] font-bold text-gray-900 leading-none">{stat.value}</div>
                                <div className="text-[9px] text-gray-500 mt-0.5">{stat.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Physical Buttons */}
                  <div className="absolute left-[-2.5px] top-[95px] w-[4px] h-[28px] bg-gradient-to-b from-[#9a9a9a] to-[#7a7a7a] rounded-l-[2px]" />
                  <div className="absolute left-[-2.5px] top-[138px] w-[4px] h-[50px] bg-gradient-to-b from-[#9a9a9a] to-[#7a7a7a] rounded-l-[2px]" />
                  <div className="absolute left-[-2.5px] top-[198px] w-[4px] h-[50px] bg-gradient-to-b from-[#9a9a9a] to-[#7a7a7a] rounded-l-[2px]" />
                  <div className="absolute right-[-2.5px] top-[155px] w-[4px] h-[70px] bg-gradient-to-b from-[#9a9a9a] to-[#7a7a7a] rounded-r-[2px]" />
                </div>
              </div>
            </div>
          </div>
        </div>{/* end mobile-only block */}

      {/* Desktop container */}
      <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8">
        <div className="relative z-10 hidden lg:grid lg:grid-cols-2 lg:gap-0 items-center">

          {/* LEFT: Text Content */}
          <div className="space-y-8 text-left">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1]" style={{ fontFamily: "'Switzer', sans-serif" }}>
              Supercharge your{' '}
              <span className="relative inline-block">
                <motion.span
                  className="relative z-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent inline-block pb-[0.15em]"
                  style={{ backgroundSize: '200% 200%' }}
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  Reselling
                </motion.span>
              </span>{' '}
              Business
            </h1>

            <p className="text-sm max-w-xl leading-relaxed text-slate-600">
              The all-in-one platform to manage orders, track customers, and grow your business.
              Built for modern resellers who demand simplicity and power.
            </p>

            <div className="flex flex-wrap items-center justify-start gap-3">
              {[
                { icon: Zap, text: 'Lightning Fast' },
                { icon: ShieldCheck, text: 'Encrypted & Secure' },
                { icon: Users, text: '24/7 Support' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/80 border border-slate-200/80 text-[10px] text-slate-700">
                  <feature.icon className="w-3.5 h-3.5 text-blue-600" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-start gap-4 pt-2">
              <button
                onClick={handleStartFree}
                disabled={navigating}
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold text-sm transition-all duration-300 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-[1.02] flex items-center justify-center gap-2 relative overflow-hidden group/btn cursor-pointer disabled:opacity-80"
              >
                {navigating ? (
                  <IosSpinner size="sm" className="text-white" />
                ) : (
                  <span className="relative z-10 flex items-center gap-2">
                    Start Free Trial
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
                <motion.div
                  className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
              </button>
              <button
                onClick={() => setShowDemo(true)}
                className="px-4 py-3 bg-white text-slate-900 rounded-2xl font-semibold border-2 border-slate-200 hover:border-blue-500/50 hover:bg-slate-50 text-sm transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <div className="w-3 h-3 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Play className="w-3 h-3 text-blue-600 fill-blue-600" />
                </div>
                Watch Demo
              </button>
            </div>

            <div className="pt-4 flex items-center justify-start gap-6">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-[3px] border-white ring-2 ring-blue-500/20 overflow-hidden transition-transform hover:scale-110 hover:z-10">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">12,000+</span> resellers
                  </p>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">No credit card required</span>
              </div>
            </div>
          </div>

          {/* RIGHT: iPhone 17 Pro Mockup — desktop only */}
          <div className="relative flex items-center justify-center">

            <div className="relative w-[320px] h-[680px] flex items-center justify-center">

              {/* Blue radial glow — desktop */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
                <div className="absolute w-[600px] h-[600px] rounded-full bg-blue-400/20 blur-[100px]" />
                <div className="absolute w-[420px] h-[420px] rounded-full bg-blue-300/30 blur-[70px]" />
                <div className="absolute w-[240px] h-[240px] rounded-full bg-blue-200/40 blur-[45px]" />
              </div>

              {/* Concentric circle rings — desktop */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute w-[580px] h-[580px] rounded-full border border-blue-200/40" />
                <div className="absolute w-[480px] h-[480px] rounded-full border border-blue-200/50" />
                <div className="absolute w-[380px] h-[380px] rounded-full border border-blue-300/60" />
                <div className="absolute w-[280px] h-[280px] rounded-full border border-blue-300/70" />
              </div>

              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[550px] bg-gradient-to-br from-blue-400/20 via-blue-300/15 to-blue-500/10 rounded-full blur-3xl -z-10"
                animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div 
                className="relative"
                animate={{ y: [0, -20, 0], rotate: [0, 1, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >

                {/* Phone Frame - Titanium Natural finish */}
                <div
                  className="relative bg-gradient-to-br from-[#8a8a8a] via-[#a0a0a0] to-[#7a7a7a] p-[2.5px] rounded-[54px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.1)_inset]"
                  style={{ width: '280px', height: '590px' }}
                >

                  {/* Inner frame - dark bezel */}
                  <div className="w-full h-full rounded-[51.5px] bg-[#1a1a1a] p-[2px]">

                    {/* Screen bezel */}
                    <div className="w-full h-full rounded-[49.5px] bg-black p-[1px]">

                      {/* Actual Screen */}
                      <div className="relative w-full h-full rounded-[48.5px] overflow-hidden bg-white">

                        {/* Dynamic Island */}
                        <div className="absolute top-0 left-0 right-0 z-50 pt-[11px]">
                          <div className="relative flex items-center justify-between px-4">

                            {/* LEFT — Time */}
                            <span className="text-[14px] font-semibold text-black tracking-tight">
                              9:41
                            </span>

                            {/* CENTER — Dynamic Island */}
                            <div className="absolute left-1/2 -translate-x-1/2">
                              <div className="w-[85px] h-[28px] bg-black rounded-[20px] flex items-center gap-2 px-3">

                                {/* Front camera */}
                                <div className="w-[12px] h-[12px] rounded-full bg-[#1a1a1a] ring-[1.5px] ring-[#2a2a2a] flex items-center justify-center">
                                  <div className="w-[6px] h-[6px] rounded-full bg-[#0d1b2a]">
                                    <div className="w-[2px] h-[2px] rounded-full bg-[#1e3a5f] ml-[1px] mt-[1px]" />
                                  </div>
                                </div>

                                {/* Face ID sensors */}
                                <div className="flex items-center gap-[6px]">
                                  <div className="w-[8px] h-[8px] rounded-full bg-[#1a1a1a]" />
                                  <div className="w-[5px] h-[5px] rounded-full bg-[#0f0f0f]" />
                                </div>

                              </div>
                            </div>

                            {/* RIGHT — Network + Battery */}
                            <div className="flex items-center gap-1">
                              <span className="text-[12px] font-semibold text-black">5G</span>
                              <div className="flex items-center">
                                <div className="w-[25px] h-[13px] border-[1.5px] border-black rounded-[4px] flex items-center p-[2px]">
                                  <div className="h-full w-[80%] bg-black rounded-[2px]" />
                                </div>
                                <div className="w-[1.5px] h-[5px] bg-black rounded-r-[1px] ml-[0.5px]" />
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Screen Content */}
                        <div className="h-full w-full bg-gradient-to-b from-[#f8fafc] via-white to-[#f1f5f9] flex flex-col">

                          {/* Status Bar */}
                          <div className="flex justify-between items-end px-8 pt-[14px] h-[52px]">
                            <div className="flex items-center gap-[5px] mb-[2px]">
                            </div>
                          </div>

                          {/* App Header */}
                          <div className="px-4 pt-3 pb-2 flex justify-between items-center">
                            <div className="flex items-center gap-2.5">
                              <div className="w-[42px] h-[42px] rounded-[14px] bg-white flex items-center justify-center shadow-md shadow-blue-500/20 overflow-hidden border border-slate-200/80">
                                <NextImage
                                  src="/logo.svg"
                                  alt="RS"
                                  width={28}
                                  height={28}
                                  className="w-[28px] h-[28px] object-contain"
                                />
                              </div>
                              <div>
                                <p className="text-[11px] text-gray-500 leading-tight">Welcome back</p>
                                <p className="text-[14px] font-semibold text-gray-900 leading-tight">Rahul Krishnan</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="relative w-[38px] h-[38px] rounded-full bg-gray-100 flex items-center justify-center">
                                <Bell className="w-[18px] h-[18px] text-gray-700" />
                                <div className="absolute -top-0.5 -right-0.5 w-[16px] h-[16px] bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                                  <span className="text-[9px] font-bold text-white">3</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Search Bar */}
                          <div className="px-4 py-2">
                            <div className="flex items-center gap-2.5 px-3.5 py-[10px] bg-gray-100 rounded-[14px]">
                              <Search className="w-[16px] h-[16px] text-gray-400" />
                              <span className="text-[12px] text-gray-400">Search orders, customers...</span>
                            </div>
                          </div>

                          {/* Revenue Card */}
                          <div className="mx-4 mt-1 p-4 rounded-[20px] bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl shadow-blue-500/25 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-white/10 rounded-full blur-2xl" />

                            <div className="relative z-10">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <span className="text-blue-100 text-[11px] font-medium">Total Revenue</span>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <div className="flex items-center gap-1 px-2 py-[3px] bg-green-400/20 rounded-full">
                                      <TrendingUp className="w-[10px] h-[10px] text-green-300" />
                                      <span className="text-[9px] text-green-300 font-semibold">+24.5%</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="px-2.5 py-1 bg-white/20 rounded-full backdrop-blur-sm text-[10px] font-semibold">
                                  Jan 2026
                                </div>
                              </div>
                              <h3 className="text-[28px] font-bold tracking-tight leading-none">₹48,500</h3>
                              <div className="mt-3">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[9px] text-blue-100">Monthly Goal</span>
                                  <span className="text-[9px] text-white font-semibold">75%</span>
                                </div>
                                <div className="h-[6px] bg-white/20 rounded-full overflow-hidden">
                                  <div className="h-full w-[75%] bg-white rounded-full" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Quick Stats Grid */}
                          <div className="grid grid-cols-3 gap-2 px-4 py-3">
                            {[
                              { icon: ShoppingBag, value: '156', label: 'Orders', color: 'orange' },
                              { icon: Users, value: '847', label: 'Customers', color: 'cyan' },
                              { icon: Wallet, value: '₹18K', label: 'Profit', color: 'green' },
                            ].map((stat, i) => (
                              <div key={i} className="bg-white p-2.5 rounded-[14px] shadow-xs border border-gray-100">
                                <div className={`w-[28px] h-[28px] rounded-[10px] flex items-center justify-center mb-1.5 ${stat.color === 'orange' ? 'bg-orange-100' :
                                  stat.color === 'cyan' ? 'bg-cyan-100' : 'bg-green-100'
                                  }`}>
                                  <stat.icon className={`w-[14px] h-[14px] ${stat.color === 'orange' ? 'text-orange-600' :
                                    stat.color === 'cyan' ? 'text-cyan-600' : 'text-green-600'
                                    }`} />
                                </div>
                                <div className="text-[15px] font-bold text-gray-900 leading-none">{stat.value}</div>
                                <div className="text-[9px] text-gray-500 mt-0.5">{stat.label}</div>
                              </div>
                            ))}
                          </div>

                          {/* Recent Orders */}
                          <div className="flex-1 mx-4 bg-white rounded-[16px] p-3 shadow-xs border border-gray-100 overflow-hidden">
                            <div className="flex items-center justify-between mb-2.5">
                              <span className="text-[13px] font-semibold text-gray-900">Recent Orders</span>
                              <div className="flex items-center gap-1 text-blue-600">
                                <span className="text-[10px] font-medium">View All</span>
                                <ArrowRight className="w-3 h-3" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              {[
                                { name: 'Sports Jersey', customer: 'Amit K.', time: '2m', amount: '+₹1,450', color: 'orange', status: 'new' },
                                { name: 'Running Shoes', customer: 'Sanjay N.', time: '15m', amount: '+₹2,890', color: 'blue', status: 'paid' },
                                { name: 'Fitness Band', customer: 'Rahul M.', time: '1h', amount: '+₹799', color: 'purple', status: 'shipped' },
                              ].map((order, i) => (
                                <div key={i} className="flex items-center justify-between p-2 rounded-[12px] bg-gray-50/80">
                                  <div className="flex items-center gap-2.5">
                                    <div className={`w-[36px] h-[36px] rounded-[10px] flex items-center justify-center ${order.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                                      order.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                                      }`}>
                                      <ShoppingBag className="w-[16px] h-[16px]" />
                                    </div>
                                    <div>
                                      <div className="text-[11px] font-semibold text-gray-900 leading-tight">{order.name}</div>
                                      <div className="text-[9px] text-gray-400 mt-0.5">{order.customer} • {order.time}</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-[11px] font-bold text-green-600">{order.amount}</div>
                                    <div className={`text-[8px] px-[6px] py-[2px] rounded-full mt-0.5 font-medium ${order.status === 'new' ? 'bg-orange-100 text-orange-600' :
                                      order.status === 'paid' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                      }`}>
                                      {order.status}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Bottom Navigation */}
                          <div className="px-4 py-2">
                            <div className="flex items-center justify-around py-2 bg-white/90 backdrop-blur-sm rounded-[18px] shadow-lg shadow-gray-200/50 border border-gray-100">
                              {[
                                { icon: Home, label: 'Home', active: true },
                                { icon: ShoppingBag, label: 'Orders', active: false },
                                { icon: PieChart, label: 'Stats', active: false },
                                { icon: MessageSquare, label: 'Chat', active: false },
                                { icon: User, label: 'Profile', active: false },
                              ].map((item, i) => (
                                <div key={i} className={`flex flex-col items-center gap-[2px] ${item.active ? 'text-blue-600' : 'text-gray-400'}`}>
                                  <div className={`p-[6px] rounded-[10px] ${item.active ? 'bg-blue-50' : ''}`}>
                                    <item.icon className="w-[18px] h-[18px]" fill={item.active ? 'currentColor' : 'none'} />
                                  </div>
                                  <span className="text-[8px] font-medium">{item.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Home Indicator */}
                          <div className="flex justify-center pb-[8px] pt-[2px]">
                            <div className="w-[120px] h-[5px] bg-black rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Physical Buttons */}
                  <div className="absolute left-[-2.5px] top-[95px] w-[4px] h-[28px] bg-gradient-to-b from-[#9a9a9a] to-[#7a7a7a] rounded-l-[2px]" />
                  <div className="absolute left-[-2.5px] top-[138px] w-[4px] h-[50px] bg-gradient-to-b from-[#9a9a9a] to-[#7a7a7a] rounded-l-[2px]" />
                  <div className="absolute left-[-2.5px] top-[198px] w-[4px] h-[50px] bg-gradient-to-b from-[#9a9a9a] to-[#7a7a7a] rounded-l-[2px]" />
                  <div className="absolute right-[-2.5px] top-[155px] w-[4px] h-[70px] bg-gradient-to-b from-[#9a9a9a] to-[#7a7a7a] rounded-r-[2px]" />

                </div>

                {/* Floating Elements */}

                {/* Top Right - Sales Notification */}
                <motion.div 
                  className="absolute top-20 -right-24 z-20"
                  animate={{ y: [0, -20, 0], rotate: [0, 1, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="bg-white/95 backdrop-blur-xl px-3.5 py-2.5 rounded-2xl shadow-xl shadow-blue-500/10 border border-slate-200/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-900">Sales Up!</p>
                        <p className="text-[10px] text-green-600 font-medium">+24% today</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Bottom Left - Order Confirmed */}
                <motion.div 
                  className="absolute bottom-20 -left-36 z-20"
                  animate={{ y: [0, -15, 0], rotate: [0, -1, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <div className="bg-white/95 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-xl shadow-blue-500/10 border border-slate-200/80">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <CheckCircle className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-slate-900">Order Confirmed!</p>
                        <p className="text-[10px] text-slate-500">₹2,450 received</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Demo Modal */}
      <AnimatedDemoModal open={showDemo} onClose={() => setShowDemo(false)} />
    </section>
    </>
  )
}

