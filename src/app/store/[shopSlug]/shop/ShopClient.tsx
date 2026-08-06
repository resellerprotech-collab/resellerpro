'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Filter, ChevronDown, Folder, Search, ArrowUpDown, RefreshCw, Layers } from 'lucide-react'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreProductCard } from '@/components/store/StoreProductCard'
import { StoreFooter } from '@/components/store/StoreFooter'
import { trackEvent } from '@/lib/analytics'
import { useCartStore } from '@/store/useCartStore'
import type { Product, Profile, ShopTheme } from '@/types'

interface ShopClientProps {
  profile: Profile
  products: Product[]
  categories: string[]
  theme: ShopTheme | null
  initialSearch?: string
  initialCategory?: string
}

type SortOption = 'newest' | 'bestselling' | 'price-low' | 'price-high'

export function ShopClient({
  profile,
  products,
  categories,
  theme,
  initialSearch = '',
  initialCategory = null as any,
}: ShopClientProps) {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category')
  const searchFromUrl = searchParams.get('search')

  const [searchQuery, setSearchQuery] = useState(searchFromUrl || initialSearch)
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryFromUrl || initialCategory || null)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [visibleCount, setVisibleCount] = useState(12)
  const setShopSlug = useCartStore((s) => s.setShopSlug)

  const shopSlug = profile.shop_slug!
  const storeName = profile.business_name || profile.shop_name || 'Store'

  useEffect(() => {
    setShopSlug(shopSlug)
    trackEvent({ userId: profile.id, eventType: 'store_view' })
  }, [shopSlug, profile.id, setShopSlug])

  const displayProducts = products
  const chipCategories = categories

  // Filter & Sort
  const processedProducts = useMemo(() => {
    const list = displayProducts.filter((p) => {
      const matchCat = activeCategory ? p.category?.toLowerCase() === activeCategory.toLowerCase() : true
      const matchSearch = searchQuery
        ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
        : true
      return matchCat && matchSearch
    })

    // Sorting logic
    return list.sort((a, b) => {
      const priceA = a.selling_price ?? a.price ?? 0
      const priceB = b.selling_price ?? b.price ?? 0
      if (sortBy === 'price-low') return priceA - priceB
      if (sortBy === 'price-high') return priceB - priceA
      if (sortBy === 'bestselling') return (b.stock_quantity || 0) - (a.stock_quantity || 0)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [displayProducts, activeCategory, searchQuery, sortBy])

  const visibleProducts = processedProducts.slice(0, visibleCount)

  return (
    <div className="min-h-screen bg-white">
      <StoreHeader
        shopSlug={shopSlug}
        shopName={storeName}
        logoUrl={profile.shop_logo_url || profile.avatar_url}
        announcement={profile.shop_announcement}
        theme={theme}
        onSearch={setSearchQuery}
        activePage="shop"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header Title & Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Complete Catalog
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {activeCategory ? activeCategory : 'All Products'}
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Showing {processedProducts.length} {processedProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold py-2.5 pl-4 pr-9 rounded-xl border border-slate-200/60 focus:outline-none focus:bg-white cursor-pointer transition-colors"
              >
                <option value="newest">Sort by: Newest</option>
                <option value="bestselling">Sort by: Best Selling</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Clear Filters Button */}
            {(activeCategory || searchQuery) && (
              <button
                onClick={() => {
                  setActiveCategory(null)
                  setSearchQuery('')
                }}
                className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-bold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* 1-Click Category Chips */}
        <div className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${activeCategory === null
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
            >
              All Products
            </button>
            {chipCategories.map((cat) => {
              const isActive = activeCategory?.toLowerCase() === cat.toLowerCase()
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(isActive ? null : cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${isActive
                      ? 'bg-slate-950 text-white shadow-sm font-black'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                    }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Product Grid / Empty State */}
        {processedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 mb-10">
              {visibleProducts.map((product) => (
                <StoreProductCard
                  key={product.id}
                  product={product}
                  storeUserId={profile.id}
                  shopSlug={shopSlug}
                  theme={theme ? { buttonStyle: theme.buttonStyle, showPrices: theme.showPrices } : undefined}
                />
              ))}
            </div>

            {/* Load More Pagination */}
            {visibleCount < processedProducts.length && (
              <div className="text-center pt-4 pb-8">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="px-8 py-3.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
                >
                  Load More Products ({processedProducts.length - visibleCount} Remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-slate-50/70 rounded-3xl border border-slate-100 max-w-xl mx-auto my-8 p-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4 border border-slate-100 shadow-sm">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">No products found</h3>
            <p className="text-xs text-slate-500 font-medium mb-6">
              We couldn't find any products matching "{searchQuery || activeCategory}". Try searching for another item or clear your filters.
            </p>
            <button
              onClick={() => {
                setActiveCategory(null)
                setSearchQuery('')
              }}
              className="px-6 py-3 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              Browse All Categories
            </button>
          </div>
        )}

      </main>

      <StoreFooter profile={profile} theme={theme} />
    </div>
  )
}
