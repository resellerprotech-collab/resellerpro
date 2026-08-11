'use client'

import { useFormStatus, useFormState } from 'react-dom'
import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { login, type LoginFormState } from '@/app/(auth)/signin/actions'
import { sendLoginOtp, verifyLoginOtp } from '@/app/(auth)/signin/otp-actions'
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  ArrowLeft,
  ArrowRight,
  Shield,
  Zap,
  Check,
  TrendingUp,
  Target,
  Rocket
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/lib/toast'
import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus'

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  const isOnline = useOnlineStatus()

  return (
    <Button
      type="submit"
      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
      disabled={isLoading || !isOnline}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Signing in...
        </>
      ) : !isOnline ? (
        'Offline'
      ) : (
        <>
          Sign in
          <ArrowRight className="w-5 h-5 ml-2" />
        </>
      )}
    </Button>
  )
}

const quotes = [
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Your most unhappy customers are your greatest source of learning.", author: "Bill Gates" },
  { text: "Every sale has five basic obstacles: no need, no money, no hurry, no desire, no trust.", author: "Zig Ziglar" }
]

export default function LoginForm() {

  const searchParams = useSearchParams()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password')
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  const [quote, setQuote] = useState(quotes[0])

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }, [])

  const isRedirecting = useRef(false)

  // OTP State
  const [otpEmail, setOtpEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpStep, setOtpStep] = useState<'email' | 'verify'>('email')
  const [otpLoading, setOtpLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown(prev => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const isPending = document.querySelector('button[type="submit"]:disabled')
        if (!isPending && !isRedirecting.current) {
          const form = document.querySelector('form')
          if (form) {
            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
          }
        }
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [loginMethod, otpStep])

  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string[] | undefined>>({})
  const isOnline = useOnlineStatus()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleBlur = (fieldId: string) => {
    setFocusedField(null)
    setTouchedFields(prev => new Set(prev).add(fieldId))
  }

  const isFieldValid = (fieldId: string): boolean => {
    if (!touchedFields.has(fieldId)) return true

    switch (fieldId) {
      case 'email':
      case 'otp-email':
        const emailToCheck = fieldId === 'email' ? formData.email : otpEmail
        const email = emailToCheck.trim()
        return email.length >= 5 && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

      case 'password':
        return formData.password.length >= 8 && formData.password.length <= 72

      default:
        return true
    }
  }

  const performRedirect = useCallback((url: string) => {
    if (isRedirecting.current) return
    isRedirecting.current = true

    toast.success('Signed in', {
      description: 'Redirecting to dashboard...',
    })

    setTimeout(() => {
      window.location.href = url
    }, 100)
  }, [])

  useEffect(() => {
    const message = searchParams.get('message')
    if (message) {
      const isSuccess = message.toLowerCase().includes('success')
      if (isSuccess) {
        toast.success(message)
      } else {
        toast.error('Security alert', { description: message })
      }

      const url = new URL(window.location.href)
      url.searchParams.delete('message')
      window.history.replaceState({}, '', url.pathname + url.search)
    }

    if (searchParams.get('verified') === 'true') {
      toast.success('Email verified', {
        description: 'Your account is verified. Please sign in.',
      })
      const url = new URL(window.location.href)
      url.searchParams.delete('verified')
      window.history.replaceState({}, '', url.pathname + url.search)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isOnline) {
      toast.error('Offline', {
        description: 'Please check your internet connection and try again.',
      })
      return
    }

    if (isRedirecting.current) return

    setIsLoading(true)
    setFormErrors({})

    try {
      const fd = new FormData()
      fd.append('email', formData.email.trim().toLowerCase())
      fd.append('password', formData.password)

      const result = await login({ success: false, message: '' }, fd)

      if (result.success && result.redirectUrl) {
        performRedirect(result.redirectUrl)
      } else {
        setFormErrors(result.errors || {})
        toast.error('Unable to sign in', {
          description: result.message || 'Check your credentials and try again.',
        })
      }
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error('Unable to sign in', {
        description: error?.message || 'Something went wrong. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!isOnline) {
      toast.error('Offline', { description: 'Check your internet connection.' })
      return
    }
    const cleanEmail = otpEmail.trim().toLowerCase()
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      toast.error('Invalid email', { description: 'Please enter a valid email address.' })
      return
    }
    setOtpLoading(true)
    try {
      const res = await sendLoginOtp(cleanEmail)
      if (res.success) {
        toast.success('Verification code sent', { description: res.message })
        setOtpStep('verify')
        setResendCooldown(60)
      } else if ((res as any).notFound) {
        toast.error('Account not found', {
          description: res.message,
        })
      } else {
        toast.error('Unable to send code', { description: res.message })
      }
    } catch (error: any) {
      toast.error('Unable to send code', { description: error?.message || 'Please try again.' })
    } finally {
      setOtpLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isOnline) {
      toast.error('Offline', { description: 'Check your internet connection.' })
      return
    }
    if (!otpCode || otpCode.trim().length !== 6 || isRedirecting.current) {
      toast.error('Invalid code', { description: 'Please enter the 6-digit verification code.' })
      return
    }

    setOtpLoading(true)
    try {
      const res = await verifyLoginOtp(otpEmail.trim().toLowerCase(), otpCode.trim())
      if (res.success && res.redirectUrl) {
        performRedirect(res.redirectUrl)
      } else {
        toast.error('Verification failed', { description: res.message || 'Invalid or expired code.' })
        setOtpLoading(false)
      }
    } catch (error: any) {
      toast.error('Verification failed', { description: error?.message || 'Please try again.' })
      setOtpLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-white text-slate-900">
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">

            {/* Left Side */}
            <div className="hidden lg:flex flex-col justify-center items-center text-center px-2 space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-medium text-black">
                  {getGreeting()}
                </h1>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-blue-700">
                  Welcome back
                </h2>
              </div>

              <div className="max-w-sm space-y-2">
                <blockquote className="text-[12px] text-slate-700 italic leading-relaxed">
                  "{quote.text}"
                </blockquote>
                <p className="text-[8px] text-slate-500">
                  {quote.author}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <Rocket className="w-5 h-5 text-indigo-600" />
                </div>
              </div>

              <p className="text-xs text-slate-900">
                Ready to grow your business today?
              </p>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-5">
                {/* Header */}
                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">
                    {loginMethod === 'password' ? 'Sign in to your account' : 'Sign in with OTP'}
                  </h2>
                  <p className="text-xs text-slate-600">
                    {loginMethod === 'password'
                      ? 'Enter your credentials to continue'
                      : "We'll send a 6-digit verification code to your email"}
                  </p>
                </div>

                {loginMethod === 'password' ? (
                  <div className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Email Field */}
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'email' ? 'text-blue-600' : 'text-slate-400'
                            }`} />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@email.com"
                            className={`pl-9 h-10 text-xs sm:text-sm bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 transition-all ${focusedField === 'email'
                              ? 'border-blue-600 ring-2 ring-blue-600/10'
                              : 'hover:border-slate-300'
                              } ${formErrors.email ? 'border-rose-300' : ''}`}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => handleBlur('email')}
                            required
                            disabled={isLoading}
                          />
                          {touchedFields.has('email') && isFieldValid('email') && formData.email && (
                            <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                          )}
                        </div>
                        {formErrors.email && (
                          <p className="text-xs text-rose-500 mt-0.5">
                            {formErrors.email[0]}
                          </p>
                        )}
                      </div>

                      {/* Password Field */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                            Password
                          </Label>
                          <Link
                            href="/forgot-password"
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'password' ? 'text-blue-600' : 'text-slate-400'
                            }`} />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            className={`pl-9 pr-9 h-10 text-xs sm:text-sm bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 transition-all ${focusedField === 'password'
                              ? 'border-blue-600 ring-2 ring-blue-600/10'
                              : 'hover:border-slate-300'
                              } ${formErrors.password ? 'border-rose-300' : ''}`}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => handleBlur('password')}
                            required
                            minLength={8}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {formErrors.password && (
                          <p className="text-xs text-rose-500 mt-0.5">
                            {formErrors.password[0]}
                          </p>
                        )}
                      </div>

                      <SubmitButton isLoading={isLoading} />
                    </form>

                    {/* Divider */}
                    <div className="relative my-3">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-white text-slate-500">Or continue with</span>
                      </div>
                    </div>

                    {/* OTP Option */}
                    <Button
                      type="button"
                      className="w-full h-12 text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer"
                      onClick={() => setLoginMethod('otp')}
                    >
                      <Mail className="w-4 h-4 mr-2 text-white" />
                      Sign in with OTP
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Step indicator */}
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      <span>{otpStep === 'email' ? 'Step 1 of 2: Enter Email' : 'Step 2 of 2: Verification'}</span>
                      {otpStep === 'verify' && (
                        <span className="text-blue-600 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-500" /> Code Sent
                        </span>
                      )}
                    </div>

                    {otpStep === 'email' ? (
                      <form onSubmit={(e) => handleSendOtp(e)} className="space-y-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="otp-email" className="text-xs font-semibold text-slate-700">
                            Email Address
                          </Label>
                          <div className="relative">
                            <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'otp-email' ? 'text-blue-600' : 'text-slate-400'
                              }`} />
                            <Input
                              id="otp-email"
                              type="email"
                              placeholder="you@email.com"
                              className={`pl-9 h-10 text-xs sm:text-sm bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 transition-all ${focusedField === 'otp-email'
                                ? 'border-blue-600 ring-2 ring-blue-600/10'
                                : 'hover:border-slate-300'
                                }`}
                              value={otpEmail}
                              onChange={(e) => setOtpEmail(e.target.value)}
                              onFocus={() => setFocusedField('otp-email')}
                              onBlur={() => handleBlur('otp-email')}
                              required
                              disabled={otpLoading}
                            />
                            {touchedFields.has('otp-email') && isFieldValid('otp-email') && otpEmail && (
                              <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                            )}
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-10 text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer"
                          disabled={otpLoading || !isOnline}
                        >
                          {otpLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Sending code...
                            </>
                          ) : !isOnline ? (
                            'Offline'
                          ) : (
                            <>
                              Send OTP Code
                              <ArrowRight className="w-4 h-4 ml-1.5" />
                            </>
                          )}
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="space-y-2.5">
                          <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span className="text-xs text-slate-700 truncate font-medium">{otpEmail}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setOtpStep('email')
                                setOtpCode('')
                              }}
                              className="text-xs text-blue-600 hover:underline shrink-0 font-medium ml-2"
                            >
                              Change
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <Label htmlFor="otp-code" className="text-xs font-semibold text-slate-700">
                                Enter 6-Digit OTP Code
                              </Label>
                              {resendCooldown > 0 ? (
                                <span className="text-xs text-slate-400 font-mono">
                                  Resend in {resendCooldown}s
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSendOtp()}
                                  disabled={otpLoading}
                                  className="text-xs text-blue-600 hover:underline font-semibold"
                                >
                                  Resend Code
                                </button>
                              )}
                            </div>
                            <div className="relative">
                              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'otp-code' ? 'text-blue-600' : 'text-slate-400'
                                }`} />
                              <Input
                                id="otp-code"
                                type="text"
                                placeholder="123456"
                                className={`pl-9 h-10 text-center tracking-[0.3em] text-lg font-mono bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 transition-all ${focusedField === 'otp-code'
                                  ? 'border-blue-600 ring-2 ring-blue-600/10'
                                  : 'hover:border-slate-300'
                                  }`}
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                onFocus={() => setFocusedField('otp-code')}
                                onBlur={() => handleBlur('otp-code')}
                                required
                                maxLength={6}
                                disabled={otpLoading}
                                autoFocus
                              />
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Check your terminal log or email inbox for the 6-digit code.
                            </p>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-10 text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer"
                          disabled={otpLoading || otpCode.length !== 6 || !isOnline}
                        >
                          {otpLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Verifying...
                            </>
                          ) : !isOnline ? (
                            'Offline'
                          ) : (
                            <>
                              Verify & Sign In
                              <ArrowRight className="w-4 h-4 ml-1.5" />
                            </>
                          )}
                        </Button>
                      </form>
                    )}

                    <Button
                      variant="ghost"
                      className="w-full h-9 text-xs hover:bg-slate-50 text-slate-600"
                      onClick={() => {
                        setLoginMethod('password')
                        setOtpStep('email')
                        setOtpEmail('')
                        setOtpCode('')
                      }}
                    >
                      <ArrowLeft className="w-4 h-4 mr-1.5" />
                      Back to password login
                    </Button>
                  </div>
                )}

                {/* Sign Up Link */}
                <div className="mt-5 pt-4 border-t border-slate-200">
                  <p className="text-center text-xs text-slate-600">
                    Don't have an account?{' '}
                    <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                      Sign up for free
                    </Link>
                  </p>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="mt-4 flex items-center justify-center gap-5 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Secure login</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Quick access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}