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
import { useWishlistStore } from '@/store/useWishlistStore'
import { toast } from '@/lib/toast'
import type { Product, Profile, ShopTheme, HeroBannerItem } from '@/types'
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
function highlightOfferText(text: string) {
  const parts = text.split(/(\d+%\s*OFF|₹[\d,]+(?:\.\d+)?)/gi)
  return parts.map((part, i) =>
    /(\d+%\s*OFF|₹[\d,]+)/i.test(part) ? (
      <span key={i} style={{ color: 'var(--store-primary, #34d399)' }}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  )
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

  const categorySliderRef = useRef<HTMLDivElement>(null)
  const isCategoryHoveredRef = useRef(false)
  const activeCatIndexRef = useRef(0)

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categorySliderRef.current) {
      const container = categorySliderRef.current
      const totalItems = sliderCategoriesToRender.length || 1
      if (direction === 'right') {
        activeCatIndexRef.current = (activeCatIndexRef.current + 1) % totalItems
      } else {
        activeCatIndexRef.current = (activeCatIndexRef.current - 1 + totalItems) % totalItems
      }
      const targetChild = container.children[activeCatIndexRef.current] as HTMLElement
      if (targetChild) {
        container.scrollTo({
          left: targetChild.offsetLeft - container.offsetLeft,
          behavior: 'smooth'
        })
      }
    }
  }

  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubscribing, setNewsletterSubscribing] = useState(false)
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)

  const shopSlug = profile.shop_slug!
  const primaryColor = theme?.primaryColor || '#6366f1'

  // Dedicated Showcase Banners state
  const heroShowcaseBanners: HeroBannerItem[] = useMemo(() => {
    if (theme?.heroShowcaseBanners && Array.isArray(theme.heroShowcaseBanners) && theme.heroShowcaseBanners.length > 0) {
      return theme.heroShowcaseBanners
    }
    const images = theme?.heroImages || (theme?.heroImageUrl ? [theme.heroImageUrl] : [])
    return images.map((img: string) => ({
      imageUrl: img,
      link: theme?.heroCtaLink || '#products',
      clickAction: 'shop'
    }))
  }, [theme?.heroShowcaseBanners, theme?.heroImages, theme?.heroImageUrl, theme?.heroCtaLink])
  const [heroImageIndex, setHeroImageIndex] = useState(0)

  // Dedicated Mobile Banners state
  const mobileBanners: HeroBannerItem[] = useMemo(() => {
    if (theme?.heroMobileBanners && Array.isArray(theme.heroMobileBanners) && theme.heroMobileBanners.length > 0) {
      return theme.heroMobileBanners
    }
    const images = theme?.heroMobileImages || (theme?.heroMobileImageUrl ? [theme.heroMobileImageUrl] : [])
    return images.map((img: string) => ({
      imageUrl: img,
      link: theme?.heroMobileCtaLink || theme?.heroCtaLink || '#products',
      clickAction: theme?.heroMobileClickAction || 'shop'
    }))
  }, [theme?.heroMobileBanners, theme?.heroMobileImages, theme?.heroMobileImageUrl, theme?.heroMobileCtaLink, theme?.heroCtaLink, theme?.heroMobileClickAction])
  const [mobileBannerIndex, setMobileBannerIndex] = useState(0)

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

  const getBannerHref = (link?: string) => {
    if (!link || link === 'shop' || link === '#products') return `/store/${shopSlug}/shop`;
    if (link === 'collections' || link === '#collections') return `/store/${shopSlug}/shop#collections`;
    if (link.startsWith('?category=')) return `/store/${shopSlug}/shop${link}`;
    if (link.startsWith('p/')) return `/store/${shopSlug}/product/${link.replace('p/', '')}`;
    if (link.startsWith('http://') || link.startsWith('https://')) return link;
    return link.startsWith('/') ? link : `/store/${shopSlug}/${link}`;
  };

  const [promoBannerIndex, setPromoBannerIndex] = useState(0)

  // Set shop context in cart and wishlist
  useEffect(() => {
    setShopSlug(shopSlug)
    useWishlistStore.getState().setShopSlug(shopSlug)
    trackEvent({ userId: profile.id, eventType: 'store_view' })
  }, [shopSlug, profile.id, setShopSlug])

  // Auto-slide product showcase images every 3 seconds
  useEffect(() => {
    if (heroShowcaseBanners.length <= 1) return
    const interval = setInterval(() => {
      setHeroImageIndex(i => (i + 1) % heroShowcaseBanners.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [heroShowcaseBanners.length])

  // Auto-slide promotional banners every 4 seconds
  useEffect(() => {
    if (heroBanners.length <= 1) return
    const interval = setInterval(() => {
      setPromoBannerIndex(i => (i + 1) % heroBanners.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [heroBanners.length])

  // Auto-slide mobile banners every 4 seconds
  useEffect(() => {
    if (mobileBanners.length <= 1) return
    const interval = setInterval(() => {
      setMobileBannerIndex(i => (i + 1) % mobileBanners.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [mobileBanners.length])

  // Products and categories to render
  const displayProducts = products
  const displayCategories = categories

  const [isCategoryOverflowing, setIsCategoryOverflowing] = useState(false)

  // Dynamically measure if category cards overflow the visible screen display
  useEffect(() => {
    const checkOverflow = () => {
      const el = categorySliderRef.current
      if (el) {
        setIsCategoryOverflowing(el.scrollWidth > el.clientWidth)
      }
    }

    checkOverflow()
    const timer = setTimeout(checkOverflow, 150)
    window.addEventListener('resize', checkOverflow)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', checkOverflow)
    }
  }, [categories])

  // Duplicated category array for seamless infinite forward loop (only when categories overflow display)
  const sliderCategoriesToRender = useMemo(() => {
    if (!categories || categories.length === 0) return []
    if (!isCategoryOverflowing) return categories
    const count = categories.length
    const repeatCount = count < 4 ? 6 : 4
    return Array(repeatCount).fill(categories).flat()
  }, [categories, isCategoryOverflowing])

  // Step auto-slide effect for Category Slider (active ONLY when categories overflow the display)
  useEffect(() => {
    const container = categorySliderRef.current
    if (!container || !isCategoryOverflowing || categories.length <= 1) return

    const interval = setInterval(() => {
      if (!isCategoryHoveredRef.current && categorySliderRef.current) {
        const el = categorySliderRef.current
        const n = categories.length

        activeCatIndexRef.current = (activeCatIndexRef.current + 1) % (sliderCategoriesToRender.length || 1)

        const targetChild = el.children[activeCatIndexRef.current] as HTMLElement
        if (targetChild) {
          el.scrollTo({
            left: targetChild.offsetLeft - el.offsetLeft,
            behavior: 'smooth'
          })
        }

        // Seamless infinite loop reset when items are duplicated
        if (n >= 2 && activeCatIndexRef.current >= n * 2) {
          setTimeout(() => {
            activeCatIndexRef.current -= n
            if (categorySliderRef.current) {
              const resetChild = categorySliderRef.current.children[activeCatIndexRef.current] as HTMLElement
              if (resetChild) {
                categorySliderRef.current.scrollTo({
                  left: resetChild.offsetLeft - categorySliderRef.current.offsetLeft,
                  behavior: 'auto'
                })
              }
            }
          }, 500)
        }
      }
    }, 2500)

    return () => clearInterval(interval)
  }, [isCategoryOverflowing, categories.length, sliderCategoriesToRender.length])

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
        logoUrl={profile.shop_logo_url || profile.avatar_url || theme?.shop_logo_url}
        announcement={profile.shop_announcement || 'Free Delivery on orders above ₹999 | COD Available'}
        theme={theme}
        onSearch={setSearchQuery}
        activePage="home"
      />
      {/* 1. Dynamic Hero Section */}
      {theme?.heroEnabled !== false && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {/* Dedicated Mobile Banner Carousel (Shown ONLY on mobile view when mobileBanners exist) */}
          {mobileBanners.length > 0 && (
            <div className="lg:hidden relative w-full rounded-2xl overflow-hidden shadow-xl aspect-[16/9] sm:aspect-[2.2/1] min-h-[180px] sm:min-h-[240px] group bg-slate-900">
              {mobileBanners.map((banner, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-700 ${idx === mobileBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                >
                  <Image
                    src={banner.imageUrl}
                    alt={`Mobile Store Banner ${idx + 1}`}
                    fill
                    className="object-cover object-center"
                    priority={idx === 0}
                  />
                  <Link
                    href={getBannerHref(banner.link)}
                    className="absolute inset-0 z-20 hover:bg-black/5 transition-colors"
                    aria-label={`Mobile Hero Banner ${idx + 1} Link`}
                  />
                </div>
              ))}

              {mobileBanners.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 z-30 flex justify-center gap-1.5 pointer-events-none">
                  {mobileBanners.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMobileBannerIndex(idx)}
                      className={`h-1.5 rounded-full transition-all pointer-events-auto ${idx === mobileBannerIndex ? 'bg-white w-5' : 'bg-white/50 w-1.5'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Main Hero Container (Hidden on mobile if dedicated mobile banners exist) */}
          <div className={mobileBanners.length > 0 ? "hidden lg:block" : "block"}>
            {(!theme?.heroTemplate || theme.heroTemplate === 'split') ? (
              /* Template 1: Luxury Split Design */
              <div className="relative rounded-2xl overflow-hidden text-white min-h-[440px] md:min-h-[500px] flex items-center shadow-2xl" style={{ backgroundColor: theme?.heroBgColor || 'var(--store-neutral-dark)' }}>
                {/* Visual gradient backdrop */}
                <div className="absolute inset-0 bg-black/20 z-0" />
                <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)] [background-size:24px_24px] pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-6 py-8 sm:py-10 md:px-14 w-full">
                  {/* Left Column: Headings & CTA */}
                  <div className="space-y-4 sm:space-y-5 text-left max-w-xl">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/20 text-white border border-white/20 backdrop-blur-sm">
                      {theme?.heroBadge || 'New Arrival'}
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] text-white whitespace-pre-line">
                      {theme?.heroTitle || 'Premium Quality.\nTimeless Style.'}
                    </h1>
                    <p className="text-xs md:text-sm text-white/80 font-semibold leading-relaxed max-w-md">
                      {theme?.heroSubtitle || 'Discover our curated collection of luxury products crafted for your lifestyle.'}
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <Link
                        href={`/store/${shopSlug}/shop`}
                        className="px-6 sm:px-7 py-3 sm:py-3.5 hover:opacity-90 text-white font-bold sm:font-black text-xs sm:text-sm transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] rounded-full"
                        style={{ backgroundColor: 'var(--store-primary, #4f46e5)' }}
                      >
                        {theme?.heroCtaText || 'Shop Now'}
                      </Link>
                    </div>

                    {/* Micro trust icons */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 sm:pt-5 border-t border-white/15 text-white/90 text-[11px] font-bold">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-white/90" />
                        <span>{theme?.heroBadge1 || 'Free Shipping'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5 text-white/90" />
                        <span>{theme?.heroBadge2 || 'Easy Returns'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-white/90" />
                        <span>{theme?.heroBadge3 || 'COD Available'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Premium Showcase Image Frame */}
                  <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] flex items-center justify-center lg:justify-end">
                    <div className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[480px] h-[220px] sm:h-[280px] md:h-[340px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02] group">
                      {heroShowcaseBanners.length > 0 ? (
                        <>
                          {heroShowcaseBanners.map((banner, idx) => (
                            <div
                              key={idx}
                              className={`absolute inset-0 transition-opacity duration-700 ${idx === heroImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                            >
                              <Image
                                src={banner.imageUrl}
                                alt={`Product showcase ${idx + 1}`}
                                fill
                                className="object-cover"
                                priority={idx === 0}
                              />
                              <Link
                                href={getBannerHref(banner.link)}
                                className="absolute inset-0 z-20 hover:bg-black/5 transition-colors cursor-pointer"
                                aria-label={`Product Showcase ${idx + 1} Link`}
                              />
                            </div>
                          ))}
                          {heroShowcaseBanners.length > 1 && (
                            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-30">
                              {heroShowcaseBanners.map((_, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setHeroImageIndex(idx);
                                  }}
                                  className={`h-1.5 rounded-full transition-all ${idx === heroImageIndex ? 'bg-white w-5' : 'bg-white/50 w-1.5'}`}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <Image
                            src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop"
                            alt={theme?.heroTitle || 'Premium Product'}
                            fill
                            className="object-cover"
                            priority
                          />
                          <Link
                            href={getBannerHref(theme?.heroCtaLink)}
                            className="absolute inset-0 z-10 hover:bg-black/5 transition-colors cursor-pointer"
                            aria-label="Product Showcase Link"
                          />
                        </>
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
                          href={getBannerHref(banner.link)}
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
          </div>
        </section>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* 2. Shop by Categories */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-md sm:text-2xl font-black font-bold text-slate-900 tracking-wider uppercase">Shop by Categories</h2>
          </div>
          <div
            className="relative group/slider"
            onMouseEnter={() => { isCategoryHoveredRef.current = true }}
            onMouseLeave={() => { isCategoryHoveredRef.current = false }}
            onTouchStart={() => { isCategoryHoveredRef.current = true }}
            onTouchEnd={() => { isCategoryHoveredRef.current = false }}
          >
            {/* Left Scroll Button */}
            {isCategoryOverflowing && (
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
              className={`flex gap-2.5 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory scroll-smooth w-full ${isCategoryOverflowing ? 'justify-start' : 'justify-center'
                }`}
            >
              {sliderCategoriesToRender.map((cat, idx) => {
                const hasImage = !!cat.image_url
                const catDisplayName = cat.name.includes(' > ') ? cat.name.split(' > ').pop()?.trim() || cat.name : cat.name
                return (
                  <Link
                    key={`${cat.name}-${idx}`}
                    href={`/store/${shopSlug}/shop?category=${encodeURIComponent(cat.name)}`}
                    className={`snap-start shrink-0 flex flex-col justify-end p-2.5 sm:p-3.5 w-36 sm:w-60 aspect-[1.6/1] sm:aspect-[1.8/1] rounded-xl sm:rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md group relative overflow-hidden ${hasImage
                      ? "border-transparent text-white"
                      : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-700 hover:border-slate-200"
                      }`}
                  >
                    {hasImage ? (
                      <>
                        {/* Category Image Background */}
                        <Image
                          src={cat.image_url!}
                          alt={catDisplayName}
                          fill
                          className="object-cover absolute inset-0 group-hover:scale-115 transition-transform duration-500"
                          sizes="(max-width: 640px) 144px, 240px"
                        />
                        {/* Dark Overlay for Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent z-10" />
                        <span className="relative z-20 text-[10px] sm:text-xs font-bold sm:font-black uppercase tracking-wider text-center w-full line-clamp-2">
                          {catDisplayName}
                        </span>
                      </>
                    ) : (
                      <>
                        {/* Fallback Icon Style */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pb-6 sm:pb-8">
                          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                            {getCategoryIcon(catDisplayName)}
                          </div>
                        </div>
                        <span className="relative z-10 text-[10px] sm:text-xs font-bold sm:font-black uppercase tracking-wider text-center w-full line-clamp-2">
                          {catDisplayName}
                        </span>
                      </>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right Scroll Button */}
            {isCategoryOverflowing && (
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
            {featuredProducts.map((product: Product) => (
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
            {bestSellers.map((product: Product) => (
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
    <div
      className="relative overflow-hidden text-white p-5 md:p-10 md:py-12 border border-white/5 shadow-2xl flex flex-col md:flex-row items-center justify-center md:justify-between text-center md:text-left gap-4 md:gap-8"
      style={{
        backgroundColor: 'var(--store-neutral-dark, #0b0f19)',
        backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.04), transparent 40%)',
        borderRadius: '22px',
        WebkitMask:
          'radial-gradient(circle 18px at 0 50%, #0000 98%, #000) 0 50%/51% 100% no-repeat, radial-gradient(circle 18px at 100% 50%, #0000 98%, #000) 100% 50%/51% 100% no-repeat',
        mask:
          'radial-gradient(circle 18px at 0 50%, #0000 98%, #000) 0 50%/51% 100% no-repeat, radial-gradient(circle 18px at 100% 50%, #0000 98%, #000) 100% 50%/51% 100% no-repeat',
      }}
    >
      <div className="space-y-2 md:space-y-3 text-center md:text-left flex flex-col items-center md:items-start max-w-xl md:max-w-none mx-auto md:mx-0">
        <span
          className="inline-flex items-center gap-1.5 px-3.5 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest border text-white"
          style={{
            borderColor: 'var(--store-primary, #34d399)',
            backgroundColor: 'color-mix(in srgb, var(--store-primary, #34d399) 10%, transparent)',
          }}
        >
          {theme?.offerBannerBadge || 'Special Promotion'}
        </span>

        <h3 className="text-lg md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {theme?.offerBannerTitle || theme?.bannerText || 'Limited Time Offer: Get 20% OFF on Orders Above ₹1,499'}
        </h3>

        <p className="text-[11px] md:text-sm text-slate-400 font-medium">
          {theme?.offerBannerSubtext || (
            <>
              Use code{' '}
              <span className="font-extrabold" style={{ color: 'var(--store-primary, #34d399)' }}>
                {theme?.offerBannerCode || 'SAVE10'}
              </span>{' '}
              at checkout.
            </>
          )}
        </p>
      </div>

      <Link
        href={`/store/${shopSlug}/shop`}
        className="w-full md:w-auto px-7 py-3 md:px-9 md:py-4 text-white font-black text-[11px] md:text-xs uppercase tracking-wider transition-all shadow-lg shrink-0 active:scale-95 hover:brightness-110 rounded-xl flex items-center justify-center"
        style={{
          background:
            'linear-gradient(135deg, var(--store-primary, #34d399), color-mix(in srgb, var(--store-primary, #34d399) 70%, black))',
          borderRadius: 'var(--store-btn-radius, 12px)',
          boxShadow: '0 0 35px color-mix(in srgb, var(--store-primary, #34d399) 45%, transparent)',
        }}
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
                      toast.success('Subscribed!')
                    } else {
                      toast.error(data.error || 'Failed to subscribe')
                    }
                  } catch (err) {
                    toast.error('Failed to subscribe. Please try again.')
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
