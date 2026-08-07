'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, RefreshCw, SlidersHorizontal, X, Check } from 'lucide-react'
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

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'bestselling', label: 'Best Selling' },
  { value: 'price-low', label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
]

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
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  // Temp state for bottom sheet (applied on confirm)
  const [tempSort, setTempSort] = useState<SortOption>('newest')
  const [tempCategory, setTempCategory] = useState<string | null>(null)

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

  const hasFilters = activeCategory || searchQuery
  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label || 'Newest'

  function openBottomSheet() {
    setTempSort(sortBy)
    setTempCategory(activeCategory)
    setShowBottomSheet(true)
  }

  function applyBottomSheet() {
    setSortBy(tempSort)
    setActiveCategory(tempCategory)
    setShowBottomSheet(false)
  }

  function resetBottomSheet() {
    setTempSort('newest')
    setTempCategory(null)
  }

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

        {/* ── Header Title & Controls Bar ── */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
              {activeCategory ? activeCategory : 'All Products'}
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-1.5">
              Showing {processedProducts.length} {processedProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          {/* Desktop: styled sort pill buttons + reset */}
          <div className="hidden sm:flex items-center gap-2">
            {SORT_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => setSortBy(o.value)}
                className={`px-3.5 py-2 rounded-full text-[11px] font-bold tracking-wide transition-all border ${
                  sortBy === o.value
                    ? 'bg-slate-950 text-white border-slate-950 shadow-sm'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700'
                }`}
              >
                {o.label}
              </button>
            ))}
            {hasFilters && (
              <button
                onClick={() => { setActiveCategory(null); setSearchQuery('') }}
                className="ml-1 flex items-center gap-1.5 px-3 py-2 border border-dashed border-slate-300 text-slate-500 hover:text-slate-800 hover:border-slate-500 rounded-full text-[11px] font-bold transition-all"
              >
                <RefreshCw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Mobile: Filter/Sort button */}
          <button
            onClick={openBottomSheet}
            className="sm:hidden flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
            {hasFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-slate-800 ml-0.5" />
            )}
          </button>
        </div>

        {/* ── Desktop: Premium Category Filter Bar ── */}
        <div className="hidden sm:flex items-center gap-1.5 mb-8 p-1.5 bg-slate-50 border border-slate-100 rounded-2xl overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 whitespace-nowrap ${
              activeCategory === null
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap capitalize ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 font-black'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* ── Mobile: horizontal category chips (no filter sheet needed for category scroll) ── */}
        <div className="sm:hidden mb-6 flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all shrink-0 ${activeCategory === null
              ? 'bg-slate-950 text-white'
              : 'bg-slate-100 text-slate-600'
              }`}
          >
            All
          </button>
          {chipCategories.map((cat) => {
            const isActive = activeCategory?.toLowerCase() === cat.toLowerCase()
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(isActive ? null : cat)}
                className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 ${isActive
                  ? 'bg-slate-950 text-white font-black'
                  : 'bg-slate-100 text-slate-600'
                  }`}
              >
                {cat}
              </button>
            )
          })}
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
          <div className="text-center py-20 bg-slate-50/70 rounded-3xl border border-slate-100 max-w-xl mx-auto my-8 p-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4 border border-slate-100 shadow-sm">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">No products found</h3>
            <p className="text-xs text-slate-500 font-medium mb-6">
              We couldn&apos;t find any products matching &quot;{searchQuery || activeCategory}&quot;. Try searching for another item or clear your filters.
            </p>
            <button
              onClick={() => { setActiveCategory(null); setSearchQuery('') }}
              className="px-6 py-3 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              Browse All Categories
            </button>
          </div>
        )}

      </main>

      <StoreFooter profile={profile} theme={theme} />

      {/* ── Mobile Bottom Sheet Filter/Sort ── */}
      {showBottomSheet && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 sm:hidden"
            onClick={() => setShowBottomSheet(false)}
          />
          {/* Sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white rounded-t-2xl shadow-2xl px-5 pt-4 pb-8 animate-[slideUp_0.25s_ease-out]">
            {/* Handle */}
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-black text-slate-900">Sort & Filter</h2>
              <button onClick={() => setShowBottomSheet(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100">
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* Sort Section */}
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Sort By</p>
            <div className="flex flex-col gap-1 mb-6">
              {SORT_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setTempSort(o.value)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${tempSort === o.value
                    ? 'bg-slate-950 text-white'
                    : 'bg-slate-100 text-slate-700'
                    }`}
                >
                  <span>{o.label}</span>
                  {tempSort === o.value && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>

            {/* Category Section */}
            {chipCategories.length > 0 && (
              <>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Category</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => setTempCategory(null)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${tempCategory === null
                      ? 'bg-slate-950 text-white'
                      : 'bg-slate-100 text-slate-600'
                      }`}
                  >
                    All
                  </button>
                  {chipCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setTempCategory(tempCategory?.toLowerCase() === cat.toLowerCase() ? null : cat)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${tempCategory?.toLowerCase() === cat.toLowerCase()
                        ? 'bg-slate-950 text-white'
                        : 'bg-slate-100 text-slate-600'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={resetBottomSheet}
                className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold transition-colors hover:bg-slate-200"
              >
                Reset
              </button>
              <button
                onClick={applyBottomSheet}
                className="flex-2 flex-grow-[2] py-3 rounded-xl bg-slate-950 text-white text-sm font-bold transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
