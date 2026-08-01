'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
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
}

export function StoreProductCard({ product, storeUserId, layout = 'grid', theme }: StoreProductCardProps) {
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

  if (layout === 'list') {
    return (
      <div className="flex gap-4 bg-white rounded-2xl border border-slate-100 p-3 hover:shadow-md hover:border-slate-200/80 transition-all duration-300 relative group">
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
            <p className="font-extrabold text-xs sm:text-sm text-slate-900 line-clamp-1 leading-tight">{product.name}</p>
            
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
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white rounded-lg transition-all active:scale-95 shadow-sm ${
                added ? 'bg-emerald-600' : 'bg-slate-950 hover:bg-slate-800'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
              {added ? 'Added' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group bg-white rounded-2xl border border-slate-100/90 overflow-hidden hover:shadow-lg hover:border-slate-200/70 transition-all duration-300 flex flex-col h-full relative">
      {/* Discount Badge */}
      {discountPct && discountPct > 0 && (
        <span className="absolute top-2.5 left-2.5 z-10 bg-slate-950 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
          -{discountPct}%
        </span>
      )}

      {/* Wishlist Toggle Button */}
      <button
        onClick={(e) => {
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
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-slate-700 transition-colors">
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
            className={`w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-white rounded-xl transition-all active:scale-[0.98] shadow-sm ${
              added ? 'bg-emerald-600' : 'bg-slate-950 hover:bg-slate-800'
            } disabled:bg-slate-200 disabled:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            {isOutOfStock ? 'Out of Stock' : added ? 'Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
