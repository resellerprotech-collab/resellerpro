'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft, ShoppingCart, Zap, Minus, Plus, Star, Tag,
  Share2, Check, MessageCircle, ShieldCheck, Truck, RotateCcw,
  Video, Music, Maximize2, X, Copy, ChevronRight, Box
} from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { trackEvent } from '@/lib/analytics'
import { useToast } from '@/hooks/use-toast'
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
  const { toast } = useToast()
  const { addItem, closeCart, setShopSlug } = useCartStore()

  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const images: string[] = product.images?.length
    ? product.images
    : product.image_url
    ? [product.image_url]
    : []

  const price = product.selling_price ?? product.price ?? 0
  const compareAt = product.compare_at_price ?? null
  const savings = compareAt && compareAt > price ? compareAt - price : null
  const discountPct = savings ? Math.round((savings / compareAt!) * 100) : null
  const maxQty = product.stock_quantity > 0 ? product.stock_quantity : 99
  const isOutOfStock = product.stock_status === 'out_of_stock' || (product.track_inventory && product.stock_quantity === 0)
  const primaryColor = theme?.primaryColor || '#6366f1'
  const btnRadius = theme?.buttonStyle === 'pill' ? 'rounded-full' : theme?.buttonStyle === 'sharp' ? 'rounded-none' : 'rounded-xl'

  useEffect(() => {
    setShopSlug(shopSlug)
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

  function handleAddToCart() {
    addItem({ productId: product.id, name: product.name, price, image: images[0] ?? null, quantity, stockQuantity: maxQty })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    trackEvent({ userId: profile.id, eventType: 'add_to_cart', productId: product.id })
  }

  function handleBuyNow() {
    closeCart()
    addItem(
      { productId: product.id, name: product.name, price, image: images[0] ?? null, quantity, stockQuantity: maxQty },
      { openDrawer: false }
    )
    closeCart()
    router.push(`/store/${shopSlug}/checkout`)
  }

  const handleShare = async () => {
    const shareUrl = window.location.href
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on ${profile.business_name || profile.shop_name || 'Store'}!`,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast({ title: 'Link copied!', description: 'Product link copied to clipboard' })
      setTimeout(() => setCopied(false), 2500)
    }
  }

  // Pre-filled WhatsApp inquiry link for this specific product
  const waInquiryLink = useMemo(() => {
    const phone = profile.whatsapp_number || profile.phone || profile.business_phone
    if (!phone) return null
    const cleanPhone = phone.replace(/\D/g, '')
    const productUrl = typeof window !== 'undefined' ? window.location.href : `https://resellerpro.in/store/${shopSlug}/p/${product.id}`
    const text = encodeURIComponent(
      `Hi ${profile.business_name || profile.shop_name || 'Store'}, I want to inquire about "${product.name}" (Price: ₹${price.toLocaleString('en-IN')}).\nProduct Link: ${productUrl}`
    )
    return `https://wa.me/91${cleanPhone}?text=${text}`
  }, [profile, product, price, shopSlug])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <StoreHeader
        shopSlug={shopSlug}
        shopName={profile.business_name || profile.shop_name || 'Store'}
        logoUrl={profile.shop_logo_url || profile.avatar_url}
        announcement={profile.shop_announcement}
        theme={theme}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-2 mb-6 text-xs text-slate-500 flex-wrap">
          <div className="flex items-center gap-1.5 font-medium">
            <Link href={`/store/${shopSlug}`} className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href={`/store/${shopSlug}/shop`} className="hover:text-slate-900 transition-colors">
              Shop
            </Link>
            {product.category && (
              <>
                <span>/</span>
                <Link
                  href={`/store/${shopSlug}/shop?category=${encodeURIComponent(product.category)}`}
                  className="hover:text-slate-900 transition-colors"
                >
                  {product.category}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-slate-900 font-bold truncate max-w-[200px]">{product.name}</span>
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            {copied ? 'Link Copied' : 'Share Product'}
          </button>
        </div>

        {/* Product Details Section */}
        <div className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-8 shadow-sm mb-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column: Image Gallery */}
            <div className="space-y-4">
              {/* Main Image Frame */}
              <div
                className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 relative group cursor-pointer"
                onClick={() => images.length > 0 && setIsLightboxOpen(true)}
              >
                {images.length > 0 ? (
                  <>
                    <Image
                      src={images[activeImage]}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-700 p-2 rounded-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                    <span className="text-6xl mb-2">📦</span>
                    <span className="text-xs font-semibold text-slate-400">No Image Available</span>
                  </div>
                )}

                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-white text-slate-900 text-sm font-black px-4 py-2 rounded-xl shadow-lg uppercase tracking-wider">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all relative ${
                        activeImage === i ? 'ring-2 ring-offset-1 scale-105 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                      style={activeImage === i ? { borderColor: primaryColor, outlineColor: primaryColor } : {}}
                      aria-label={`View image ${i + 1}`}
                    >
                      <Image src={img} alt={`${product.name} thumbnail ${i + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Information & Controls */}
            <div className="flex flex-col">
              {/* Category & Badge */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {product.category && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                    <Tag className="w-3 h-3 text-slate-400" />
                    {product.category}
                  </span>
                )}

                {product.badge && (
                  {...(() => {
                    const clean = product.badge.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim()
                    const k = clean.toLowerCase()
                    let badgeStyle = 'bg-slate-900 text-white'
                    let label = clean.toUpperCase()

                    if (k === 'best_seller' || k === 'bestseller') {
                      badgeStyle = 'bg-amber-500 text-slate-950 font-black'
                      label = 'BEST SELLER'
                    } else if (k === 'new_arrival' || k === 'new') {
                      badgeStyle = 'bg-blue-600 text-white font-black'
                      label = 'NEW ARRIVAL'
                    } else if (k === 'trending' || k === 'hot') {
                      badgeStyle = 'bg-red-600 text-white font-black'
                      label = 'TRENDING'
                    } else if (k === 'hot_deal') {
                      badgeStyle = 'bg-rose-600 text-white font-black'
                      label = 'HOT DEAL'
                    } else if (k === 'special_offer') {
                      badgeStyle = 'bg-slate-900 text-white font-black'
                      label = 'SPECIAL OFFER'
                    }

                    return (
                      <span className={`inline-block text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm ${badgeStyle}`}>
                        {label}
                      </span>
                    )
                  })()}
                )}

                {product.sku && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 font-mono bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-3">
                {product.name}
              </h1>

              {/* Price & Savings */}
              {theme?.showPrices !== false && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-5 space-y-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-slate-900" style={{ color: primaryColor }}>
                      ₹{price.toLocaleString('en-IN')}
                    </span>
                    {compareAt && compareAt > price && (
                      <span className="text-base text-slate-400 line-through font-semibold">
                        ₹{compareAt.toLocaleString('en-IN')}
                      </span>
                    )}
                    {discountPct && discountPct > 0 && (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {discountPct}% OFF
                      </span>
                    )}
                  </div>
                  {savings && savings > 0 && (
                    <p className="text-xs font-bold text-emerald-700">
                      🎉 You save ₹{savings.toLocaleString('en-IN')} on this order!
                    </p>
                  )}
                </div>
              )}

              {/* Stock Status Indicator */}
              <div className="flex items-center gap-2 mb-5 text-xs font-bold">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-200">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Out of Stock
                  </span>
                ) : product.stock_status === 'low_stock' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Low Stock — Only {product.stock_quantity || 'a few'} remaining!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    In Stock — Ready to ship
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-6 space-y-1.5">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Description</h3>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-normal">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="mb-6">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Quantity</label>
                  <div className="inline-flex items-center border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30"
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-black text-slate-900 text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30"
                      disabled={quantity >= maxQty}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons (Add to Cart & Buy Now) */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4 mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 h-12 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider border-2 transition-all active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${btnRadius}`}
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {added ? '✓ Added to Cart!' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`flex-1 h-12 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider text-white transition-all active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${btnRadius}`}
                  style={{ backgroundColor: primaryColor }}
                >
                  <Zap className="w-4 h-4" />
                  Buy Now
                </button>
              </div>

              {/* WhatsApp Direct Inquiry Button */}
              {waInquiryLink && (
                <a
                  href={waInquiryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 mb-6"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  Inquire via WhatsApp
                </a>
              )}

              {/* Trust Signals Strip */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-slate-500">
                <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50/70">
                  <Truck className="w-4 h-4 text-slate-700" />
                  <span className="text-[10px] font-bold text-slate-700">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50/70">
                  <ShieldCheck className="w-4 h-4 text-slate-700" />
                  <span className="text-[10px] font-bold text-slate-700">COD Available</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50/70">
                  <RotateCcw className="w-4 h-4 text-slate-700" />
                  <span className="text-[10px] font-bold text-slate-700">100% Genuine</span>
                </div>
              </div>
            </div>
          </div>

          {/* Media Sections (Video & Audio from Add Product Section) */}
          {(product.video_url || product.audio_url) && (
            <div className="mt-10 pt-8 border-t border-slate-100 grid md:grid-cols-2 gap-6">
              {/* Product Video */}
              {product.video_url && (() => {
                const url = product.video_url as string
                const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
                return (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
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
                  <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
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

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">More Options</span>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">You Might Also Like</h2>
              </div>
              <Link
                href={`/store/${shopSlug}/shop`}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <span>View Store Catalog</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 p-2.5 rounded-full backdrop-blur-sm transition-colors z-50"
            aria-label="Close image preview"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation arrow buttons */}
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

          {/* Image display */}
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

          {/* Image counter */}
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
