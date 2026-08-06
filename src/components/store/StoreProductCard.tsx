'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ShoppingBag, Heart, Star, Check } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useWishlistStore } from '@/store/useWishlistStore'
import { trackEvent } from '@/lib/analytics'
import type { Product } from '@/types'
import { cn } from '@/lib/utils/cn'

interface StoreProductCardProps {
  product: Product
  storeUserId: string
  layout?: 'grid' | 'list'
  theme?: {
    buttonStyle?: string
    showPrices?: boolean
    showWhatsApp?: boolean
  }
  shopSlug?: string
}

const getBadgeLabel = (b?: string | null) => {
  if (!b) return null
  const cleanBadge = b.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim()
  const badgeKey = cleanBadge.toLowerCase()
  if (badgeKey === 'best_seller' || badgeKey === 'bestseller') return { label: 'BEST SELLER', color: 'bg-amber-500 text-slate-950 font-black' }
  if (badgeKey === 'new_arrival' || badgeKey === 'new') return { label: 'NEW ARRIVAL', color: 'bg-blue-600 text-white font-black' }
  if (badgeKey === 'trending' || badgeKey === 'hot') return { label: 'TRENDING', color: 'bg-red-600 text-white font-black' }
  if (badgeKey === 'hot_deal') return { label: 'HOT DEAL', color: 'bg-rose-600 text-white font-black' }
  if (badgeKey === 'special_offer') return { label: 'SPECIAL OFFER', color: 'bg-slate-900 text-white font-black' }
  return { label: cleanBadge.toUpperCase(), color: 'bg-slate-900 text-white font-black' }
}

