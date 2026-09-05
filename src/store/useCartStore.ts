import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  carts: Record<string, CartItem[]>
  shopSlug: string | null
  isOpen: boolean
  addItem: (item: CartItem, options?: { openDrawer?: boolean }) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void
  clearCart: (targetSlug?: string) => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
  setShopSlug: (slug: string) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      carts: {},
      shopSlug: null,
      isOpen: false,

      addItem: (newItem, options = { openDrawer: true }) => {
        const shouldOpen = options?.openDrawer ?? true
        set((state) => {
          const currentSlug = state.shopSlug
          const activeItems = state.items || []
          const existingIndex = activeItems.findIndex(
            (item) =>
              item.productId === newItem.productId &&
              (newItem.variantId ? item.variantId === newItem.variantId : !item.variantId)
          )
          let updatedItems: CartItem[]
          if (existingIndex >= 0) {
            updatedItems = [...activeItems]
            const existing = updatedItems[existingIndex]
            const newQty = existing.quantity + newItem.quantity
            // Respect stock limit if provided
            const maxQty = newItem.stockQuantity ?? Infinity
            updatedItems[existingIndex] = {
              ...existing,
              quantity: Math.min(newQty, maxQty),
            }
          } else {
            updatedItems = [...activeItems, newItem]
          }

          const updatedCarts = currentSlug
            ? { ...(state.carts || {}), [currentSlug]: updatedItems }
            : state.carts || {}

          return {
            items: updatedItems,
            carts: updatedCarts,
            ...(shouldOpen ? { isOpen: true } : {}),
          }
        })
      },

      removeItem: (productId, variantId) => {
        set((state) => {
          const updatedItems = (state.items || []).filter(
            (item) =>
              !(
                item.productId === productId &&
                (variantId ? item.variantId === variantId : !item.variantId)
              )
          )
          const updatedCarts = state.shopSlug
            ? { ...(state.carts || {}), [state.shopSlug]: updatedItems }
            : state.carts || {}
          return {
            items: updatedItems,
            carts: updatedCarts,
          }
        })
      },

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId)
          return
        }
        set((state) => {
          const updatedItems = (state.items || []).map((item) =>
            item.productId === productId && (variantId ? item.variantId === variantId : !item.variantId)
              ? { ...item, quantity }
              : item
          )
          const updatedCarts = state.shopSlug
            ? { ...(state.carts || {}), [state.shopSlug]: updatedItems }
            : state.carts || {}
          return {
            items: updatedItems,
            carts: updatedCarts,
          }
        })
      },

      clearCart: (targetSlug?: string) => {
        set((state) => {
          const slugToClear = targetSlug || state.shopSlug
          const updatedCarts = { ...(state.carts || {}) }
          if (slugToClear) {
            delete updatedCarts[slugToClear]
          }
          return {
            items: (!slugToClear || slugToClear === state.shopSlug) ? [] : state.items,
            carts: updatedCarts,
            isOpen: false,
          }
        })
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getItemCount: () =>
        (get().items || []).reduce((total, item) => total + item.quantity, 0),

      getSubtotal: () =>
        (get().items || []).reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),

      setShopSlug: (slug: string) => {
        if (!slug) return
        set((state) => {
          if (state.shopSlug === slug) {
            // Already on this store, ensure items match carts[slug] if items empty
            const currentItems = (state.items && state.items.length > 0)
              ? state.items
              : (state.carts?.[slug] || [])
            return {
              shopSlug: slug,
              items: currentItems,
              carts: {
                ...(state.carts || {}),
                [slug]: currentItems,
              },
            }
          }

          // Switching store: save current items under old slug (if any)
          const updatedCarts = { ...(state.carts || {}) }
          if (state.shopSlug) {
            updatedCarts[state.shopSlug] = state.items || []
          }

          // Load target store's items
          const targetItems = updatedCarts[slug] || []

          return {
            shopSlug: slug,
            items: targetItems,
            carts: updatedCarts,
            isOpen: false, // Close drawer on store switch
          }
        })
      },
    }),
    {
      name: 'rp-cart',
      storage: createJSONStorage(() => localStorage),
      // Persist carts map and shopSlug
      partialize: (state) => ({
        carts: state.carts || {},
        shopSlug: state.shopSlug,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.shopSlug) {
          const rehydratedCarts = state.carts || {}
          state.items = rehydratedCarts[state.shopSlug] || []
        }
      },
    }
  )
)
