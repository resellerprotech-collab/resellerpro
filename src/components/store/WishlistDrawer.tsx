'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { useWishlistStore } from '@/store/useWishlistStore'
import { useCartStore } from '@/store/useCartStore'
import Image from 'next/image'

export function WishlistDrawer() {
  const { items, isOpen, closeWishlist, removeItem } = useWishlistStore()
  const { addItem } = useCartStore()
  const overlayRef = useRef<HTMLDivElement>(null)

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  function handleAddToCart(item: any) {
    addItem({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={closeWishlist}
          />

          {/* Drawer — bottom sheet on mobile, side panel on desktop */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col lg:left-auto lg:top-0 lg:right-0 lg:bottom-0 lg:w-[420px] lg:rounded-none lg:rounded-l-3xl lg:max-h-full border-l border-slate-200 dark:border-slate-800"
          >
            {/* Handle bar (mobile) */}
            <div className="lg:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">Your Wishlist</h2>
                {items.length > 0 && (
                  <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full bg-slate-900 dark:bg-slate-700">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={closeWishlist}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                aria-label="Close wishlist"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Heart className="w-12 h-12 text-slate-200 dark:text-slate-700 mb-3" />
                  <p className="font-semibold text-slate-600 dark:text-slate-300">Your wishlist is empty</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Save items to buy them later</p>
                  <button
                    onClick={closeWishlist}
                    className="mt-4 text-sm font-bold underline text-slate-900 dark:text-slate-100"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.productId} className="flex gap-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 border border-slate-100 dark:border-slate-800 items-center">
                    {/* Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0 relative border border-slate-200/60 dark:border-slate-700/60">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{item.name}</p>
                      <p className="font-bold text-sm mt-1 text-slate-900 dark:text-slate-100">
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        {/* Add to Cart button */}
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-lg transition-all active:scale-95"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Add to Cart
                        </button>

                        {/* Remove button */}
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4 bg-white dark:bg-slate-900">
                <button
                  onClick={closeWishlist}
                  className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 text-slate-700 dark:text-slate-300 text-sm"
                >
                  Close Wishlist
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
