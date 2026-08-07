'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Star, Truck, ShieldCheck, MessageCircle, ArrowRight, ChevronDown,
  RotateCcw, Sparkles, Check, HeartHandshake, ChevronLeft, ChevronRight,
  Watch, Headphones, Shirt, Laptop, Package, Layers, Home
} from 'lucide-react'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreProductCard } from '@/components/store/StoreProductCard'
import { PromotionalSection } from '@/components/store/PromotionalSection'
import { StoreFooter } from '@/components/store/StoreFooter'
import { WhyChooseUs } from '@/components/store/WhyChooseUs'
import { WhatsAppWidget } from '@/components/store/WhatsAppWidget'
import { trackEvent } from '@/lib/analytics'
import { useCartStore } from '@/store/useCartStore'
import { useToast } from '@/hooks/use-toast'
import type { Product, Profile, ShopTheme } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'

import type { CmsSectionItem } from '@/lib/services/cms/sections.service'
import Testimonials from '@/components/store/Testimonials'

interface StorefrontClientProps {
  profile: Profile
  products: Product[]
  categories: { name: string; image_url?: string }[]
  theme: ShopTheme | null
  cmsSections?: CmsSectionItem[]
}

function getCategoryIcon(categoryName: string) {
  const name = categoryName.toLowerCase()
  if (name.includes('watch')) return <Watch className="w-5 h-5 text-slate-700" />
  if (name.includes('earbud') || name.includes('headphone') || name.includes('audio')) return <Headphones className="w-5 h-5 text-slate-700" />
  if (name.includes('clothing') || name.includes('fashion') || name.includes('wear') || name.includes('hoodie') || name.includes('shirt')) return <Shirt className="w-5 h-5 text-slate-700" />
  if (name.includes('accessory') || name.includes('bag') || name.includes('backpack')) return <Package className="w-5 h-5 text-slate-700" />
  if (name.includes('electronic') || name.includes('gadget') || name.includes('tech') || name.includes('laptop')) return <Laptop className="w-5 h-5 text-slate-700" />
  if (name.includes('home') || name.includes('living')) return <Home className="w-5 h-5 text-slate-700" />
  return <Layers className="w-5 h-5 text-slate-700" />
}

