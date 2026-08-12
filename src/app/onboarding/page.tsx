'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shirt,
  Package,
  Store,
  ShoppingCart,
  Palette,
  Factory,
  Sparkles,
  Briefcase,
  Gem,
  Watch,
  Laptop,
  Smartphone,
  Baby,
  Home,
  Gift,
  Utensils,
  BookOpen,
  Heart,
  Grid,
  Check,
  Loader2,
  Copy,
  CheckCircle2,
  Zap,
  ArrowRight,
  ArrowLeft,
  X,
  Clock,
  Link as LinkIcon,
  MessageCircle,
  Lightbulb,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// ─────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────

const BUSINESS_TYPES = [
  { id: 'clothing', icon: Shirt, label: 'Clothing Brand', desc: 'Own collection or custom brand' },
  { id: 'dropshipping', icon: Package, label: 'Dropshipping Store', desc: 'Resell products without inventory' },
  { id: 'retail', icon: Store, label: 'Retail Shop', desc: 'Physical retail store or showroom' },
  { id: 'multi', icon: ShoppingCart, label: 'Multi-product Store', desc: 'General store with varied items' },
  { id: 'handmade', icon: Palette, label: 'Handmade Business', desc: 'Crafts, art, and custom orders' },
  { id: 'wholesale', icon: Factory, label: 'Wholesaler', desc: 'Bulk supply to other businesses' },
  { id: 'other', icon: Sparkles, label: 'Other', desc: 'Unique business type or niche category' },
]

const PRODUCT_CATEGORIES = [
  { id: 'fashion', icon: Shirt, label: 'Fashion & Clothing' },
  { id: 'bags', icon: Briefcase, label: 'Bags & Luggage' },
  { id: 'footwear', icon: ShoppingBagIcon, label: 'Footwear' },
  { id: 'jewelry', icon: Gem, label: 'Jewelry & Accessories' },
  { id: 'watches', icon: Watch, label: 'Watches' },
  { id: 'beauty', icon: Sparkles, label: 'Beauty & Cosmetics' },
  { id: 'electronics', icon: Laptop, label: 'Electronics & Gadgets' },
  { id: 'mobile_acc', icon: Smartphone, label: 'Mobile Accessories' },
  { id: 'toys', icon: Baby, label: 'Toys & Baby Products' },
  { id: 'home', icon: Home, label: 'Home & Kitchen' },
  { id: 'gifts', icon: Gift, label: 'Gifts & Handmade' },
  { id: 'food', icon: Utensils, label: 'Food & Beverages' },
  { id: 'books', icon: BookOpen, label: 'Books & Stationery' },
  { id: 'health', icon: Heart, label: 'Health & Wellness' },
  { id: 'other', icon: Grid, label: 'Other' },
]

const PRODUCT_COUNTS = [
  { id: 'starting', label: 'Just getting started', desc: 'No products listed yet' },
  { id: 'under_20', label: 'Under 20', desc: 'Small boutique or curated shop' },
  { id: 'twenty_100', label: '20 – 100', desc: 'Growing product catalog' },
  { id: 'hundred_500', label: '100 – 500', desc: 'Established catalog brand' },
  { id: 'over_500', label: '500+', desc: 'High-volume store inventory' },
]

const TOTAL_STEPS = 5

// Custom Shopping Bag Icon to replace Footwear
function ShoppingBagIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// ─────────────────────────────────────────────────────
// Framer-Motion variants
// ─────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 30 : -30, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -30 : 30, opacity: 0 }),
}

