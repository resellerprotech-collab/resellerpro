'use client'

import { useState, useMemo, useEffect } from 'react'
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
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory || null)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [visibleCount, setVisibleCount] = useState(12)
  const setShopSlug = useCartStore((s) => s.setShopSlug)

  const shopSlug = profile.shop_slug!
  const storeName = profile.shop_name || profile.business_name || 'Store'

  useEffect(() => {
    setShopSlug(shopSlug)
    trackEvent({ userId: profile.id, eventType: 'store_view' })
  }, [shopSlug, profile.id, setShopSlug])

  // Default sample products if store has no products yet
  const mockProducts: Product[] = [
    {
      id: 'mock-1',
      user_id: profile.id,
      sku: 'PROD-001',
      name: 'Premium Chronograph Watch',
      description: 'Elegant luxury watch featuring multi-dial chronograph performance.',
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
      description: 'Pro-tier wireless earbuds with active noise cancellation.',
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
      description: 'Over-ear headphones with custom audio driver engineering.',
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
      description: 'Minimalist water-resistant laptop travel bag.',
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
    },
    {
      id: 'mock-5',
      user_id: profile.id,
      sku: 'PROD-005',
      name: 'Classic Leather Wallet',
      description: 'Handcrafted genuine leather bifold wallet with RFID blocking.',
      price: 899,
      selling_price: 899,
      compare_at_price: 1299,
      image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop',
      stock_status: 'in_stock',
      category: 'Accessories',
      cost_price: 400,
      stock_quantity: 20,
      is_active: true,
      profit: 499,
      profit_margin: 55,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'mock-6',
      user_id: profile.id,
      sku: 'PROD-006',
      name: 'Minimalist Smart Ring',
      description: 'Health & sleep tracking smart ring in sleek matte finish.',
      price: 4499,
      selling_price: 4499,
      compare_at_price: 5999,
      image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop',
      stock_status: 'in_stock',
      category: 'Electronics',
      cost_price: 2500,
      stock_quantity: 12,
      is_active: true,
      profit: 1999,
      profit_margin: 44,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  const displayProducts = useMemo(() => {
    return products.length > 0 ? products : mockProducts
  }, [products])

  const chipCategories = useMemo(() => {
    const defaultChips = ['Fashion', 'Jewellery', 'Electronics', 'Shoes', 'Watches', 'Food', 'Accessories']
    if (categories.length > 0) {
      return Array.from(new Set([...categories, ...defaultChips]))
    }
    return defaultChips
  }, [categories])

  // Filter & Sort
  const processedProducts = useMemo(() => {
    let list = displayProducts.filter((p) => {
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
    <div className="min-h-screen bg-white pb-12">
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
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${
                activeCategory === null
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
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isActive
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
