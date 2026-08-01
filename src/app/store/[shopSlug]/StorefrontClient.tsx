'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Star, Truck, ShieldCheck, MessageCircle, ArrowRight, ChevronDown,
  RotateCcw, Sparkles, Check, HeartHandshake, ChevronLeft, ChevronRight,
  Folder, Watch, Headphones, Shirt, Laptop, Package, Layers, Home
} from 'lucide-react'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreProductCard } from '@/components/store/StoreProductCard'
import { PromotionalSection } from '@/components/store/PromotionalSection'
import { StoreFooter } from '@/components/store/StoreFooter'
import { WhyChooseUs } from '@/components/store/WhyChooseUs'
import { Testimonials } from '@/components/store/Testimonials'
import { trackEvent } from '@/lib/analytics'
import { useCartStore } from '@/store/useCartStore'
import type { Product, Profile, ShopTheme } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'

interface StorefrontClientProps {
  profile: Profile
  products: Product[]
  categories: string[]
  theme: ShopTheme | null
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

export function StorefrontClient({ profile, products, categories, theme }: StorefrontClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const setShopSlug = useCartStore((s) => s.setShopSlug)

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

  // Mock products matching reference aesthetic for default/preview state
  const mockProducts: Product[] = [
    {
      id: 'mock-1',
      user_id: profile.id,
      sku: 'PROD-001',
      name: 'Premium Chronograph Watch',
      description: 'Elegant luxury watch featuring multi-dial chronograph performance, black dial, and premium link strap.',
      price: 2799,
      selling_price: 2799,
      compare_at_price: 3499,
      image_url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&auto=format&fit=crop',
      stock_status: 'in_stock',
      category: 'Watches',
      cost_price: 1500,
      stock_quantity: 15,
      is_active: true,
      profit: 1299,
      profit_margin: 46,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'mock-2',
      user_id: profile.id,
      sku: 'PROD-002',
      name: 'Wireless Earbuds Pro',
      description: 'Pro-tier wireless earbuds with active noise cancellation, adaptive transparency, and spatial audio.',
      price: 1899,
      selling_price: 1899,
      compare_at_price: 2299,
      image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800&auto=format&fit=crop',
      stock_status: 'in_stock',
      category: 'Electronics',
      cost_price: 900,
      stock_quantity: 25,
      is_active: true,
      profit: 999,
      profit_margin: 52,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'mock-3',
      user_id: profile.id,
      sku: 'PROD-003',
      name: 'Noise Canceling Headphones',
      description: 'Over-ear headphones with custom audio driver engineering, premium leather cushions, and 30-hour battery.',
      price: 3999,
      selling_price: 3999,
      compare_at_price: 4699,
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop',
      stock_status: 'in_stock',
      category: 'Electronics',
      cost_price: 2000,
      stock_quantity: 8,
      is_active: true,
      profit: 1999,
      profit_margin: 50,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'mock-4',
      user_id: profile.id,
      sku: 'PROD-004',
      name: 'Travel Laptop Backpack',
      description: 'Minimalist water-resistant laptop travel bag with custom padded compartments and USB charging port.',
      price: 1599,
      selling_price: 1599,
      compare_at_price: 1999,
      image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop',
      stock_status: 'low_stock',
      category: 'Fashion',
      cost_price: 800,
      stock_quantity: 3,
      is_active: true,
      profit: 799,
      profit_margin: 50,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  // Products to render
  const displayProducts = useMemo(() => {
    return products.length > 0 ? products : mockProducts
  }, [products])

  const displayCategories = useMemo(() => {
    if (products.length > 0) return categories
    return ['Watches', 'Electronics', 'Fashion', 'Jewellery', 'Shoes']
  }, [products, categories])

  // Featured Products (Curated subset of products for Homepage)
  const featuredProducts = useMemo(() => {
    return displayProducts.slice(0, 4)
  }, [displayProducts])

  // Best Sellers (Curated subset of products for Homepage)
  const bestSellers = useMemo(() => {
    return displayProducts.slice(0, 4)
  }, [displayProducts])

  const storeName = profile.shop_name || profile.business_name || 'Rashid Store'
  const waNum = theme?.socialWhatsApp || profile.whatsapp_number || profile.business_phone
  const waClean = waNum?.replace(/\D/g, '')
  const waLink = waClean ? `https://wa.me/91${waClean}?text=${encodeURIComponent('Hi! I wanted to inquire about a product.')}` : null

  return (
    <div className="min-h-screen bg-white pb-8">
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
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 text-white min-h-[440px] md:min-h-[500px] flex items-center shadow-2xl">
              {/* Visual gradient backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0" />
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
                      className="px-7 py-3.5 bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {theme?.heroCtaText || 'Explore Shop'}
                    </Link>
                    <Link
                      href={`/store/${shopSlug}/about`}
                      className="px-7 py-3.5 border border-white/20 hover:border-white/40 text-white font-black text-xs sm:text-sm rounded-xl transition-all hover:bg-white/5 active:scale-[0.98]"
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
            <div className="relative rounded-2xl overflow-hidden shadow-2xl min-h-[260px] sm:min-h-[340px] md:min-h-[400px] bg-slate-950 group">
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
            <h2 className="text-sm font-black text-slate-900 tracking-wider uppercase">Shop by Categories</h2>
            <Link href={`/store/${shopSlug}/shop`} className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1">
              <span>View Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x">
            <Link
              href={`/store/${shopSlug}/shop`}
              className="snap-start shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-full border border-slate-100 hover:border-slate-200 transition-all font-bold text-xs gap-2 bg-slate-50/50 hover:bg-slate-50 group"
            >
              <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-800 shadow-sm group-hover:scale-105 transition-transform">
                <Folder className="w-4 h-4 text-slate-700" />
              </div>
              <span className="text-[10px] text-slate-600 font-extrabold uppercase">All Products</span>
            </Link>

            {displayCategories.map((cat) => (
              <Link
                key={cat}
                href={`/store/${shopSlug}/shop?category=${encodeURIComponent(cat)}`}
                className="snap-start shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-full border border-slate-100 hover:border-slate-200 transition-all font-bold text-xs gap-2 bg-slate-50/50 hover:bg-slate-50 group"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  {getCategoryIcon(cat)}
                </div>
                <span className="text-[10px] text-slate-600 font-extrabold uppercase tracking-tight line-clamp-1 w-full px-1 text-center">
                  {cat}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Featured Products */}
        <section className="mb-14">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div>
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block">Handpicked Selections</span>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Featured Products</h2>
            </div>
            <Link
              href={`/store/${shopSlug}/shop`}
              className="text-xs font-extrabold text-slate-950 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {featuredProducts.map((product) => (
              <StoreProductCard
                key={product.id}
                product={product}
                storeUserId={profile.id}
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
            <div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block">Customer Favorites</span>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Best Sellers</h2>
            </div>
            <Link
              href={`/store/${shopSlug}/shop`}
              className="text-xs font-extrabold text-slate-950 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {bestSellers.map((product) => (
              <StoreProductCard
                key={product.id}
                product={product}
                storeUserId={profile.id}
                theme={theme ? { buttonStyle: theme.buttonStyle, showPrices: theme.showPrices } : undefined}
              />
            ))}
          </div>
        </section>

        {/* 5. Offers / Promotion Banner Strip */}
        <section className="mb-14">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-8 md:p-10 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/30">
                ⚡ Special Promotion
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {theme?.bannerText || 'Limited Time Offer: Get 10% OFF on Orders Above ₹1,499'}
              </h3>
              <p className="text-xs text-slate-400 font-medium">Use code <span className="text-white font-extrabold bg-white/10 px-2 py-0.5 rounded">SAVE10</span> at checkout.</p>
            </div>
            <Link
              href={`/store/${shopSlug}/shop`}
              className="px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-950 font-black text-xs uppercase rounded-xl transition-all shadow-md shrink-0 active:scale-95"
            >
              Claim Offer Now
            </Link>
          </div>
        </section>

        {/* 6. Why Choose Us (Trust Cards) */}
        <WhyChooseUs primaryColor={primaryColor} />

        {/* 7. Customer Reviews / Testimonials */}
        <Testimonials primaryColor={primaryColor} />

        {/* 8. Newsletter Signup */}
        <section className="mt-14 mb-6">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 text-white p-8 md:p-12 flex items-center justify-between flex-col lg:flex-row gap-8 shadow-xl">
            <div className="space-y-2 text-center lg:text-left max-w-md">
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Join Our VIP Circle</h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
                Subscribe to get exclusive discount codes, new arrival alerts, and special event invites.
              </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto max-w-md">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="h-11 px-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 w-full sm:w-64 transition-colors font-medium"
              />
              <button
                type="submit"
                className="h-11 px-6 bg-slate-100 hover:bg-white text-slate-950 font-black text-xs uppercase rounded-xl transition-all shadow-md shrink-0 active:scale-95"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

      </main>

      {/* Floating WhatsApp Quick Chat Button */}
      {waLink && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group">
          <div className="bg-white text-slate-900 font-bold text-[11px] px-3.5 py-2 rounded-xl shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none select-none">
            Need help? Chat with us!
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="w-13 h-13 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-transform p-3"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </a>
        </div>
      )}

      {/* 9. Premium Footer */}
      <StoreFooter profile={profile} theme={theme} />
    </div>
  )
}