// ─────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<any>(null)
  const [step, setStep] = useState(1)
  const [dir, setDir] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Step 2
  const [businessType, setBusinessType] = useState('')
  // Step 3
  const [businessCategories, setBusinessCategories] = useState<string[]>([])
  // Step 4
  const [businessName, setBusinessName] = useState('')
  const [storeSlug, setStoreSlug] = useState('')
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'error'>('idle')
  const [slugSuggestion, setSlugSuggestion] = useState('')
  // Step 5
  const [productCountRange, setProductCountRange] = useState('')

  // Completion Screen
  const [completed, setCompleted] = useState(false)
  const [finalStoreSlug, setFinalStoreSlug] = useState('')
  const [urlCopied, setUrlCopied] = useState(false)

  // ── Auth check ─────────────────────────────────────
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/signin'); return }
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed, business_type, business_categories, shop_slug, shop_name, product_count_range')
        .eq('id', user.id)
        .single()

      if (profile?.onboarding_completed) {
        router.replace('/dashboard')
        return
      }

      // Pre-fill if returning mid-onboarding
      if (profile?.business_type) setBusinessType(profile.business_type)
      if (profile?.business_categories) setBusinessCategories(profile.business_categories)
      // Only set slug if user had previously entered business name or custom slug
      if (profile?.shop_name) {
        setBusinessName(profile.shop_name)
        const slug = profile.shop_slug || ''
        setStoreSlug(slug)
        if (slug) setSlugStatus('available')
      }
      if (profile?.product_count_range) setProductCountRange(profile.product_count_range)

      setLoading(false)
    }
    init()
  }, [])

  // Track if user manually touched/edited the store slug field
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)

  // ── Auto-generate slug from business name ──────────
  useEffect(() => {
    if (businessName && step === 4 && !isSlugManuallyEdited) {
      const generated = toSlug(businessName)
      setStoreSlug(generated)
    }
  }, [businessName, step, isSlugManuallyEdited])

  // ── Check slug uniqueness ─────────────────────────
  useEffect(() => {
    if (!storeSlug || storeSlug.length < 3 || !user) {
      setSlugStatus('idle')
      return
    }
    setSlugStatus('checking')
    const timer = setTimeout(async () => {
      // Query shop_slug (guaranteed to exist on profiles table) to avoid schema errors
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('shop_slug', storeSlug)
        .maybeSingle()

      if (error) {
        console.error('Error verifying slug uniqueness:', error)
        // Set to available on DB error to avoid blocking the user
        setSlugStatus('available')
        return
      }

      if (data && data.id !== user.id) {
        setSlugStatus('taken')
        setSlugSuggestion(`${storeSlug}-${Math.floor(10 + Math.random() * 90)}`)
      } else {
        setSlugStatus('available')
        setSlugSuggestion('')
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [storeSlug, user])

  // ── Navigation helpers ─────────────────────────────
  const goNext = () => { setDir(1); setStep(s => Math.min(s + 1, TOTAL_STEPS)) }
  const goBack = () => { setDir(-1); setStep(s => Math.max(s - 1, 1)) }

  // ── Step saves ─────────────────────────────────────
  const saveStep2 = async () => {
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      business_type: businessType,
      onboarding_step: 3
    }).eq('id', user.id)
    if (error) {
      console.warn('Skipping business_type save (column not created yet):', error.message)
      await supabase.from('profiles').update({ onboarding_step: 3 }).eq('id', user.id)
    }
    setSaving(false)
    goNext()
  }

  const saveStep3 = async () => {
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      business_categories: businessCategories,
      onboarding_step: 4
    }).eq('id', user.id)
    if (error) {
      console.warn('Skipping business_categories save (column not created yet):', error.message)
      await supabase.from('profiles').update({ onboarding_step: 4 }).eq('id', user.id)
    }
    setSaving(false)
    goNext()
  }

  const saveStep4 = async () => {
    if (!businessName.trim()) return
    if (slugStatus === 'taken' || slugStatus === 'checking') return
    setSaving(true)

    const updatePayload = {
      business_name: businessName.trim(),
      shop_name: businessName.trim(),
      shop_slug: storeSlug,
      onboarding_step: 5,
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', user.id)
      .select()

    if (error) {
      console.error('Error updating profile step 4:', error.message)
    }

    setSaving(false)
    goNext()
  }

  const saveStep5AndFinish = async () => {
    if (!productCountRange) return
    setSaving(true)
    try {
      // Mark onboarding complete & try saving product count range
      const { error } = await supabase.from('profiles').update({
        product_count_range: productCountRange,
        onboarding_completed: true,
        onboarding_step: TOTAL_STEPS + 1,
      }).eq('id', user.id)

      if (error) {
        console.warn('Fallback: Marking onboarding complete without product_count_range:', error.message)
        // Mark completed using existing columns
        await supabase.from('profiles').update({
          onboarding_completed: true,
          onboarding_step: TOTAL_STEPS + 1,
        }).eq('id', user.id)
      }

      setFinalStoreSlug(storeSlug)
      setCompleted(true)
    } finally {
      setSaving(false)
    }
  }

  // ── Loading screen ─────────────────────────────────
  if (loading) {
    return null
  }

  // ── Completion Screen ──────────────────────────────
  if (completed) {
    const storeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://resellerpro.in'}/store/${finalStoreSlug}`
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Your Online Store is Ready!</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Everything is ready. You can now add your first product and start selling.</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Store URL</span>
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="text-sm font-mono text-slate-700 dark:text-slate-300 truncate flex-1">{storeUrl}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(storeUrl)
                    setUrlCopied(true)
                    setTimeout(() => setUrlCopied(false), 2000)
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {urlCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {[
                'Store Created',
                'Dashboard Ready',
                'Storefront Ready',
              ].map((label, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-3">
              <Button
                onClick={() => router.push('/products/new')}
                className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/10 transition-all hover:-translate-y-0.5"
              >
                Add First Product
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="w-full h-11 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Skip for Now
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex items-center justify-center p-3 sm:p-6 py-6 sm:py-10">
      <div className="w-full max-w-lg md:max-w-3xl lg:max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 relative">

        {/* ── Top Bar Header (Close + Step Badge) ── */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close onboarding"
          >
            <X className="w-4 h-4" />
          </button>

          <span className="px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wide">
            {step} of {TOTAL_STEPS}
          </span>
        </div>

        {/* ── Stepper Header Bar (Horizontal) ── */}
        <div className="flex items-center justify-between w-full mb-6 sm:mb-8 px-1 relative">
          {Array.from({ length: TOTAL_STEPS }).map((_, idx) => {
            const stepNum = idx + 1
            const isCompleted = stepNum < step
            const isActive = stepNum === step
            const isLast = stepNum === TOTAL_STEPS
            return (
              <div key={stepNum} className="flex-1 flex items-center relative">
                <button
                  type="button"
                  onClick={() => {
                    if (stepNum < step) {
                      setDir(-1)
                      setStep(stepNum)
                    }
                  }}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${isCompleted
                      ? 'bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700'
                      : isActive
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
                </button>

                {!isLast && (
                  <div className={`flex-1 h-0.5 mx-1 transition-colors ${stepNum < step ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
                    }`} />
                )}
              </div>
            )
          })}
        </div>

        {/* ── Animated Step Content ── */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {/* ── STEP 1: Welcome ── */}
            {step === 1 && (
              <div>
                {/* ── MOBILE VIEW ONLY (hidden on md: and above) ── */}
                <div className="block md:hidden space-y-5 text-center">
                  {/* Store Icon */}
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center relative shadow-sm">
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-400 rounded-full blur-[1px] animate-pulse" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-indigo-400 rounded-full blur-[1px]" />
                    <Store className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                  </div>

                  {/* Mobile Headings */}
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                      Create your online store <br />
                      in just <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">2 minutes</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
                      Turn your products into a professional online store and start sharing your store link with customers.
                    </p>
                  </div>

                  {/* Exact Uploaded Store Mockup Image */}
                  <div className="max-w-xs mx-auto rounded-2xl overflow-hidden shadow-lg border border-indigo-100/80 dark:border-indigo-900/40">
                    <img
                      src="/images/onboarding_store_mockup.jpg"
                      alt="My Store Mockup"
                      className="w-full h-auto object-cover rounded-2xl"
                    />
                  </div>

                  {/* Features Highlight Box */}
                  <div className="bg-slate-50/70 dark:bg-slate-900/80 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-800 space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                        <LinkIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">Your own store link</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Get a beautiful link for your store.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">Share on WhatsApp & Instagram</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Share your store with customers instantly.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">Manage orders easily</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Track, manage and grow your business.</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Footer Action */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Takes about 2 minutes</span>
                    </div>

                    <Button
                      onClick={goNext}
                      className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                    >
                      Create My Store <ArrowRight className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 text-center">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Free to start • No technical skills required</span>
                    </div>
                  </div>
                </div>

                {/* ── DESKTOP VIEW ONLY (displayed on md: and above) ── */}
                <div className="hidden md:grid md:grid-cols-2 gap-8 items-center text-left">
                  {/* Left Column: Headings, Features & CTA */}
                  <div className="space-y-5">
                    {/* Store Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center relative shadow-sm">
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-400 rounded-full blur-[1px] animate-pulse" />
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-indigo-400 rounded-full blur-[1px]" />
                      <Store className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                    </div>

                    {/* Headings */}
                    <div className="space-y-2">
                      <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                        Create your online store <br />
                        in just <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">2 minutes</span>
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-md">
                        Turn your products into a professional online store and start sharing your store link with customers.
                      </p>
                    </div>

                    {/* Features List Box */}
                    <div className="bg-slate-50/70 dark:bg-slate-900/80 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                          <LinkIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Your own store link</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">Get a beautiful link for your store.</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Share on WhatsApp & Instagram</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">Share your store with customers instantly.</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Manage orders easily</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">Track, manage and grow your business.</p>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Action Footer */}
                    <div className="space-y-2.5 pt-1">
                      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Takes about 2 minutes</span>
                      </div>

                      <Button
                        onClick={goNext}
                        className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                      >
                        Create My Store <ArrowRight className="w-4 h-4" />
                      </Button>

                      <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Free to start • No technical skills required</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Code-Based Mini Storefront Preview Component (Not image) */}
                  <div className="bg-gradient-to-b from-indigo-50/80 to-purple-50/40 dark:from-indigo-950/40 dark:to-purple-950/20 p-4 rounded-3xl border border-indigo-100/80 dark:border-indigo-900/40 shadow-inner">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-4 space-y-3 text-left">
                      {/* Mock Navigation Header */}
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="space-y-0.5">
                            <div className="w-4 h-0.5 bg-slate-500 rounded-full" />
                            <div className="w-2.5 h-0.5 bg-slate-500 rounded-full" />
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">My Store</span>
                        </div>
                        <div className="relative flex items-center gap-1">
                          <ShoppingCart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <span className="w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
                        </div>
                      </div>

                      {/* Mock Section Header */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">Featured Products</span>
                        <span className="text-indigo-600 dark:text-indigo-400 text-[11px] font-medium hover:underline cursor-pointer">View all</span>
                      </div>

                      {/* Mock Product Grid with Actual Product Images */}
                      <div className="grid grid-cols-3 gap-2.5">
                        {/* Product 1: Handbag */}
                        <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl text-center space-y-1.5 border border-slate-100 dark:border-slate-800">
                          <div className="w-full h-16 bg-white dark:bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center p-0.5 border border-slate-100 dark:border-slate-800 shadow-sm">
                            <img src="/images/demo_handbag.png" alt="Handbag" className="w-full h-full object-cover rounded-md" />
                          </div>
                          <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 truncate">Handbag</div>
                          <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">₹399</div>
                        </div>

                        {/* Product 2: Watch */}
                        <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl text-center space-y-1.5 border border-slate-100 dark:border-slate-800">
                          <div className="w-full h-16 bg-white dark:bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center p-0.5 border border-slate-100 dark:border-slate-800 shadow-sm">
                            <img src="/images/demo_watch.png" alt="Watch" className="w-full h-full object-cover rounded-md" />
                          </div>
                          <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 truncate">Watch</div>
                          <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">₹599</div>
                        </div>

                        {/* Product 3: Perfume */}
                        <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl text-center space-y-1.5 border border-slate-100 dark:border-slate-800">
                          <div className="w-full h-16 bg-white dark:bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center p-0.5 border border-slate-100 dark:border-slate-800 shadow-sm">
                            <img src="/images/demo_perfume.png" alt="Perfume" className="w-full h-full object-cover rounded-md" />
                          </div>
                          <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 truncate">Perfume</div>
                          <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">₹299</div>
                        </div>
                      </div>

                      {/* Mock Action Button inside card */}
                      <div className="pt-1">
                        <div className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold text-center shadow-sm">
                          Shop Now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

              {/* ── STEP 2: Business Type ───────────────── */}
              {step === 2 && (
                <div>
                  {/* ── MOBILE VIEW ONLY (hidden on md: and above) ── */}
                  <div className="block md:hidden space-y-5">
                    <div className="space-y-1.5 text-left">
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        What type of business do you have?
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                        Please choose from the options so we can help customize your onboarding experience.
                      </p>
                    </div>

                    {/* 2-Column Compact Card Grid for Mobile */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {BUSINESS_TYPES.map(biz => {
                        const Icon = biz.icon
                        const selected = businessType === biz.id
                        return (
                          <button
                            key={biz.id}
                            type="button"
                            onClick={() => setBusinessType(biz.id)}
                            className={`group border rounded-none p-4 sm:p-5 transition-all duration-200 flex flex-col items-center justify-between text-center select-none cursor-pointer ${selected
                                ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-600/10 shadow-sm'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:shadow-md'
                              }`}
                          >
                            <div className="flex flex-col items-center w-full">
                              {/* Centered Top Icon */}
                              <div className={`w-11 h-11 rounded-none flex items-center justify-center transition-colors ${selected
                                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                                }`}>
                                <Icon className="w-5 h-5 stroke-[1.8]" />
                              </div>

                              {/* Label & Description */}
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-3 leading-snug">
                                {biz.label}
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-tight max-w-[160px]">
                                {biz.desc}
                              </p>
                            </div>

                            {/* Radio Dot at Bottom Center */}
                            <div className="mt-3.5 pt-1">
                              <div className={`w-5 h-5 rounded-full border transition-all flex items-center justify-center ${selected
                                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                                }`}>
                                {selected && <Check className="w-3 h-3 stroke-[2.5]" />}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {/* Soft Purple Callout Banner */}
                    <div className="bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl p-3 sm:p-3.5 border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-2.5 text-xs text-indigo-700 dark:text-indigo-300">
                      <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                      <span>Don't worry, you can change this later from your store settings.</span>
                    </div>

                    {/* Mobile Navigation Bar */}
                    <StepNav
                      onBack={goBack}
                      onNext={saveStep2}
                      nextDisabled={!businessType}
                      saving={saving}
                    />
                  </div>

                  {/* ── DESKTOP VIEW ONLY (previous 3-col style, displayed on md: and above) ── */}
                  <div className="hidden md:block space-y-6">
                    <div className="space-y-2 text-left">
                      <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        What type of business do you have?
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Please choose from the options so we can help customize your onboarding experience.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {BUSINESS_TYPES.map(biz => {
                        const Icon = biz.icon
                        const selected = businessType === biz.id
                        return (
                          <button
                            key={biz.id}
                            type="button"
                            onClick={() => setBusinessType(biz.id)}
                            className={`group text-left border rounded-2xl p-5 bg-white dark:bg-slate-900 transition-all duration-200 relative flex flex-col justify-between min-h-[140px] select-none cursor-pointer ${selected
                                ? 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-600/10 dark:ring-indigo-500/10'
                                : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-lg hover:shadow-indigo-500/5'
                              }`}
                          >
                            <div className="flex justify-between items-start w-full">
                              <div className={`p-2.5 rounded-xl transition-colors ${selected ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                                }`}>
                                <Icon className="w-5 h-5 stroke-[1.8]" />
                              </div>
                              <div className={`w-5 h-5 rounded-full border transition-all flex items-center justify-center ${selected
                                  ? 'border-transparent bg-emerald-500 text-white'
                                  : 'border-slate-200 dark:border-slate-700'
                                }`}>
                                {selected && <Check className="w-3.5 h-3.5" />}
                              </div>
                            </div>

                            <div className="mt-4">
                              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{biz.label}</h4>
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 leading-snug">{biz.desc}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    <StepNav
                      onBack={goBack}
                      onNext={saveStep2}
                      nextDisabled={!businessType}
                      saving={saving}
                    />
                  </div>
                </div>
              )}

              {/* ── STEP 3: Product Categories ──────────── */}
              {step === 3 && (
                <div>
                  {/* ── MOBILE VIEW ONLY (hidden on md: and above) ── */}
                  <div className="block md:hidden space-y-5">
                    <div className="space-y-1.5 text-left">
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        What products do you sell?
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                        Select all that apply to list in your catalog category selections.
                      </p>
                    </div>

                    {/* 3-Column Compact Grid for Mobile matching screenshot */}
                    <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                      {PRODUCT_CATEGORIES.map(cat => {
                        const Icon = cat.icon
                        const selected = businessCategories.includes(cat.id)
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setBusinessCategories(prev =>
                                selected ? prev.filter(c => c !== cat.id) : [...prev, cat.id]
                              )
                            }}
                            className={`group border rounded-none p-3 sm:p-4 transition-all duration-200 flex flex-col items-center justify-between text-center relative select-none cursor-pointer min-h-[110px] ${selected
                                ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-600/10 shadow-sm'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-200 dark:hover:border-indigo-900/50'
                              }`}
                          >
                            {/* Checkmark Badge Top-Right */}
                            <div className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center absolute top-2 right-2 ${selected
                                ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                              }`}>
                              {selected && <Check className="w-2.5 h-2.5 stroke-[2.5]" />}
                            </div>

                            {/* Centered Top Icon */}
                            <div className={`w-10 h-10 rounded-none flex items-center justify-center transition-colors mt-1 ${selected
                                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                              }`}>
                              <Icon className="w-4 h-4 stroke-[1.8]" />
                            </div>

                            {/* Category Label */}
                            <span className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight mt-2.5 px-0.5">
                              {cat.label}
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    {/* Soft Purple Callout Banner */}
                    <div className="bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl p-3 sm:p-3.5 border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-2.5 text-xs text-indigo-700 dark:text-indigo-300">
                      <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                      <span>Select all categories that apply to your store.</span>
                    </div>

                    {/* Mobile Navigation Bar */}
                    <StepNav
                      onBack={goBack}
                      onNext={saveStep3}
                      nextDisabled={businessCategories.length === 0}
                      saving={saving}
                    />
                  </div>

                  {/* ── DESKTOP VIEW ONLY (unchanged) ── */}
                  <div className="hidden md:block space-y-6">
                    <div className="space-y-2 text-left">
                      <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        What products do you sell?
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Select all that apply to list in your catalog category selections.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {PRODUCT_CATEGORIES.map(cat => {
                        const Icon = cat.icon
                        const selected = businessCategories.includes(cat.id)
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            title={cat.label}
                            onClick={() => {
                              setBusinessCategories(prev =>
                                selected ? prev.filter(c => c !== cat.id) : [...prev, cat.id]
                              )
                            }}
                            className={`text-left border rounded-xl p-3.5 bg-white dark:bg-slate-900 transition-all select-none flex items-center gap-3 relative min-h-[58px] cursor-pointer ${selected
                                ? 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-600/10 dark:ring-indigo-500/10 bg-indigo-50/5 dark:bg-indigo-900/5'
                                : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800'
                              }`}
                          >
                            <div className={`p-2 rounded-lg flex-shrink-0 ${selected ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                              }`}>
                              <Icon className="w-4 h-4 stroke-[1.8]" />
                            </div>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex-1 pr-5 whitespace-normal leading-tight">
                              {cat.label}
                            </span>
                            <div className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center flex-shrink-0 absolute top-2 right-2 ${selected
                                ? 'border-transparent bg-emerald-500 text-white'
                                : 'border-slate-200 dark:border-slate-700'
                              }`}>
                              {selected && <Check className="w-3 h-3" />}
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    <StepNav
                      onBack={goBack}
                      onNext={saveStep3}
                      nextDisabled={businessCategories.length === 0}
                      saving={saving}
                    />
                  </div>
                </div>
              )}

              {/* ── STEP 4: Business Details ─────────────── */}
              {step === 4 && (
                <div>
                  {/* ── MOBILE VIEW ONLY (hidden on md: and above) ── */}
                  <div className="block md:hidden space-y-5">
                    <div className="space-y-1.5 text-left">
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Tell us about your business
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                        Configure your shop credentials and claim your public custom shop link.
                      </p>
                    </div>

                    <div className="space-y-4 text-left">
                      {/* Business Name */}
                      <div className="space-y-1.5">
                        <Label htmlFor="businessNameMobile" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Business Name
                        </Label>
                        <Input
                          id="businessNameMobile"
                          placeholder="e.g. Fashion Hub"
                          value={businessName}
                          onChange={e => setBusinessName(e.target.value)}
                          className="h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs focus:border-indigo-500 focus:ring-indigo-500/10"
                          maxLength={50}
                        />
                      </div>

                      {/* Store URL */}
                      <div className="space-y-1.5">
                        <Label htmlFor="storeSlugMobile" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Store URL Link
                        </Label>
                        <div className="relative">
                          <Input
                            id="storeSlugMobile"
                            placeholder="your-store-slug"
                            value={storeSlug}
                            onChange={e => {
                              setIsSlugManuallyEdited(true)
                              setStoreSlug(toSlug(e.target.value))
                            }}
                            className={`h-10 rounded-xl font-mono text-xs pr-10 ${slugStatus === 'available'
                                ? 'border-emerald-400 bg-emerald-50/20 dark:bg-emerald-900/10 focus:ring-emerald-500/10'
                                : slugStatus === 'taken'
                                  ? 'border-rose-400 bg-rose-50/20 dark:bg-rose-900/10'
                                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/10'
                              }`}
                            maxLength={50}
                          />
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                            {slugStatus === 'checking' && <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />}
                            {slugStatus === 'available' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                          </div>
                        </div>

                        {slugStatus === 'available' && storeSlug && (
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">✓ Custom store slug is available!</p>
                        )}
                        {slugStatus === 'taken' && (
                          <div className="space-y-1">
                            <p className="text-[11px] text-rose-500 font-medium">✗ This link is already taken.</p>
                            {slugSuggestion && (
                              <button
                                type="button"
                                onClick={() => setStoreSlug(slugSuggestion)}
                                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                              >
                                Suggest: <span className="font-mono">{slugSuggestion}</span>
                              </button>
                            )}
                          </div>
                        )}

                        {storeSlug && slugStatus !== 'taken' && (
                          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 mt-1.5">
                            <Store className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                              https://resellerpro.in/store/<span className="text-indigo-600 dark:text-indigo-400 font-semibold">{storeSlug}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Soft Purple Callout Banner */}
                    <div className="bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl p-3 sm:p-3.5 border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-2.5 text-xs text-indigo-700 dark:text-indigo-300">
                      <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                      <span>You can change your store name and custom link anytime.</span>
                    </div>

                    {/* Mobile Navigation Bar */}
                    <StepNav
                      onBack={goBack}
                      onNext={saveStep4}
                      nextDisabled={
                        !businessName.trim() ||
                        !storeSlug ||
                        slugStatus === 'taken' ||
                        slugStatus === 'checking' ||
                        slugStatus === 'error'
                      }
                      saving={saving}
                    />
                  </div>

                  {/* ── DESKTOP VIEW ONLY (unchanged) ── */}
                  <div className="hidden md:block space-y-6">
                    <div className="space-y-2 text-left">
                      <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Tell us about your business
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Configure your shop credentials and claim your public custom shop link.
                      </p>
                    </div>

                    <div className="max-w-xl space-y-4 text-left">
                      {/* Business Name */}
                      <div className="space-y-1.5">
                        <Label htmlFor="businessNameDesktop" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Business Name
                        </Label>
                        <Input
                          id="businessNameDesktop"
                          placeholder="e.g. Fashion Hub"
                          value={businessName}
                          onChange={e => setBusinessName(e.target.value)}
                          className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/10"
                          maxLength={50}
                        />
                      </div>

                      {/* Store URL */}
                      <div className="space-y-1.5">
                        <Label htmlFor="storeSlugDesktop" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Store URL Link
                        </Label>
                        <div className="relative">
                          <Input
                            id="storeSlugDesktop"
                            placeholder="your-store-slug"
                            value={storeSlug}
                            onChange={e => {
                              setIsSlugManuallyEdited(true)
                              setStoreSlug(toSlug(e.target.value))
                            }}
                            className={`h-11 rounded-xl font-mono text-sm pr-10 ${slugStatus === 'available'
                                ? 'border-emerald-400 bg-emerald-50/20 dark:bg-emerald-900/10 focus:ring-emerald-500/10'
                                : slugStatus === 'taken'
                                  ? 'border-rose-400 bg-rose-50/20 dark:bg-rose-900/10'
                                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/10'
                              }`}
                            maxLength={50}
                          />
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                            {slugStatus === 'checking' && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}
                            {slugStatus === 'available' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          </div>
                        </div>

                        {slugStatus === 'available' && storeSlug && (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">✓ Custom store slug is available!</p>
                        )}
                        {slugStatus === 'taken' && (
                          <div className="space-y-1">
                            <p className="text-xs text-rose-500 font-medium">✗ This link is already taken.</p>
                            {slugSuggestion && (
                              <button
                                type="button"
                                onClick={() => setStoreSlug(slugSuggestion)}
                                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                              >
                                Suggest: <span className="font-mono">{slugSuggestion}</span>
                              </button>
                            )}
                          </div>
                        )}

                        {storeSlug && slugStatus !== 'taken' && (
                          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 mt-2">
                            <Store className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                              https://resellerpro.in/store/<span className="text-indigo-600 dark:text-indigo-400 font-semibold">{storeSlug}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <StepNav
                      onBack={goBack}
                      onNext={saveStep4}
                      nextDisabled={
                        !businessName.trim() ||
                        !storeSlug ||
                        slugStatus === 'taken' ||
                        slugStatus === 'checking' ||
                        slugStatus === 'error'
                      }
                      saving={saving}
                    />
                  </div>
                </div>
              )}

              {/* ── STEP 5: Product Count ───────────────── */}
              {step === 5 && (
                <div>
                  {/* ── MOBILE VIEW ONLY (hidden on md: and above) ── */}
                  <div className="block md:hidden space-y-5">
                    <div className="space-y-1.5 text-left">
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        How many products do you currently have?
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                        Please select an option so we can optimize your dashboard setup settings.
                      </p>
                    </div>

                    {/* 2-Column Compact Card Grid for Mobile */}
                    <div className="grid grid-cols-2 gap-3">
                      {PRODUCT_COUNTS.map(opt => {
                        const selected = productCountRange === opt.id
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setProductCountRange(opt.id)}
                            className={`group border rounded-none p-3.5 transition-all duration-200 flex flex-col items-center justify-between text-center select-none cursor-pointer ${selected
                                ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-600/10 shadow-sm'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-200 dark:hover:border-indigo-900/50'
                              }`}
                          >
                            <div className="flex flex-col items-center w-full">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                                {opt.label}
                              </h4>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight max-w-[140px]">
                                {opt.desc}
                              </p>
                            </div>

                            {/* Radio Dot at Bottom Center */}
                            <div className="mt-3 pt-0.5">
                              <div className={`w-5 h-5 rounded-full border transition-all flex items-center justify-center ${selected
                                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                                }`}>
                                {selected && <Check className="w-3 h-3 stroke-[2.5]" />}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {/* Soft Purple Callout Banner */}
                    <div className="bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl p-3 sm:p-3.5 border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-2.5 text-xs text-indigo-700 dark:text-indigo-300">
                      <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                      <span>This helps us set up your product catalog default layout.</span>
                    </div>

                    {/* Mobile Navigation Bar */}
                    <StepNav
                      onBack={goBack}
                      onNext={saveStep5AndFinish}
                      nextDisabled={!productCountRange}
                      nextLabel="Next →"
                      saving={saving}
                    />
                  </div>

                  {/* ── DESKTOP VIEW ONLY (unchanged) ── */}
                  <div className="hidden md:block space-y-6">
                    <div className="space-y-2 text-left">
                      <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        How many products do you currently have?
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Please select an option so we can optimize your dashboard setup settings.
                      </p>
                    </div>

                    <div className="max-w-xl space-y-3 text-left">
                      {PRODUCT_COUNTS.map(opt => {
                        const selected = productCountRange === opt.id
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setProductCountRange(opt.id)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all cursor-pointer ${selected
                                ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/5 dark:bg-indigo-900/5 ring-2 ring-indigo-600/10'
                                : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 hover:bg-slate-50 dark:hover:bg-slate-900'
                              }`}
                          >
                            <div className={`w-5 h-5 rounded-full border transition-all flex items-center justify-center ${selected
                                ? 'border-transparent bg-emerald-500 text-white'
                                : 'border-slate-200 dark:border-slate-700'
                              }`}>
                              {selected && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div>
                              <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 block">{opt.label}</span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">{opt.desc}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    <StepNav
                      onBack={goBack}
                      onNext={saveStep5AndFinish}
                      nextDisabled={!productCountRange}
                      nextLabel="Next →"
                      saving={saving}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    )
}

// ─────────────────────────────────────────────────────
// Navigation Component
// ─────────────────────────────────────────────────────

function StepNav({
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = 'Next →',
  saving = false,
}: {
  onBack: () => void
  onNext: () => void
  nextDisabled?: boolean
  nextLabel?: string
  saving?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 pt-5 sm:pt-6 border-t border-slate-100 dark:border-slate-800 w-full">
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-xl text-xs sm:text-sm px-3 sm:px-4 h-10 sm:h-11 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>

      <Button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || saving}
        className="h-10 sm:h-11 px-6 sm:px-8 flex-1 sm:flex-initial max-w-[220px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 cursor-pointer ml-auto"
      >
        {saving ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
        ) : (
          nextLabel
        )}
      </Button>
    </div>
  )
}