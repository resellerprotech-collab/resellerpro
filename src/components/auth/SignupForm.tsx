'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  ArrowRight,
  Check,
  Shield,
  Zap,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { signup } from '@/app/(auth)/signup/actions'

export default function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  })

  // Read referral code from query param (still passed to backend silently)
  const referralCode = searchParams.get('ref') || ''

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleBlur = (fieldId: string) => {
    setFocusedField(null)
    setTouchedFields(prev => new Set(prev).add(fieldId))
  }

  const isFieldValid = (fieldId: string): boolean => {
    if (!touchedFields.has(fieldId)) return true
    switch (fieldId) {
      case 'email': {
        const email = formData.email.trim()
        return email.length >= 5 && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      }
      case 'fullName': {
        const name = formData.fullName.trim()
        return name.length >= 2 && name.length <= 50
      }
      case 'password':
        return formData.password.length >= 8 && formData.password.length <= 72
      default:
        return true
    }
  }

  const validateAllFields = (): boolean => {
    setTouchedFields(new Set(['fullName', 'email', 'password']))
    const errors: string[] = []

    const name = formData.fullName.trim()
    if (!name) errors.push('Full name is required')
    else if (name.length < 2) errors.push('Name must be at least 2 characters')
    else if (name.length > 50) errors.push('Name must not exceed 50 characters')

    const email = formData.email.trim()
    if (!email) errors.push('Email is required')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Please enter a valid email address')

    if (!formData.password) errors.push('Password is required')
    else if (formData.password.length < 8) errors.push('Password must be at least 8 characters')
    else if (formData.password.length > 72) errors.push('Password must not exceed 72 characters')

    if (errors.length > 0) {
      toast({ title: 'Please check your details', description: errors[0], variant: 'destructive' })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateAllFields()) return
    setIsLoading(true)
    try {
      const fd = new FormData()
      fd.append('fullName', formData.fullName.trim())
      fd.append('email', formData.email.trim().toLowerCase())
      fd.append('password', formData.password)
      if (referralCode) fd.append('referralCode', referralCode.trim().toUpperCase())

      const result = await signup({ success: false, message: '' }, fd)

      if (!result.success) {
        toast({ title: 'Signup Failed', description: result.message, variant: 'destructive' })
        setIsLoading(false)
        return
      }

      toast({ title: '🎉 Account created!', description: "Let's set up your store." })

      setTimeout(() => {
        window.location.href = result.redirectUrl || '/onboarding'
      }, 300)
    } catch (error: any) {
      toast({ title: 'Signup Failed', description: error?.message || 'Unexpected error occurred.', variant: 'destructive' })
      setIsLoading(false)
    }
  }

  const fieldClass = (field: string) =>
    `pl-11 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/60 border transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
      focusedField === field
        ? 'border-blue-500 ring-4 ring-blue-500/10 bg-white dark:bg-slate-800'
        : !isFieldValid(field)
        ? 'border-rose-400 dark:border-rose-500/60'
        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
    }`

  const iconClass = (field: string) =>
    `absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors ${
      focusedField === field ? 'text-blue-500' : 'text-slate-400 dark:text-slate-500'
    }`

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-64 -left-64 w-[500px] h-[500px] bg-blue-400/15 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-64 w-[500px] h-[500px] bg-indigo-400/15 dark:bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute -bottom-64 left-1/3 w-[400px] h-[400px] bg-violet-400/15 dark:bg-violet-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* Main layout */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-10">
        <div className="w-full max-w-5xl">
          <div className="grid lg:grid-cols-[1fr_420px] gap-10 lg:gap-16 items-center">

            {/* ── Left: Pitch ─────────────────────────────── */}
            <div className="hidden lg:flex flex-col gap-8">
              {/* Logo / brand */}
              <div>
                <div className="inline-flex items-center gap-2.5 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">ResellerPro</span>
                </div>

                <h1 className="text-5xl xl:text-[56px] font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                  Launch your<br />
                  <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                    online store
                  </span>
                  <br />in minutes.
                </h1>
                <p className="mt-5 text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                  Built for Instagram sellers, dropshippers, clothing brands, and small businesses who want to sell smarter.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                {[
                  'Your own storefront link in 2 minutes',
                  'WhatsApp & Instagram ready catalog',
                  'Manage orders, inventory & customers',
                  'Free forever to start, upgrade when you grow',
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 text-[15px] font-medium">{b}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8">
                {[['50+', 'Sellers joined'], ['₹2L+', 'Orders managed'], ['4.8', 'User rating']].map(([val, label], i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{val}</div>
                    <div className="text-sm text-slate-500">{label}</div>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-5">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
                  "Was tracking orders in Excel sheets. Now everything is in one place. Super easy to use and saves me hours every week!"
                </p>
                <p className="text-sm text-slate-500 mt-3">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Arjun Nair</span> · Textile Reseller, Kochi
                </p>
              </div>
            </div>

            {/* ── Right: Sign Up Card ─────────────────────── */}
            <div className="w-full">
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/80 dark:border-slate-800/60 shadow-2xl shadow-blue-500/8 dark:shadow-none p-8">

                {/* Header */}
                <div className="mb-8">
                  {/* Mobile brand */}
                  <div className="lg:hidden flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">ResellerPro</span>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create your free account</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">No credit card required · Free forever</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className={`${iconClass('fullName')} w-4 h-4`} />
                      <Input
                        id="fullName"
                        placeholder="Your name"
                        className={fieldClass('fullName')}
                        value={formData.fullName}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('fullName')}
                        onBlur={() => handleBlur('fullName')}
                        autoComplete="name"
                        required
                        disabled={isLoading}
                        maxLength={50}
                      />
                    </div>
                    {touchedFields.has('fullName') && !isFieldValid('fullName') && (
                      <p className="text-xs text-rose-500">Please enter your full name (min 2 characters)</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className={`${iconClass('email')} w-4 h-4`} />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@email.com"
                        className={fieldClass('email')}
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => handleBlur('email')}
                        autoComplete="email"
                        required
                        disabled={isLoading}
                        maxLength={254}
                      />
                    </div>
                    {touchedFields.has('email') && !isFieldValid('email') && (
                      <p className="text-xs text-rose-500">Please enter a valid email address</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className={`${iconClass('password')} w-4 h-4`} />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimum 8 characters"
                        className={`${fieldClass('password')} pr-11`}
                        value={formData.password}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => handleBlur('password')}
                        autoComplete="new-password"
                        required
                        disabled={isLoading}
                        minLength={8}
                        maxLength={72}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {touchedFields.has('password') && !isFieldValid('password') && (
                      <p className="text-xs text-rose-500">Password must be at least 8 characters</p>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Creating account...</>
                    ) : (
                      <>Create Free Account <ArrowRight className="w-5 h-5 ml-2" /></>
                    )}
                  </Button>

                  {/* Terms disclaimer */}
                  <p className="text-center text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                    By creating an account you agree to our{' '}
                    <Link href="/terms-and-conditions" className="underline hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                      Terms
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy-policy" className="underline hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                      Privacy Policy
                    </Link>
                  </p>

                  {/* Sign in link */}
                  <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link href="/signin" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                      Sign In
                    </Link>
                  </p>
                </form>
              </div>

              {/* Trust badges */}
              <div className="mt-5 flex items-center justify-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Secure & encrypted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Instant access</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Free forever</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}