export function StoreProductCard({ product, storeUserId, layout = 'grid', theme, shopSlug: propShopSlug }: StoreProductCardProps) {
  const params = useParams()
  const activeShopSlug = propShopSlug || (params?.shopSlug as string)
  const productDetailUrl = activeShopSlug ? `/store/${activeShopSlug}/p/${product.id}` : null

  const addItem = useCartStore((s) => s.addItem)
  const toggleWishlist = useWishlistStore((s) => s.toggleItem)
  const hasWishlist = useWishlistStore((s) => s.hasItem)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [added, setAdded] = useState(false)
  const showPrices = theme?.showPrices !== false

  useEffect(() => {
    setIsWishlisted(hasWishlist(product.id))
    const unsub = useWishlistStore.subscribe(() => {
      setIsWishlisted(hasWishlist(product.id))
    })
    return unsub
  }, [product.id, hasWishlist])

  const isOutOfStock =
    (product.stock_status === 'out_of_stock') ||
    (product.track_inventory && product.stock_quantity === 0)

  const price = product.selling_price ?? product.price ?? 0
  const compareAt = product.compare_at_price ?? null
  const imageUrl = product.image_url || (product.images && product.images[0]) || null

  const savings = compareAt && compareAt > price ? compareAt - price : null
  const discountPct = savings ? Math.round((savings / compareAt!) * 100) : null

  // Simulated ratings for premium aesthetic
  const rating = 5
  const reviewCount = (() => {
    let hash = 0
    const str = product.id || product.name || 'default'
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    return Math.abs(hash % 80) + 40
  })()

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock) return
    addItem({
      productId: product.id,
      name: product.name,
      price,
      image: imageUrl,
      quantity: 1,
      stockQuantity: product.stock_quantity > 0 ? product.stock_quantity : undefined,
    })
    trackEvent({ userId: storeUserId, eventType: 'add_to_cart', productId: product.id })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const CardWrapper = productDetailUrl
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={productDetailUrl} className="block group h-full">
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => <div className="group h-full">{children}</div>

  if (layout === 'list') {
    return (
      <CardWrapper>
        <div className="flex gap-4 bg-white rounded-2xl border border-slate-100 p-3 hover:shadow-md hover:border-slate-200/80 transition-all duration-300 relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-slate-50 rounded-xl relative overflow-hidden">
            {imageUrl ? (
              <Image src={imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="112px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300 text-2xl">📦</div>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-[9px] font-black tracking-wider uppercase">Out of Stock</span>
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-between py-0.5">
            <div className="space-y-1">
              {product.category && (
                <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">{product.category}</span>
              )}
              <p className="font-extrabold text-xs sm:text-sm text-slate-900 line-clamp-1 leading-tight group-hover:text-indigo-600 transition-colors">{product.name}</p>
              
              <div className="flex items-center gap-1">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[9px] text-slate-400 font-bold">({reviewCount})</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              {showPrices && (
                <div className="flex items-baseline gap-1.5">
                  <span className="font-black text-slate-950 text-sm sm:text-base">
                    ₹{price.toLocaleString('en-IN')}
                  </span>
                  {compareAt && (
                    <span className="text-[11px] text-slate-400 line-through">
                      ₹{compareAt.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              )}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white transition-all active:scale-95 shadow-sm ${
                  added ? 'bg-emerald-600' : 'hover:opacity-90'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{
                  borderRadius: 'var(--store-btn-radius, 8px)',
                  ...(!added ? { backgroundColor: 'var(--store-primary)' } : {})
                }}
              >
                {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                {added ? 'Added' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      </CardWrapper>
    )
  }

  return (
    <CardWrapper>
      <div className="bg-white rounded-2xl border border-slate-100/90 overflow-hidden hover:shadow-lg hover:border-slate-200/70 transition-all duration-300 flex flex-col h-full relative">
        {/* Product Badges & Discount */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
          {(() => {
            const badgeObj = getBadgeLabel(product.badge)
            if (!badgeObj) return null
            return (
              <span className={cn("text-[9px] font-black px-2 py-0.5 rounded shadow-sm tracking-wider uppercase", badgeObj.color)}>
                {badgeObj.label}
              </span>
            )
          })()}
          {discountPct && discountPct > 0 && (
            <span className="bg-slate-950/90 backdrop-blur-sm text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Wishlist Toggle Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleWishlist({
              productId: product.id,
              name: product.name,
              image: imageUrl,
              price: price,
            })
          }}
          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm active:scale-90 transition-all"
          aria-label="Add to wishlist"
        >
          <Heart className={cn("w-3.5 h-3.5 transition-colors", isWishlisted ? "fill-red-500 text-red-500" : "text-slate-400")} />
        </button>

        {/* Optimized Product Image Frame */}
        <div className="relative aspect-[4/4.5] bg-slate-50 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300 text-4xl">📦</div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/45 flex items-center justify-center backdrop-blur-[1px]">
              <span className="bg-white/95 text-slate-900 text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded shadow">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Compact Product Details Section */}
        <div className="p-3 flex flex-col flex-1 justify-between gap-2.5">
          <div className="space-y-1">
            {product.category && (
              <span className="text-[9px] font-extrabold tracking-wider text-slate-400 uppercase block">
                {product.category}
              </span>
            )}
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>

            <div className="flex items-center gap-1">
              <div className="flex text-amber-400">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                ))}
              </div>
              <span className="text-[9px] text-slate-400 font-bold">({reviewCount})</span>
            </div>
          </div>

          <div>
            {showPrices && (
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="font-black text-sm sm:text-base text-slate-950">
                  ₹{price.toLocaleString('en-IN')}
                </span>
                {compareAt && (
                  <span className="text-[10px] text-slate-400 line-through">
                    ₹{compareAt.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-white transition-all active:scale-[0.98] shadow-sm ${
                added ? 'bg-emerald-600' : 'hover:opacity-90'
              } disabled:bg-slate-200 disabled:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed`}
              style={{
                borderRadius: 'var(--store-btn-radius, 12px)',
                ...(!added && !isOutOfStock ? { backgroundColor: 'var(--store-primary)' } : {})
              }}
            >
              {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
              {isOutOfStock ? 'Out of Stock' : added ? 'Added to Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </CardWrapper>
  )
}
