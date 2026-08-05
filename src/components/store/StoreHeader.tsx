'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingBag, Heart, User, Menu, X, Instagram, Facebook, Twitter, Youtube, Sparkles, MessageCircle } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useWishlistStore } from '@/store/useWishlistStore'
import { CartDrawer } from './CartDrawer'
import { WishlistDrawer } from './WishlistDrawer'
import { AccountModal } from './AccountModal'
import type { ShopTheme } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'

interface StoreHeaderProps {
  shopSlug: string
  shopName: string
  shopDescription?: string | null
  logoUrl?: string | null
  bannerUrl?: string | null
  announcement?: string | null
  theme: ShopTheme | null
  onSearch?: (q: string) => void
  activePage?: 'home' | 'shop' | 'about' | 'contact' | string
}

export function StoreHeader({
  shopSlug,
  shopName,
  logoUrl,
  announcement,
  theme,
  onSearch,
  activePage = 'home',
}: StoreHeaderProps) {
  const router = useRouter()
  const { getItemCount, toggleCart } = useCartStore()
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist)
  const [itemCount, setItemCount] = useState(0)
  const [query, setQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [accountModalOpen, setAccountModalOpen] = useState(false)
  const [wishlistCount, setWishlistCount] = useState(0)

  // Sync cart count on client only (hydration safe)
  useEffect(() => {
    setItemCount(getItemCount())
    const unsub = useCartStore.subscribe((state) => {
      setItemCount(state.getItemCount())
    })
    return unsub
  }, [getItemCount])

  // Sync wishlist count on client only (hydration safe)
  useEffect(() => {
    setWishlistCount(useWishlistStore.getState().items.length)
    const unsub = useWishlistStore.subscribe((state) => {
      setWishlistCount(state.items.length)
    })
    return unsub
  }, [])

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    if (onSearch) {
      onSearch(query)
    } else {
      router.push(`/store/${shopSlug}/shop?search=${encodeURIComponent(query.trim())}`)
    }
  }

  const primaryColor = theme?.primaryColor || '#6366f1'

  // Standardized dedicated page links
  const navItems = [
    { key: 'home', label: 'Home', href: `/store/${shopSlug}` },
    { key: 'shop', label: 'Shop', href: `/store/${shopSlug}/shop` },
    { key: 'about', label: 'About', href: `/store/${shopSlug}/about` },
    { key: 'contact', label: 'Contact', href: `/store/${shopSlug}/contact` },
  ]

  const showAnnouncement = theme?.bannerEnabled !== undefined ? theme.bannerEnabled : (theme?.announcementEnabled !== undefined ? theme.announcementEnabled : true)
  const announcementText = theme?.bannerText || theme?.announcementText || announcement || 'Free Delivery on orders above ₹999 | Cash on Delivery Available'

  return (
    <>
      {/* Announcement Bar */}
      {showAnnouncement && (
        <div className="w-full text-[10px] sm:text-xs font-medium text-slate-200 border-b border-slate-900" style={{ backgroundColor: 'var(--store-neutral-dark)' }}>
          <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="truncate">{announcementText}</span>
            </div>
          <div className="hidden md:flex items-center gap-4 text-slate-300">
            <span>⚡ Express Dispatch</span>
            <span>•</span>
            <span>🛡️ 100% Genuine Guarantee</span>
          </div>
          <div className="flex items-center gap-3">
            {theme?.socialInstagram && (
              <a
                href={`https://instagram.com/${theme.socialInstagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
            )}
            {theme?.socialWhatsApp && (
              <a
                href={`https://wa.me/91${theme.socialWhatsApp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              </a>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Sticky Main Navbar */}
      <header 
        className="sticky top-0 z-40 backdrop-blur-md border-b shadow-sm transition-all duration-300"
        style={{ 
          backgroundColor: 'var(--store-primary-10)',
          borderColor: 'var(--store-primary-20)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo & Name */}
          <Link href={`/store/${shopSlug}`} className="flex items-center gap-3 flex-shrink-0 group">
            {logoUrl ? (
              <div className="relative h-10 w-auto min-w-[40px] max-w-[160px] flex items-center transition-transform duration-300 group-hover:scale-105">
                <img src={logoUrl} alt={shopName} className="object-contain object-left h-full w-auto" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs shadow-sm" style={{ backgroundColor: 'var(--store-neutral-dark)' }}>
                {shopName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-black text-slate-900 text-base tracking-tight uppercase group-hover:text-slate-700 transition-colors">
              {shopName}
            </span>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = activePage === item.key
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`text-xs font-extrabold tracking-wider uppercase transition-colors relative py-1 ${
                    isActive ? 'text-slate-950' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-950 rounded-full"
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right: Search bar & User interaction icons */}
          <div className="flex items-center gap-2.5">
            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-48 lg:w-60">
              <input
                type="text"
                placeholder="Search catalog..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-full bg-slate-100/80 border border-slate-200/60 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-all font-medium"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </form>

            {/* Mobile Search Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-950 md:hidden transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={toggleWishlist}
              className="relative p-2 text-slate-600 hover:text-slate-950 transition-colors rounded-full hover:bg-slate-100"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-slate-950 text-white text-[9px] font-black flex items-center justify-center border border-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Profile / Account Icon */}
            <button
              onClick={() => setAccountModalOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-950 transition-colors rounded-full hover:bg-slate-100"
              aria-label="Account"
              title="Track Order & Account"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Cart Icon */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-slate-600 hover:text-slate-950 transition-colors rounded-full hover:bg-slate-100"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-slate-950 text-white text-[9px] font-black flex items-center justify-center border border-white">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Hamburger Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen((p) => !p)}
              className="p-2 text-slate-600 hover:text-slate-950 lg:hidden transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl p-5 flex flex-col gap-4 lg:hidden"
            >
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium focus:outline-none focus:bg-white"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              </form>

              <div className="flex flex-col gap-1 py-2">
                {navItems.map((item) => {
                  const isActive = activePage === item.key
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-sm font-black uppercase px-3 py-2.5 rounded-xl transition-colors ${
                        isActive ? 'text-white' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                      style={isActive ? { backgroundColor: 'var(--store-neutral-dark)' } : {}}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Wishlist Drawer */}
      <WishlistDrawer />

      {/* Account / Order Lookup Modal */}
      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        shopSlug={shopSlug}
        shopName={shopName}
      />
    </>
  )
}
