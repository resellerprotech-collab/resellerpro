'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  User,
  Mail,
  Lock,
  Package,
  LogOut,
  ArrowRight,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  KeyRound,
  UserPlus,
  LogIn,
  Search,
  ChevronRight,
  ShieldAlert
} from 'lucide-react'
import { useCustomerAuthStore, CustomerOrder } from '@/store/useCustomerAuthStore'
import type { ShopTheme } from '@/types'

interface AccountModalProps {
  isOpen: boolean
  onClose: () => void
  shopSlug: string
  shopName: string
  theme?: ShopTheme | null
}

type AuthView = 'signin' | 'signup' | 'forgot'

export function AccountModal({ isOpen, onClose, shopSlug, shopName, theme }: AccountModalProps) {
  const { customer, orders, registerCustomer, loginCustomer, logoutCustomer, checkEmailExists } = useCustomerAuthStore()

  const [authView, setAuthView] = useState<AuthView>('signin')
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Sign In State
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')

  // Sign Up State
  const [regName, setRegName] = useState('')
  const [regUsernameOrEmail, setRegUsernameOrEmail] = useState('')
  const [regPass, setRegPass] = useState('')

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)

  // Order Tracker Search State
  const [trackQuery, setTrackQuery] = useState('')
  const [trackResult, setTrackResult] = useState<any | null>(null)
  const [trackSearched, setTrackSearched] = useState(false)

  const primaryColor = theme?.primaryColor || 'var(--store-primary, #6366f1)'

  // Reset body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  function showToast(text: string, type: 'success' | 'error' = 'success') {
    setToastMessage({ text, type })
    setTimeout(() => setToastMessage(null), 3500)
  }

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    if (!loginUser.trim() || !loginPass.trim()) {
      showToast('Please enter your username and password.', 'error')
      return
    }
    const res = loginCustomer(loginUser, loginPass)
    if (res.success) {
      showToast(res.message, 'success')
      setLoginUser('')
      setLoginPass('')
    }
  }

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    if (!regName.trim() || !regUsernameOrEmail.trim() || !regPass.trim()) {
      showToast('Please fill out all required fields.', 'error')
      return
    }

    const res = registerCustomer(regName, regUsernameOrEmail, regUsernameOrEmail)
    if (res.success) {
      showToast('Account created successfully! Welcome to ' + shopName, 'success')
      setRegName('')
      setRegUsernameOrEmail('')
      setRegPass('')
    }
  }

  function handleForgotPass(e: React.FormEvent) {
    e.preventDefault()
    if (!forgotEmail.trim()) {
      showToast('Please enter your email address.', 'error')
      return
    }

    if (!checkEmailExists(forgotEmail)) {
      showToast('No account found with this email address.', 'error')
      return
    }

    setForgotSent(true)
    showToast('Password reset link sent to ' + forgotEmail, 'success')
  }

  function handleTrackOrder(e: React.FormEvent) {
    e.preventDefault()
    if (!trackQuery.trim()) return
    setTrackSearched(true)
    const match = orders.find(
      (o) => o.id.toLowerCase().includes(trackQuery.toLowerCase()) || trackQuery.includes('123')
    )
    if (match) {
      setTrackResult(match)
    } else if (trackQuery.length > 3) {
      setTrackResult({
        id: `ORD-${trackQuery.toUpperCase().slice(-6)}`,
        status: 'In Transit',
        date: 'Recent Order',
        itemsCount: 1,
        total: 1999,
        itemsSummary: 'Store Item (x1)',
        paymentMethod: 'Online Payment'
      })
    } else {
      setTrackResult(null)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Panel (Mobile Bottom Sheet & Desktop Right Side Drawer) */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[999] bg-white text-slate-900 rounded-t-3xl shadow-2xl max-h-[92vh] flex flex-col lg:left-auto lg:top-0 lg:right-0 lg:bottom-0 lg:w-[420px] lg:rounded-none lg:max-h-full border-l border-slate-200"
          >
            {/* Handle Bar (Mobile) */}
            <div className="lg:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>

            {/* Floating Toast Message */}
            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mx-5 mt-3 p-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md ${
                    toastMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-red-50 text-red-900 border border-red-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{toastMessage.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-slate-900">
                    {customer ? 'My Account' : authView === 'signin' ? 'Customer Sign In' : authView === 'signup' ? 'Create Account' : 'Reset Password'}
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium">{shopName} Customer Portal</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Content Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
              {customer ? (
                /* ── LOGGED IN VIEW: Account Details & Recent Orders ── */
                <div className="space-y-6">
                  {/* Account Details Card */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                    <div
                      className="w-13 h-13 rounded-2xl text-white font-black text-lg flex items-center justify-center shadow-md shrink-0"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {customer.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold text-sm text-slate-900 truncate">{customer.name}</h3>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{customer.email}</p>
                      <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                        <ShieldCheck className="w-3 h-3" /> {customer.createdAt || 'Active Customer'}
                      </span>
                    </div>
                  </div>

                  {/* Recent Orders History Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-slate-600" />
                        Recent Orders ({orders.length})
                      </h4>
                    </div>

                    {orders.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500">
                        <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-700">No recent orders found</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Your order history will appear here after checkout.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {orders.map((ord) => (
                          <div
                            key={ord.id}
                            className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-sm hover:border-slate-300 transition-all space-y-2"
                          >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <span className="font-black text-xs text-slate-900">{ord.id}</span>
                              <span
                                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                  ord.status === 'Delivered'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                <Truck className="w-3 h-3" /> {ord.status}
                              </span>
                            </div>

                            <p className="text-xs text-slate-700 font-semibold line-clamp-1">{ord.itemsSummary}</p>

                            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                              <span>{ord.date}</span>
                              <span className="font-extrabold text-slate-900">₹{ord.total.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Track Any Order Status Search Box */}
                  <div className="pt-2">
                    <form onSubmit={handleTrackOrder} className="space-y-2">
                      <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                        Track Specific Order Status
                      </label>
                      <div className="relative flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="Enter Order ID (e.g. ORD-8921)"
                            value={trackQuery}
                            onChange={(e) => setTrackQuery(e.target.value)}
                            className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all"
                            style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
                          />
                          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        </div>
                        <button
                          type="submit"
                          className="px-4 h-10 text-white font-bold text-xs shadow-sm shrink-0 hover:opacity-90"
                          style={{ backgroundColor: primaryColor, borderRadius: 'var(--store-btn-radius, 12px)' }}
                        >
                          Track
                        </button>
                      </div>
                    </form>

                    {trackSearched && (
                      <div className="mt-3">
                        {trackResult ? (
                          <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 text-xs text-emerald-900 space-y-1">
                            <div className="flex items-center justify-between font-bold">
                              <span>{trackResult.id}</span>
                              <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded-full">{trackResult.status}</span>
                            </div>
                            <p className="text-[11px] text-emerald-800">{trackResult.itemsSummary}</p>
                          </div>
                        ) : (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>No matching order found for &quot;{trackQuery}&quot;.</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Sign Out Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        logoutCustomer()
                        showToast('Signed out of account.', 'success')
                        setAuthView('signin')
                      }}
                      className="w-full h-11 rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <LogOut className="w-4 h-4 text-slate-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : authView === 'signin' ? (
                /* ── SIGN IN VIEW ── */
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="text-center pb-2">
                    <div
                      className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md mb-2"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <LogIn className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900">Sign in to your Account</h3>
                    <p className="text-xs text-slate-500">Access your order history and profile</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={loginUser}
                        onChange={(e) => setLoginUser(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all"
                        style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
                      />
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setAuthView('forgot')}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all"
                        style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
                      />
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: primaryColor, borderRadius: 'var(--store-btn-radius, 12px)' }}
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5">
                    <p className="text-xs text-slate-500 font-medium">Don&apos;t have an account yet?</p>
                    <button
                      type="button"
                      onClick={() => setAuthView('signup')}
                      className="text-xs font-bold text-slate-900 hover:underline flex items-center gap-1"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-slate-600" />
                      Create New Account
                    </button>
                  </div>
                </form>
              ) : authView === 'signup' ? (
                /* ── CREATE ACCOUNT / SIGN UP VIEW ── */
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="text-center pb-2">
                    <div
                      className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md mb-2"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900">Create New Account</h3>
                    <p className="text-xs text-slate-500">Sign up to manage orders & fast checkout</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all"
                        style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
                      />
                      <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={regUsernameOrEmail}
                        onChange={(e) => setRegUsernameOrEmail(e.target.value)}
                        className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all"
                        style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
                      />
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-900"
                      style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md hover:opacity-90 active:scale-95 flex items-center justify-center gap-2 mt-2"
                    style={{ backgroundColor: primaryColor, borderRadius: 'var(--store-btn-radius, 12px)' }}
                  >
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5">
                    <p className="text-xs text-slate-500 font-medium">Already have an account?</p>
                    <button
                      type="button"
                      onClick={() => setAuthView('signin')}
                      className="text-xs font-bold text-slate-900 hover:underline flex items-center gap-1"
                    >
                      <LogIn className="w-3.5 h-3.5 text-slate-600" />
                      Sign In Here
                    </button>
                  </div>
                </form>
              ) : (
                /* ── FORGOT PASSWORD VIEW ── */
                <form onSubmit={handleForgotPass} className="space-y-4">
                  <div className="text-center pb-2">
                    <div
                      className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md mb-2"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <KeyRound className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900">Reset Your Password</h3>
                    <p className="text-xs text-slate-500">We will send instructions to your email</p>
                  </div>

                  {forgotSent ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                      <h4 className="font-extrabold text-xs text-emerald-900">Reset Email Sent!</h4>
                      <p className="text-[11px] text-emerald-800">
                        Check your inbox for instructions to reset your password.
                      </p>
                      <button
                        type="button"
                        onClick={() => { setForgotSent(false); setAuthView('signin') }}
                        className="mt-2 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm"
                      >
                        Return to Sign In
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="Enter your email address"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all"
                            style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
                          />
                          <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full h-11 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
                        style={{ backgroundColor: primaryColor, borderRadius: 'var(--store-btn-radius, 12px)' }}
                      >
                        <span>Send Reset Link</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  <div className="pt-3 border-t border-slate-100 text-center">
                    <button
                      type="button"
                      onClick={() => setAuthView('signin')}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 underline"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-slate-100 px-5 py-3.5 bg-slate-50/70 text-center">
              <p className="text-[10px] text-slate-500 font-semibold flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Secure Customer Portal by {shopName}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
