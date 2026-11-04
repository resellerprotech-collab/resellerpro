'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft, ShoppingCart, Zap, Minus, Plus, Tag,
  Share2, Check, MessageCircle, ShieldCheck, Truck, RotateCcw,
  Video, Music, Maximize2, X, ChevronRight, ChevronDown
} from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useWishlistStore } from '@/store/useWishlistStore'
import { trackEvent } from '@/lib/analytics'
import { toast } from '@/lib/toast'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreProductCard } from '@/components/store/StoreProductCard'
import { StoreFooter } from '@/components/store/StoreFooter'
import { WhatsAppWidget } from '@/components/store/WhatsAppWidget'
import type { Product, Profile, ShopTheme } from '@/types'

interface ProductDetailClientProps {
  product: Product & { video_url?: string | null; audio_url?: string | null }
  relatedProducts: Product[]
  profile: Profile
  theme: ShopTheme | null
  shopSlug: string
}


export function ProductDetailClient({ product, relatedProducts, profile, theme, shopSlug }: ProductDetailClientProps) {
  const router = useRouter()

  const { addItem, buyNowItem, closeCart, setShopSlug } = useCartStore()

  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const [imgError, setImgError] = useState(false)

  const images: string[] = useMemo(() => {
    const result: string[] = []
    const rawImages: any = product.images
    const mainUrl: any = product.image_url

    if (Array.isArray(rawImages)) {
      for (let i = 0; i < rawImages.length; i++) {
        const item = rawImages[i]
        if (typeof item === 'string') {
          const trimmed = item.trim()
          if (trimmed) result.push(trimmed)
        }
      }
    } else if (typeof rawImages === 'string' && rawImages.trim()) {
      try {
        const parsed = JSON.parse(rawImages)
        if (Array.isArray(parsed)) {
          for (let i = 0; i < parsed.length; i++) {
            const item = parsed[i]
            if (typeof item === 'string') {
              const trimmed = item.trim()
              if (trimmed) result.push(trimmed)
            }
          }
        } else if (typeof parsed === 'string' && parsed.trim()) {
          result.push(parsed.trim())
        }
      } catch {
        result.push(rawImages.trim())
      }
    }

    if (result.length === 0 && typeof mainUrl === 'string' && mainUrl.trim()) {
      result.push(mainUrl.trim())
    }
    return result
  }, [product.images, product.image_url])

  // Helper to extract option value from variant robustly (supporting option_values object & title fallback)
  const getOptionValue = (variant: any, optionName: string, optionIdx: number): string | null => {
    if (!variant) return null
    const targetKey = optionName.trim().toLowerCase()

    if (variant.option_values) {
      if (variant.option_values[optionName] !== undefined) {
        return String(variant.option_values[optionName]).trim()
      }
      for (const [key, val] of Object.entries(variant.option_values)) {
        if (key.trim().toLowerCase() === targetKey) {
          return String(val).trim()
        }
      }
    }

    if (variant.title && typeof variant.title === 'string') {
      const parts = variant.title.split('/').map((p: string) => p.trim())
      if (parts[optionIdx] !== undefined) {
        return parts[optionIdx]
      }
    }

    return null
  }

  // Variant state management: Auto-select Level 0 (e.g. Size or Color) by default, keep sub-options unselected
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    if (product.has_variants && product.options && product.options.length > 0 && product.variants && product.variants.length > 0) {
      const firstOpt = product.options[0]
      const activeVariants = product.variants.filter((v: any) => v.is_active !== false)
      const validFirstValues = firstOpt.values.filter((val: string) =>
        activeVariants.some((v: any) => getOptionValue(v, firstOpt.name, 0) === val)
      )
      if (validFirstValues.length > 0) {
        initial[firstOpt.name] = validFirstValues[0]
      } else if (firstOpt.values.length > 0) {
        initial[firstOpt.name] = firstOpt.values[0]
      }
      // Sub-options remain unselected until chosen by user
    }
    return initial
  })

  const activeVariant = useMemo(() => {
    if (!product.has_variants || !product.variants || product.variants.length === 0) return null
    return product.variants.find((v: any) => {
      if (v.is_active === false) return false
      return (product.options || []).every((opt: any, idx: number) => {
        const selectedVal = selectedOptions[opt.name]
        if (!selectedVal) return true
        const vVal = getOptionValue(v, opt.name, idx)
        return vVal === selectedVal
      })
    })
  }, [product.has_variants, product.variants, product.options, selectedOptions])

  // Get available option values for a specific option index based on prior level selections (Cascading Options)
  const getCascadingOptionValues = useMemo(() => {
    return (optIdx: number, optionName: string, allValues: string[]): { value: string; isAvailable: boolean; inStock: boolean }[] => {
      if (!product.has_variants || !product.variants || product.variants.length === 0) {
        return allValues.map(val => ({ value: val, isAvailable: true, inStock: true }))
      }

      const activeVariants = product.variants.filter((v: any) => v.is_active !== false)

      // Filter active variants that match selected options for prior levels (0 ... optIdx - 1)
      const matchingVariants = activeVariants.filter((v: any) => {
        for (let i = 0; i < optIdx; i++) {
          const priorOpt = product.options?.[i]
          if (priorOpt) {
            const selectedVal = selectedOptions[priorOpt.name]
            if (selectedVal) {
              const vVal = getOptionValue(v, priorOpt.name, i)
              if (vVal !== selectedVal) {
                return false
              }
            }
          }
        }
        return true
      })

      const results: { value: string; isAvailable: boolean; inStock: boolean }[] = []

      for (const val of allValues) {
        const variantForVal = matchingVariants.find((v: any) => {
          const vVal = getOptionValue(v, optionName, optIdx)
          return vVal === val
        })
        
        // Hide option value if no matching variant exists for current selection context (deleted combinations hidden)
        if (!variantForVal) {
          continue
        }

        const isAvailable = true
        const inStock = (variantForVal.stock_quantity ?? 0) > 0

        results.push({
          value: val,
          isAvailable,
          inStock,
        })
      }

      return results
    }
  }, [product.has_variants, product.variants, product.options, selectedOptions])

  // Automatically update main gallery image when selected variant has a dedicated image
  useEffect(() => {
    if (activeVariant?.image_url && images.length > 0) {
      const idx = images.indexOf(activeVariant.image_url)
      if (idx >= 0) {
        setActiveImage(idx)
      }
    }
  }, [activeVariant, images])

  const price = activeVariant ? activeVariant.selling_price : (product.selling_price ?? product.price ?? 0)
  const compareAt = activeVariant ? activeVariant.compare_at_price : (product.compare_at_price ?? null)
  const savings = compareAt && compareAt > price ? compareAt - price : null
  const discountPct = savings ? Math.round((savings / compareAt!) * 100) : null
  const currentStock = activeVariant ? activeVariant.stock_quantity : product.stock_quantity
  const maxQty = currentStock > 0 ? currentStock : 99
  const isOutOfStock = (product.has_variants && activeVariant ? activeVariant.stock_quantity <= 0 : false) ||
    product.stock_status === 'out_of_stock' || (product.track_inventory && currentStock === 0)

  const variantTitle = activeVariant ? activeVariant.title : Object.values(selectedOptions).join(' / ')

  useEffect(() => {
    setShopSlug(shopSlug)
    useWishlistStore.getState().setShopSlug(shopSlug)
    trackEvent({ userId: profile.id, eventType: 'product_view', productId: product.id })
  }, [product.id, profile.id, shopSlug, setShopSlug])

  // Handle lightbox keyboard shortcuts
  useEffect(() => {
    if (!isLightboxOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false)
      if (e.key === 'ArrowRight') setActiveImage((prev) => (prev + 1) % images.length)
      if (e.key === 'ArrowLeft') setActiveImage((prev) => (prev - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, images.length])

  function validateVariantSelection(): boolean {
    if (!product.has_variants || !product.options || product.options.length === 0) return true

    for (const opt of product.options) {
      if (!selectedOptions[opt.name]) {
        toast.error(`Please select ${opt.name}`)
        return false
      }
    }
    return true
  }

  function handleAddToCart() {
    if (!validateVariantSelection()) return

    addItem({
      productId: product.id,
      name: product.name,
      price,
      image: activeVariant?.image_url || images[0] || null,
      quantity,
      stockQuantity: maxQty,
      variantId: activeVariant?.id,
      variantName: variantTitle || undefined,
      variantOptions: selectedOptions,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    trackEvent({ userId: profile.id, eventType: 'add_to_cart', productId: product.id })
  }

  function handleBuyNow() {
    if (!validateVariantSelection()) return

    buyNowItem({
      productId: product.id,
      name: product.name,
      price,
      image: activeVariant?.image_url || images[0] || null,
      quantity,
      stockQuantity: maxQty,
      variantId: activeVariant?.id,
      variantName: variantTitle || undefined,
      variantOptions: selectedOptions,
    })
    router.push(`/store/${shopSlug}/checkout`)
  }

  const handleShare = async () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on ${profile.business_name || profile.shop_name || 'Store'}!`,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success('Product link copied')
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <StoreHeader
        shopSlug={shopSlug}
        shopName={profile.business_name || profile.shop_name || 'Store'}
        logoUrl={profile.shop_logo_url || profile.avatar_url || theme?.shop_logo_url}
        announcement={profile.shop_announcement}
        theme={theme}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-2 mb-5 text-xs text-slate-500">
          <div className="min-w-0 flex-1 flex items-center gap-1.5 font-medium whitespace-nowrap overflow-hidden">
            <Link href={`/store/${shopSlug}`} className="hover:text-slate-900 transition-colors shrink-0">
              Home
            </Link>
            <span className="text-slate-300">›</span>
            <Link href={`/store/${shopSlug}/shop`} className="hover:text-slate-900 transition-colors shrink-0">
              Shop
            </Link>
            {product.category && (
              <>
                <span className="text-slate-300">›</span>
                <Link
                  href={`/store/${shopSlug}/shop?category=${encodeURIComponent(product.category)}`}
                  className="hover:text-slate-900 transition-colors truncate max-w-[120px] sm:max-w-none"
                >
                  {product.category}
                </Link>
              </>
            )}
            <span className="text-slate-300">›</span>
            <span className="text-slate-900 font-bold truncate max-w-[150px] sm:max-w-[300px]">{product.name}</span>
          </div>

          <button
            onClick={handleShare}
            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 whitespace-nowrap"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>

        {/* Main Product Card Container */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 lg:p-10 shadow-sm mb-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Left Column: Image Gallery */}
            <div className="space-y-4">
              {/* Main Image Preview Box */}
              <div
                className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 relative group cursor-pointer"
                onClick={() => images.length > 0 && setIsLightboxOpen(true)}
              >
                {images.length > 0 && !imgError ? (
                  <>
                    <Image
                      src={images[activeImage]}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                      onError={() => setImgError(true)}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsLightboxOpen(true)
                      }}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-700 p-2.5 rounded-full border border-slate-100 shadow-sm hover:scale-110 transition-all z-10"
                      aria-label="Expand view"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </>
                ) : images.length > 0 && imgError ? (
                  <>
                    {/* Native fallback img if Next Image optimizer fails */}
                    <img
                      src={images[activeImage]}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsLightboxOpen(true)
                      }}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-700 p-2.5 rounded-full border border-slate-100 shadow-sm hover:scale-110 transition-all z-10"
                      aria-label="Expand view"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                    <span className="text-6xl mb-2">📦</span>
                    <span className="text-xs font-semibold text-slate-400">No Image Available</span>
                  </div>
                )}

                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-20">
                    <span className="bg-white text-slate-900 text-xs font-black px-4 py-2 rounded-xl shadow-lg uppercase tracking-wider">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails Strip */}
              {images.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                  {images.slice(0, 4).map((img, i) => {
                    const isLastSlot = i === 3 && images.length > 4
                    const remainingCount = images.length - 3
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveImage(i)}
                        className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all relative ${
                          activeImage === i ? 'border-indigo-600 ring-2 ring-indigo-100 shadow-sm' : 'border-slate-200 opacity-80 hover:opacity-100'
                        }`}
                        aria-label={`View image ${i + 1}`}
                      >
                        <Image src={img} alt={`${product.name} thumbnail ${i + 1}`} fill className="object-cover" />
                        {isLastSlot && (
                          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center text-white font-extrabold text-sm">
                            +{remainingCount}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Product Information & Buy Controls */}
            <div className="flex flex-col">
              
              {/* Badge & Meta */}
              <div className="flex items-center gap-2 flex-wrap mb-2.5">
                {(() => {
                  const badgeText = product.badge
                    ? product.badge.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim()
                    : 'NEW ARRIVAL'

                  return (
                    <span className="inline-block text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider bg-[#2563eb] text-white shadow-sm">
                      {badgeText.toUpperCase()}
                    </span>
                  )
                })()}

                {product.sku && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 font-mono bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
                {product.name}
              </h1>

              {/* Clean Price Display (Matching image1.png design) */}
              {theme?.showPrices !== false && (
                <div className="mb-6 flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-extrabold text-[#00a650]">
                    ₹{price.toLocaleString('en-IN')}
                  </span>
                  {compareAt && compareAt > price && (
                    <span className="text-base text-slate-400 line-through font-semibold">
                      ₹{compareAt.toLocaleString('en-IN')}
                    </span>
                  )}
                  {discountPct && discountPct > 0 && (
                    <span className="bg-emerald-100 text-[#00a650] text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {discountPct}% OFF
                    </span>
                  )}
                </div>
              )}

              {/* Product Option Selectors (Size, Color, Weight, etc.) */}
              {product.has_variants && product.options && product.options.length > 0 && (
                <div className="space-y-5 mb-6">
                  {product.options.map((opt: any, optIdx: number) => {
                    const cascadingValues = getCascadingOptionValues(optIdx, opt.name, opt.values || [])

                    return (
                      <div key={opt.id || opt.name} className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                          <span>SELECT {opt.name}:</span>
                          <span className="text-indigo-600 font-bold">{selectedOptions[opt.name] || 'Select'}</span>
                        </div>

                        <div className="flex flex-wrap gap-2.5">
                          {cascadingValues.map(({ value: val, inStock }) => {
                            const isSelected = selectedOptions[opt.name] === val

                            return (
                              <button
                                key={val}
                                type="button"
                                onClick={() => {
                                  setSelectedOptions((prev) => {
                                    if (optIdx === 0) {
                                      // When Level 0 (e.g. Color) changes, set Level 0 choice & clear sub-options (e.g. Size)
                                      return { [opt.name]: val }
                                    }
                                    return { ...prev, [opt.name]: val }
                                  })
                                }}
                                className={`min-w-[48px] h-10 px-4 text-xs font-bold rounded-xl border flex items-center justify-center transition-all relative ${
                                  isSelected
                                    ? 'bg-[#4f46e5] text-white border-[#4f46e5] shadow-md shadow-indigo-100 ring-2 ring-indigo-200'
                                    : inStock
                                    ? 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                    : 'bg-slate-100/80 text-slate-400 border-slate-200/80 line-through opacity-60 cursor-pointer'
                                }`}
                                title={!inStock ? `${val} (Out of stock)` : val}
                              >
                                <span>{val}</span>
                                {!inStock && (
                                  <span className="ml-1 text-[9px] text-red-500 font-extrabold uppercase font-mono">(Out of stock)</span>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* In Stock Status Badge */}
              <div className="mb-6">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-50 text-red-600 rounded-full border border-red-200 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Out of Stock
                  </span>
                ) : product.stock_status === 'low_stock' ? (
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Low Stock — Only {product.stock_quantity || 'a few'} remaining!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#e6f9f0] text-[#00a650] border border-[#bbf7d0] rounded-full text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#00a650]" />
                    In Stock — Ready to ship
                  </span>
                )}
              </div>

              {/* 3-Column Trust Signals Block (Matching image1.png) */}
              <div className="py-4 border-t border-b border-slate-100 my-6 grid grid-cols-3 divide-x divide-slate-100 text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 px-2">
                  <Truck className="w-5 h-5 text-slate-700 shrink-0" />
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 leading-tight">Fast Delivery</div>
                    <div className="text-[11px] text-slate-500 font-medium">2-3 business days</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 px-2">
                  <RotateCcw className="w-5 h-5 text-slate-700 shrink-0" />
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 leading-tight">7 Days Return</div>
                    <div className="text-[11px] text-slate-500 font-medium">Easy returns</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 px-2">
                  <ShieldCheck className="w-5 h-5 text-slate-700 shrink-0" />
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 leading-tight">Trusted Shop</div>
                    <div className="text-[11px] text-slate-500 font-medium">100% secure</div>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="mb-6">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">QUANTITY</label>
                  <div className="inline-flex items-center border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden h-10">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-30"
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-12 text-center font-bold text-slate-900 text-sm">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                      className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-30"
                      disabled={quantity >= maxQty}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons (Add to Cart & Buy Now) */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="h-12 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider border-2 border-[#00a650] text-[#00a650] bg-white hover:bg-emerald-50 rounded-xl transition-all active:scale-[0.98] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{added ? '✓ ADDED!' : 'ADD TO CART'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="h-12 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider text-white bg-[#00a650] hover:bg-[#008d43] rounded-xl transition-all active:scale-[0.98] shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>BUY NOW</span>
                </button>
              </div>

              {/* Product Description */}
              {product.description && (
                <div className="mt-8 pt-6 border-t border-slate-100 space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</h3>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-normal">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Media Sections (Video & Audio if present) */}
          {(product.video_url || product.audio_url) && (
            <div className="mt-10 pt-8 border-t border-slate-100 grid md:grid-cols-2 gap-6">
              {/* Product Video */}
              {product.video_url && (() => {
                const url = product.video_url as string
                const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
                return (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                      <Video className="w-4 h-4 text-indigo-600" />
                      Product Video Preview
                    </div>
                    <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                      {youtubeMatch ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0`}
                          title="Product Video"
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video src={url} controls className="w-full h-full object-contain" />
                      )}
                    </div>
                  </div>
                )
              })()}

              {/* Product Audio */}
              {product.audio_url && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                    <Music className="w-4 h-4 text-purple-600" />
                    Audio Voice Preview
                  </div>
                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 shadow-sm flex flex-col justify-center">
                    <p className="text-xs text-purple-800 font-semibold mb-2">Listen to product details & specifications:</p>
                    <audio src={product.audio_url} controls className="w-full" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* "You may also like" Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">You may also like</h2>
              <Link
                href={`/store/${shopSlug}/shop`}
                className="text-xs font-bold text-[#4f46e5] hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {relatedProducts.map((p) => (
                <StoreProductCard
                  key={p.id}
                  product={p}
                  storeUserId={profile.id}
                  shopSlug={shopSlug}
                  theme={theme ? { buttonStyle: theme.buttonStyle, showPrices: theme.showPrices } : undefined}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {isLightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 p-2.5 rounded-full backdrop-blur-sm transition-colors z-50"
            aria-label="Close image preview"
          >
            <X className="w-6 h-6" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveImage((prev) => (prev - 1 + images.length) % images.length)
                }}
                className="absolute left-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-sm transition-colors z-50"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveImage((prev) => (prev + 1) % images.length)
                }}
                className="absolute right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-sm transition-colors z-50"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            className="relative w-full max-w-4xl h-[80vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeImage]}
              alt={`${product.name} fullscreen view ${activeImage + 1}`}
              fill
              className="object-contain"
              priority
              quality={95}
            />
          </div>

          <div className="absolute bottom-6 text-white/70 text-xs font-bold px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
            {activeImage + 1} / {images.length}
          </div>
        </div>
      )}

      <WhatsAppWidget profile={profile} theme={theme} />
      <StoreFooter profile={profile} theme={theme} />
    </div>
  )
}
