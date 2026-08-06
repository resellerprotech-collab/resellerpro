'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Search, X, Clock, Sparkles, ArrowRight, TrendingUp, Tag, Package, ChevronRight, Layers } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  shopSlug: string
  onSearchSubmit?: (query: string) => void
}

const POPULAR_SUGGESTIONS = ['All Products', 'Trending', 'Best Sellers', 'New Arrivals', 'Offers']

export function SearchModal({ isOpen, onClose, shopSlug, onSearchSubmit }: SearchModalProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const storageKey = `resellerpro_recent_searches_${shopSlug}`

  // Load recent searches from localStorage on mount/open
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem(storageKey)
        if (saved) {
          setRecentSearches(JSON.parse(saved))
        }
      } catch (err) {
        console.error('Failed to load recent searches:', err)
      }
    }
  }, [isOpen, storageKey])

  // Focus input when modal opens & fetch initial products
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)

      // Fetch products for store
      async function fetchProducts() {
        setLoading(true)
        try {
          const supabase = createClient()
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('shop_slug', shopSlug)
            .single()

          if (profile?.id) {
            const { data: prods } = await supabase
              .from('products')
              .select('*')
              .eq('user_id', profile.id)
              .order('created_at', { ascending: false })
              .limit(20)

            if (prods) {
              setAllProducts(prods as Product[])
            }
          }
        } catch (err) {
          console.error('Search modal fetch error:', err)
        } finally {
          setLoading(false)
        }
      }

      fetchProducts()

      return () => clearTimeout(timer)
    } else {
      setQuery('')
    }
  }, [isOpen, shopSlug])

  // Handle live search filtering
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const q = query.toLowerCase().trim()
    const filtered = allProducts.filter((p) => {
      const matchName = p.name?.toLowerCase().includes(q)
      const matchCategory = p.category?.toLowerCase().includes(q)
      const matchDesc = p.description?.toLowerCase().includes(q)
      return matchName || matchCategory || matchDesc
    })

    setSearchResults(filtered)
  }, [query, allProducts])

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Save to recent searches helper
  function saveRecentSearch(term: string) {
    const trimmed = term.trim()
    if (!trimmed) return
    const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5)
    setRecentSearches(updated)
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to save recent search:', e)
    }
  }

  // Clear single recent search item
  function removeRecentSearch(term: string, e: React.MouseEvent) {
    e.stopPropagation()
    const updated = recentSearches.filter((s) => s !== term)
    setRecentSearches(updated)
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to update recent searches:', e)
    }
  }

  // Clear all recent searches
  function clearAllRecent() {
    setRecentSearches([])
    try {
      localStorage.removeItem(storageKey)
    } catch (e) {
      console.error('Failed to clear recent searches:', e)
    }
  }

  // Submit search query
  function handleExecuteSearch(searchTerm: string) {
    if (!searchTerm.trim()) return
    saveRecentSearch(searchTerm)
    onClose()

    if (onSearchSubmit) {
      onSearchSubmit(searchTerm)
    } else {
      router.push(`/store/${shopSlug}/shop?search=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    handleExecuteSearch(query)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Container Centered */}
        <div className="min-h-full flex items-center justify-center p-3 sm:p-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -15 }}
            transition={{ type: 'spring', duration: 0.25 }}
            className="relative w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-[10px] shadow-2xl border border-slate-200/80 dark:border-slate-800 text-left overflow-hidden z-50 flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Top Bar */}
            <form onSubmit={handleFormSubmit} className="relative flex items-center px-4 sm:px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-transparent">
              <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, categories, or tags..."
                className="w-full text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-2.5 py-1 text-xs font-semibold rounded-[10px] border border-slate-200 dark:border-slate-700 bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              >
                ESC
              </button>
            </form>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-transparent">
              {/* 1. QUERY TYPED -> Live Search Results */}
              {query.trim() !== '' ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Search Results ({searchResults.length})
                    </span>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {searchResults.map((product) => {
                        const price = product.selling_price ?? product.price ?? 0
                        const img = product.images?.[0] || product.image_url || '/placeholder.png'
                        return (
                          <Link
                            key={product.id}
                            href={`/store/${shopSlug}/p/${product.id}`}
                            onClick={() => {
                              saveRecentSearch(query)
                              onClose()
                            }}
                            className="group flex items-center gap-3 p-2.5 rounded-[10px] border border-slate-200/80 dark:border-slate-800 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all shadow-xs"
                          >
                            <div className="relative w-14 h-14 rounded-[10px] overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/50">
                              <img src={img} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 transition-colors">
                                {product.name}
                              </h4>
                              {product.category && (
                                <span className="inline-block text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate mt-0.5">
                                  {product.category}
                                </span>
                              )}
                              <p className="text-xs font-black text-slate-900 dark:text-slate-200 mt-1">
                                ₹{price.toLocaleString('en-IN')}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                          </Link>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No products found for "{query}"</p>
                      <p className="text-xs text-slate-400 mt-1">Try searching with a different term or keyword</p>
                    </div>
                  )}
                </div>
              ) : (
                /* 2. QUERY EMPTY -> Recent Searches, Popular Tags & Suggested Products */
                <div className="space-y-6">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          Recent Searches
                        </div>
                        <button
                          type="button"
                          onClick={clearAllRecent}
                          className="text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term, index) => (
                          <div
                            key={index}
                            onClick={() => handleExecuteSearch(term)}
                            className="group flex items-center gap-2 px-3 py-1.5 rounded-[10px] border border-slate-200 dark:border-slate-800 bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                          >
                            <span>{term}</span>
                            <button
                              type="button"
                              onClick={(e) => removeRecentSearch(term, e)}
                              className="text-slate-400 hover:text-red-500 transition-colors rounded-[10px] p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Category Suggestions */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase font-medium text-black mb-2.5">
                   
                      Popular Suggestions
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SUGGESTIONS.map((tag, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (tag === 'All Products') {
                              router.push(`/store/${shopSlug}/shop`)
                              onClose()
                            } else {
                              handleExecuteSearch(tag)
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-[10px] border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-slate-900 dark:hover:border-slate-200 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900 transition-all"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Featured / Trending Products Preview */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5 text-xs font-medium font-black uppercase text-black">
              
                        Suggested Products
                      </div>
                      <Link
                        href={`/store/${shopSlug}/shop`}
                        onClick={onClose}
                        className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        View All <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {loading ? (
                      <div className="py-6 text-center text-xs font-semibold text-slate-400">Loading catalog...</div>
                    ) : allProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {allProducts.slice(0, 4).map((product) => {
                          const price = product.selling_price ?? product.price ?? 0
                          const img = product.images?.[0] || product.image_url || '/placeholder.png'
                          return (
                            <Link
                              key={product.id}
                              href={`/store/${shopSlug}/p/${product.id}`}
                              onClick={onClose}
                              className="group flex items-center gap-3 p-2.5 rounded-[10px] border border-slate-200/80 dark:border-slate-800 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all shadow-xs"
                            >
                              <div className="relative w-14 h-14 rounded-[10px] overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/50">
                                <img src={img} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 transition-colors">
                                  {product.name}
                                </h4>
                                {product.category && (
                                  <span className="inline-block text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate mt-0.5">
                                    {product.category}
                                  </span>
                                )}
                                <p className="text-xs font-black text-slate-900 dark:text-slate-200 mt-1">
                                  ₹{price.toLocaleString('en-IN')}
                                </p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                            </Link>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="py-4 text-center text-xs text-slate-400">No products available</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Footer Submit Bar */}
            {query.trim() !== '' && (
              <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-transparent text-center">
                <button
                  type="button"
                  onClick={() => handleExecuteSearch(query)}
                  className="inline-flex items-center gap-2 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <span>View all results for "{query}"</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}
