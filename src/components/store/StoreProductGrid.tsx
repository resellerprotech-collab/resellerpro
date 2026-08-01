'use client'

import { StoreProductCard } from './StoreProductCard'
import type { Product, ShopTheme } from '@/types'

interface StoreProductGridProps {
  products: Product[]
  storeUserId: string
  theme: ShopTheme | null
  layout?: 'grid' | 'list'
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-slate-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
        <div className="h-8 bg-slate-200 rounded-xl mt-3" />
      </div>
    </div>
  )
}

export function StoreProductGrid({ products, storeUserId, theme, layout = 'grid' }: StoreProductGridProps) {
  const activeLayout = theme?.layout || layout

  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-slate-50/60 rounded-3xl border border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 text-xl">
          📦
        </div>
        <h3 className="text-base font-bold text-slate-800">No products available</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          This store has not listed any products yet.
        </p>
      </div>
    )
  }

  if (activeLayout === 'list') {
    return (
      <div className="space-y-3">
        {products.map((product) => (
          <StoreProductCard
            key={product.id}
            product={product}
            storeUserId={storeUserId}
            layout="list"
            theme={theme ? { buttonStyle: theme.buttonStyle, showPrices: theme.showPrices } : undefined}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {products.map((product) => (
        <StoreProductCard
          key={product.id}
          product={product}
          storeUserId={storeUserId}
          layout="grid"
          theme={theme ? { buttonStyle: theme.buttonStyle, showPrices: theme.showPrices } : undefined}
        />
      ))}
    </div>
  )
}

export function StoreProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
