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
  Phone,
  ArrowRight,
  Check,
  Shield,
  Zap,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/lib/toast'
import { signup } from '@/app/(auth)/signup/actions'

export default function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()


  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
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
      case 'phone': {
        const phone = formData.phone.trim()
        return /^[6-9]\d{9}$/.test(phone)
      }
      case 'password':
        return formData.password.length >= 8 && formData.password.length <= 72
      default:
        return true
    }
  }

  const validateAllFields = (): boolean => {
    setTouchedFields(new Set(['fullName', 'email', 'phone', 'password']))
    const errors: string[] = []

    const name = formData.fullName.trim()
    if (!name) errors.push('Full name is required')
    else if (name.length < 2) errors.push('Name must be at least 2 characters')
    else if (name.length > 50) errors.push('Name must not exceed 50 characters')

    const email = formData.email.trim()
    if (!email) errors.push('Email is required')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Please enter a valid email address')

    const phone = formData.phone.trim()
    if (!phone) errors.push('Phone number is required')
    else if (!/^[6-9]\d{9}$/.test(phone)) errors.push('Please enter a valid 10-digit mobile number')

    if (!formData.password) errors.push('Password is required')
    else if (formData.password.length < 8) errors.push('Password must be at least 8 characters')
    else if (formData.password.length > 72) errors.push('Password must not exceed 72 characters')

    if (errors.length > 0) {
      toast.error('Check your details', { description: errors[0] })
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
      fd.append('phone', formData.phone.trim())
      fd.append('password', formData.password)
      if (referralCode) fd.append('referralCode', referralCode.trim().toUpperCase())

      const result = await signup({ success: false, message: '' }, fd)

      if (!result.success) {
        toast.error('Unable to create account', { description: result.message })
        setIsLoading(false)
        return
      }

      toast.success('Account created', { description: "Setting up your store..." })

      setTimeout(() => {
        window.location.href = result.redirectUrl || '/onboarding'
      }, 300)
    } catch (error: any) {
      toast.error('Unable to create account', { description: error?.message || 'Something went wrong.' })
      setIsLoading(false)
    }
  }

  const fieldClass = (field: string) =>
    `pl-9 h-10 text-xs sm:text-sm rounded-xl bg-white border transition-all text-slate-900 placeholder:text-slate-400 ${focusedField === field
      ? 'border-blue-600 ring-2 ring-blue-600/10'
      : !isFieldValid(field)
        ? 'border-rose-400'
        : 'border-slate-200 hover:border-slate-300'
    }`

  const iconClass = (field: string) =>
    `absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === field ? 'text-blue-600' : 'text-slate-400'
    }`

  return (
    <div className="min-h-screen relative overflow-hidden bg-white text-slate-900">
      {/* Spreading Blue Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-[450px] h-[450px] bg-indigo-500/15 rounded-full blur-[100px]" style={{ animationDelay: '1.5s' }} />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px]" />
      </div>

      {/* Main layout */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-6 sm:py-4">
        <div className="w-full max-w-4xl">
          <div className="grid lg:grid-cols-[1fr_400px] gap-6 lg:gap-10 items-center">

            {/* ── Left: Pitch ─────────────────────────────── */}
            <div className="hidden lg:flex flex-col gap-6">
              {/* Logo / brand */}
              <div>
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="text-xl font-bold text-slate-900">ResellerPro</span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-black">
                  Launch your online store <br />
                  <span className="text-blue-700">in minutes</span>
                </h1>
                <p className="mt-3 text-xs text-slate-600 leading-relaxed max-w-md">
                  Built for Instagram sellers, dropshippers, clothing brands, and small businesses who want to sell smarter.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                {[
                  'Your own storefront link in 2 minutes',
                  'WhatsApp & Instagram ready catalog',
                  'Manage orders, inventory & customers',
                  'Free forever to start, upgrade when you grow',
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-slate-700 text-xs font-medium">{b}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                {[['50+', 'Sellers joined'], ['₹2L+', 'Orders managed'], ['4.8', 'User rating']].map(([val, label], i) => (
                  <div key={i}>
                    <div className="text-xl font-bold text-slate-900">{val}</div>
                    <div className="text-xs text-slate-500">{label}</div>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-700 text-xs leading-relaxed">
                  "Was tracking orders in Excel sheets. Now everything is in one place. Super easy to use and saves me hours every week!"
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  <span className="font-semibold text-slate-900">Arjun Nair</span> · Textile Reseller, Kochi
                </p>
              </div>
            </div>

            {/* ── Right: Sign Up Card ─────────────────────── */}
            <div className="w-full">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-7">

                {/* Header */}
                <div className="mb-5">
                  {/* Mobile brand */}
                  <div className="lg:hidden flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-slate-900">ResellerPro</span>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900">Create your free account</h2>
                  <p className="text-slate-600 mt-1 text-xs">No credit card required · Free forever</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>

                  {/* Full Name */}
                  <div className="space-y-1">
                    <Label htmlFor="fullName" className="text-xs font-semibold text-slate-700">
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
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
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

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className={`${iconClass('phone')} w-4 h-4`} />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="10-digit mobile number"
                        className={fieldClass('phone')}
                        value={formData.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '')
                          if (val.length <= 10) {
                            setFormData(prev => ({ ...prev, phone: val }))
                          }
                        }}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => handleBlur('phone')}
                        autoComplete="tel"
                        required
                        disabled={isLoading}
                        maxLength={10}
                      />
                    </div>
                    {touchedFields.has('phone') && !isFieldValid('phone') && (
                      <p className="text-xs text-rose-500">Please enter a valid 10-digit mobile number</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className={`${iconClass('password')} w-4 h-4`} />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimum 8 characters"
                        className={`${fieldClass('password')} pr-9`}
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
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
                    className="w-full h-10 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 mt-1 cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating account...</>
                    ) : (
                      <>Create Free Account <ArrowRight className="w-4 h-4 ml-1.5" /></>
                    )}
                  </Button>

                  {/* Terms disclaimer */}
                  <p className="text-center text-[11px] text-slate-500 whitespace-nowrap">
                    By creating an account you agree to our{' '}
                    <Link href="/terms-and-conditions" className="underline hover:text-slate-700 transition-colors">
                      Terms
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy-policy" className="underline hover:text-slate-700 transition-colors">
                      Privacy Policy
                    </Link>
                  </p>

                  {/* Sign in link */}
                  <p className="text-center text-xs text-slate-600">
                    Already have an account?{' '}
                    <Link href="/signin" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                      Sign In
                    </Link>
                  </p>
                </form>
              </div>

              {/* Trust badges */}
              <div className="mt-4 flex items-center justify-center gap-5 text-xs text-slate-500">
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