export function StorefrontClient({ profile, products, categories, theme, cmsSections }: StorefrontClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const setShopSlug = useCartStore((s) => s.setShopSlug)
  const { toast } = useToast()
  
  const categorySliderRef = useRef<HTMLDivElement>(null)

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categorySliderRef.current) {
      const scrollAmount = 400
      categorySliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubscribing, setNewsletterSubscribing] = useState(false)
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)

  const shopSlug = profile.shop_slug!
  const primaryColor = theme?.primaryColor || '#6366f1'

  // Auto-slide state for Product Showcase Hero images
  const heroImages: string[] = theme?.heroImages && theme.heroImages.length > 0
    ? theme.heroImages
    : theme?.heroImageUrl ? [theme.heroImageUrl] : []
  const [heroImageIndex, setHeroImageIndex] = useState(0)

  // Multi-banner promo carousel state
  const heroBanners = useMemo(() => {
    if (theme?.heroBanners && Array.isArray(theme.heroBanners) && theme.heroBanners.length > 0) {
      return theme.heroBanners
    }
    if (theme?.heroImageUrl) {
      return [{
        imageUrl: theme.heroImageUrl,
        link: theme.heroCtaLink || `/store/${shopSlug}/shop`,
        clickAction: theme.heroBannerClickAction || 'shop'
      }]
    }
    return []
  }, [theme?.heroBanners, theme?.heroImageUrl, theme?.heroCtaLink, theme?.heroBannerClickAction, shopSlug])

  const [promoBannerIndex, setPromoBannerIndex] = useState(0)

  // Set shop context in cart
  useEffect(() => {
    setShopSlug(shopSlug)
    trackEvent({ userId: profile.id, eventType: 'store_view' })
  }, [shopSlug, profile.id, setShopSlug])

  // Auto-slide product showcase images every 3 seconds
  useEffect(() => {
    if (heroImages.length <= 1) return
    const interval = setInterval(() => {
      setHeroImageIndex(i => (i + 1) % heroImages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  // Auto-slide promotional banners every 4 seconds
  useEffect(() => {
    if (heroBanners.length <= 1) return
    const interval = setInterval(() => {
      setPromoBannerIndex(i => (i + 1) % heroBanners.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [heroBanners.length])

  // Products to render (strictly fetched from DB)
  const displayProducts = products
  const displayCategories = categories

  // Featured Products (Curated subset of products for Homepage)
  const featuredProducts = useMemo(() => {
    return displayProducts.slice(0, 4)
  }, [displayProducts])

  // Best Sellers (Curated subset of products for Homepage)
  const bestSellers = useMemo(() => {
    return displayProducts.slice(0, 4)
  }, [displayProducts])

  const storeName = profile.business_name || profile.shop_name || 'Rashid Store'
  const waNum = theme?.socialWhatsApp || profile.whatsapp_number || profile.business_phone
  const waClean = waNum?.replace(/\D/g, '')
  const waLink = waClean ? `https://wa.me/91${waClean}?text=${encodeURIComponent('Hi! I wanted to inquire about a product.')}` : null

  return (
    <div className="min-h-screen bg-white">
      {/* Custom CSS overrides */}
      {theme?.customCss && <style dangerouslySetInnerHTML={{ __html: theme.customCss }} />}

      {/* Premium Header */}
      <StoreHeader
        shopSlug={shopSlug}
        shopName={storeName}
        shopDescription={profile.shop_description}
        logoUrl={profile.shop_logo_url || profile.avatar_url}
        announcement={profile.shop_announcement || 'Free Delivery on orders above ₹999 | COD Available'}
        theme={theme}
        onSearch={setSearchQuery}
        activePage="home"
      />

      {/* 1. Dynamic Hero Section */}
      {theme?.heroEnabled !== false && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {(!theme?.heroTemplate || theme.heroTemplate === 'split') ? (
            /* Template 1: Luxury Split Design */
            <div className="relative rounded-2xl overflow-hidden text-white min-h-[440px] md:min-h-[500px] flex items-center shadow-2xl" style={{ backgroundColor: theme?.heroBgColor || 'var(--store-neutral-dark)' }}>
              {/* Visual gradient backdrop */}
              <div className="absolute inset-0 bg-black/20 z-0" />
              <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)] [background-size:24px_24px] pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-6 py-10 md:px-14 w-full">
                {/* Left Column: Headings & CTA */}
                <div className="space-y-5 text-left max-w-xl">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/10 text-slate-200 border border-white/10">
                    {theme?.heroBadge || 'New Arrival'}
                  </span>
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] text-white whitespace-pre-line">
                    {theme?.heroTitle || 'Premium Quality.\nTimeless Style.'}
                  </h1>
                  <p className="text-xs md:text-sm text-slate-400 font-semibold leading-relaxed max-w-md">
                    {theme?.heroSubtitle || 'Discover our curated collection of luxury products crafted for your lifestyle.'}
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link
                      href={`/store/${shopSlug}/shop`}
                      className="px-7 py-3.5 hover:opacity-90 text-white font-black text-xs sm:text-sm transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
                      style={{ backgroundColor: 'var(--store-primary)', borderRadius: 'var(--store-btn-radius, 12px)' }}
                    >
                      {theme?.heroCtaText || 'Explore Shop'}
                    </Link>
                    <Link
                      href={`/store/${shopSlug}/about`}
                      className="px-7 py-3.5 border border-white/20 hover:border-white/40 text-white font-black text-xs sm:text-sm transition-all hover:bg-white/5 active:scale-[0.98]"
                      style={{ borderRadius: 'var(--store-btn-radius, 12px)' }}
                    >
                      {theme?.heroSecondaryCtaText || 'About Our Brand'}
                    </Link>
                  </div>

                  {/* Micro trust icons */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-5 border-t border-white/10 text-slate-400 text-[11px] font-bold">
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-slate-300" />
                      <span>{theme?.heroBadge1 || 'Free Shipping'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
                      <span>{theme?.heroBadge2 || '7-Day Easy Returns'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-slate-300" />
                      <span>{theme?.heroBadge3 || 'COD Available'}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Premium Showcase Image Frame */}
                <div className="relative w-full h-[300px] md:h-[380px] flex items-center justify-center lg:justify-end">
                  <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[320px] md:w-[320px] md:h-[360px] rounded-3xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-md shadow-2xl p-4 flex items-center justify-center transition-all duration-500 hover:scale-[1.02] group">
                    {heroImages.length > 0 ? (
                      <>
                        {heroImages.map((imgUrl, idx) => (
                          <Image
                            key={idx}
                            src={imgUrl}
                            alt={`Product showcase ${idx + 1}`}
                            fill
                            className={`object-contain p-3 transition-opacity duration-700 ${idx === heroImageIndex ? 'opacity-100' : 'opacity-0'}`}
                            priority={idx === 0}
                          />
                        ))}
                        {heroImages.length > 1 && (
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                            {heroImages.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setHeroImageIndex(idx)}
                                className={`h-1.5 rounded-full transition-all ${idx === heroImageIndex ? 'bg-white w-5' : 'bg-white/40 w-1.5'}`}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Image
                        src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop"
                        alt={theme?.heroTitle || 'Premium Smartwatch Mockup'}
                        fill
                        className="object-contain p-3"
                        priority
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Template 2: Promotion Banner Carousel */
            <div className="relative rounded-2xl overflow-hidden shadow-2xl min-h-[260px] sm:min-h-[340px] md:min-h-[400px] group" style={{ backgroundColor: 'var(--store-neutral-dark)' }}>
              {heroBanners.length > 0 ? (
                <>
                  {heroBanners.map((banner, idx) => (
                    <div
                      key={idx}
                      className={`absolute inset-0 transition-opacity duration-700 ${idx === promoBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                    >
                      <Image
                        src={banner.imageUrl}
                        alt={`Promotional Banner ${idx + 1}`}
                        fill
                        className="object-cover"
                        priority={idx === 0}
                      />
                      <Link
                        href={`/store/${shopSlug}/shop`}
                        className="absolute inset-0 z-20 hover:bg-black/5 transition-colors"
                        aria-label={`Go to banner ${idx + 1} destination`}
                      />
                    </div>
                  ))}

                  {heroBanners.length > 1 && (
                    <>
                      <button
                        onClick={() => setPromoBannerIndex(i => (i === 0 ? heroBanners.length - 1 : i - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                        aria-label="Previous Banner"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setPromoBannerIndex(i => (i + 1) % heroBanners.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                        aria-label="Next Banner"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2">
                        {heroBanners.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setPromoBannerIndex(idx)}
                            className={`h-2 rounded-full transition-all ${idx === promoBannerIndex ? 'bg-white w-6' : 'bg-white/50 w-2'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center">
                  <p className="text-white/70 text-sm font-bold">Upload promotional banners in Store Settings</p>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* 2. Shop by Categories */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-md sm:text-2xl font-black font-bold text-slate-900 tracking-wider uppercase">Shop by Categories</h2>
          </div>
          <div className="relative group/slider">
            {/* Left Scroll Button */}
            {displayCategories.length >= 5 && (
              <button
                type="button"
                onClick={() => scrollCategories('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-800 hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover/slider:opacity-100 focus:opacity-100 hidden md:flex"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Scrollable category list */}
            <div 
              ref={categorySliderRef}
              className={`flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x scroll-smooth ${
                displayCategories.length < 5 ? 'justify-start md:justify-center' : 'justify-start'
              }`}
            >
              {displayCategories.map((cat) => {
                const hasImage = !!cat.image_url
                return (
                  <Link
                    key={cat.name}
                    href={`/store/${shopSlug}/shop?category=${encodeURIComponent(cat.name)}`}
                    className={`snap-start shrink-0 flex flex-col justify-end p-3.5 w-52 sm:w-60 aspect-[1.8/1] rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md group relative overflow-hidden ${
                      hasImage 
                        ? "border-transparent text-white" 
                        : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-700 hover:border-slate-200"
                    }`}
                  >
                    {hasImage ? (
                      <>
                        {/* Category Image Background */}
                        <Image 
                          src={cat.image_url!} 
                          alt={cat.name} 
                          fill 
                          className="object-cover absolute inset-0 group-hover:scale-115 transition-transform duration-500" 
                          sizes="(max-width: 640px) 224px, 256px" 
                        />
                        {/* Dark Overlay for Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent z-10" />
                        <span className="relative z-20 text-[11px] sm:text-xs font-black uppercase tracking-wider text-center w-full line-clamp-2">
                          {cat.name}
                        </span>
                      </>
                    ) : (
                      <>
                        {/* Fallback Icon Style */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pb-8">
                          <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                            {getCategoryIcon(cat.name)}
                          </div>
                        </div>
                        <span className="relative z-10 text-[11px] sm:text-xs font-black uppercase tracking-wider text-center w-full line-clamp-2">
                          {cat.name}
                        </span>
                      </>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right Scroll Button */}
            {displayCategories.length >= 5 && (
              <button
                type="button"
                onClick={() => scrollCategories('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-800 hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover/slider:opacity-100 focus:opacity-100 hidden md:flex"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </section>

        {/* 3. Featured Products */}
        <section className="mb-14">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-md sm:text-2xl font-bold text-slate-900 uppercase tracking-tight leading-none">Featured Products</h2>
            <Link
              href={`/store/${shopSlug}/shop`}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 shrink-0 leading-none"
            >
              <span>View More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {featuredProducts.map((product) => (
              <StoreProductCard
                key={product.id}
                product={product}
                storeUserId={profile.id}
                shopSlug={shopSlug}
                theme={theme ? { buttonStyle: theme.buttonStyle, showPrices: theme.showPrices } : undefined}
              />
            ))}
          </div>
        </section>

        {/* Promotional Section */}
        <PromotionalSection theme={theme} shopSlug={shopSlug} />

        {/* 4. Best Sellers */}
        <section className="mb-14">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-md sm:text-2xl font-bold text-slate-900 uppercase tracking-tight leading-none">Best Sellers</h2>
            <Link
              href={`/store/${shopSlug}/shop`}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 shrink-0 leading-none"
            >
              <span>View More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {bestSellers.map((product) => (
              <StoreProductCard
                key={product.id}
                product={product}
                storeUserId={profile.id}
                shopSlug={shopSlug}
                theme={theme ? { buttonStyle: theme.buttonStyle, showPrices: theme.showPrices } : undefined}
              />
            ))}
          </div>
        </section>

        {/* 5. Offers / Promotion Banner Strip */}
        {theme?.offerBannerEnabled !== false && (
          <section className="mb-14">
            <div className="relative rounded-2xl overflow-hidden text-white p-8 md:p-10 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6" style={{ backgroundColor: 'var(--store-neutral-dark)' }}>
              <div className="space-y-2 text-center md:text-left">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {theme?.offerBannerBadge || '⚡ Special Promotion'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {theme?.offerBannerTitle || theme?.bannerText || 'Limited Time Offer: Get 10% OFF on Orders Above ₹1,499'}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {theme?.offerBannerSubtext || (
                    <>Use code <span className="text-white font-extrabold bg-white/10 px-2 py-0.5 rounded">{theme?.offerBannerCode || 'SAVE10'}</span> at checkout.</>
                  )}
                </p>
              </div>
              <Link
                href={`/store/${shopSlug}/shop`}
                className="px-8 py-3.5 text-white font-black text-xs uppercase transition-all shadow-md shrink-0 active:scale-95 hover:opacity-90"
                style={{ backgroundColor: 'var(--store-primary)', borderRadius: 'var(--store-btn-radius, 12px)' }}
              >
                {theme?.offerBannerBtnText || 'Claim Offer Now'}
              </Link>
            </div>
          </section>
        )}

        {/* 6. Why Choose Us (Trust Cards) */}
        <WhyChooseUs primaryColor={primaryColor} theme={theme} />

        {/* 7. Customer Reviews / Testimonials */}
        {theme?.testimonialsEnabled && theme?.testimonials && theme.testimonials.length > 0 && (
          <Testimonials primaryColor={primaryColor} customReviews={theme.testimonials} heading={theme?.testimonialsHeading} subheading={theme?.testimonialsSubheading} />
        )}

        {/* 8. Newsletter Signup */}
        {theme?.newsletterEnabled !== false && (
          <section className="mt-14 mb-6">
            <div className="relative rounded-2xl overflow-hidden text-white p-8 md:p-12 flex items-center justify-between flex-col lg:flex-row gap-8 shadow-xl" style={{ backgroundColor: 'var(--store-neutral-dark)' }}>
              <div className="space-y-2 text-center lg:text-left max-w-md">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                  {theme?.newsletterTitle || 'JOIN OUR VIP CIRCLE'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
                  {theme?.newsletterSubtitle || 'Subscribe to get exclusive discount codes, new arrival alerts, and special event invites.'}
                </p>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!newsletterEmail || newsletterSubscribing) return
                  setNewsletterSubscribing(true)
                  try {
                    const res = await fetch('/api/newsletter', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        email: newsletterEmail,
                        shopSlug,
                        storeUserId: profile.id
                      })
                    })
                    const data = await res.json()
                    if (res.ok && data.success) {
                      setNewsletterSubscribed(true)
                      setNewsletterEmail('')
                      toast({
                        title: 'Subscribed! 🎉',
                        description: 'Thank you for joining our VIP Circle!',
                      })
                    } else {
                      toast({
                        title: 'Subscription Failed',
                        description: data.error || 'Failed to subscribe',
                        variant: 'destructive',
                      })
                    }
                  } catch (err) {
                    toast({
                      title: 'Error',
                      description: 'Failed to subscribe. Please try again.',
                      variant: 'destructive',
                    })
                  } finally {
                    setNewsletterSubscribing(false)
                  }
                }}
                className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto max-w-md"
              >
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={theme?.newsletterPlaceholder || 'Enter your email address'}
                  required
                  disabled={newsletterSubscribing || newsletterSubscribed}
                  className="h-11 px-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 w-full sm:w-64 transition-colors font-medium"
                />
                <button
                  type="submit"
                  disabled={newsletterSubscribing || newsletterSubscribed}
                  className="h-11 px-6 text-white font-black text-xs uppercase transition-all shadow-md shrink-0 active:scale-95 hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: 'var(--store-primary)', borderRadius: 'var(--store-btn-radius, 12px)' }}
                >
                  {newsletterSubscribed ? 'Subscribed ✓' : newsletterSubscribing ? 'Subscribing...' : (theme?.newsletterBtnText || 'SUBSCRIBE')}
                </button>
              </form>
            </div>
          </section>
        )}

      </main>

      {/* Floating WhatsApp Quick Chat Widget */}
      <WhatsAppWidget profile={profile} theme={theme} />

      {/* 9. Premium Footer */}
      <StoreFooter profile={profile} theme={theme} />
    </div>
  )
}
