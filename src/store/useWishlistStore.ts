import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface WishlistItem {
  productId: string
  name: string
  image: string | null
  price: number
}

interface WishlistStore {
  items: WishlistItem[]
  wishlists: Record<string, WishlistItem[]>
  shopSlug: string | null
  isOpen: boolean
  addItem: (item: WishlistItem) => void
  removeItem: (productId: string) => void
  toggleItem: (item: WishlistItem) => void
  hasItem: (productId: string) => boolean
  clearWishlist: (targetSlug?: string) => void
  openWishlist: () => void
  closeWishlist: () => void
  toggleWishlist: () => void
  setShopSlug: (slug: string) => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      wishlists: {},
      shopSlug: null,
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          const activeItems = state.items || []
          const exists = activeItems.some((item) => item.productId === newItem.productId)
          if (exists) return {}
          const updatedItems = [...activeItems, newItem]
          const updatedWishlists = state.shopSlug
            ? { ...(state.wishlists || {}), [state.shopSlug]: updatedItems }
            : state.wishlists || {}
          return {
            items: updatedItems,
            wishlists: updatedWishlists,
          }
        })
      },

      removeItem: (productId) => {
        set((state) => {
          const updatedItems = (state.items || []).filter((item) => item.productId !== productId)
          const updatedWishlists = state.shopSlug
            ? { ...(state.wishlists || {}), [state.shopSlug]: updatedItems }
            : state.wishlists || {}
          return {
            items: updatedItems,
            wishlists: updatedWishlists,
          }
        })
      },

      toggleItem: (item) => {
        const exists = get().hasItem(item.productId)
        if (exists) {
          get().removeItem(item.productId)
        } else {
          get().addItem(item)
        }
      },

      hasItem: (productId) => {
        return (get().items || []).some((item) => item.productId === productId)
      },

      clearWishlist: (targetSlug?: string) => {
        set((state) => {
          const slugToClear = targetSlug || state.shopSlug
          const updatedWishlists = { ...(state.wishlists || {}) }
          if (slugToClear) {
            delete updatedWishlists[slugToClear]
          }
          return {
            items: (!slugToClear || slugToClear === state.shopSlug) ? [] : state.items,
            wishlists: updatedWishlists,
          }
        })
      },

      openWishlist: () => set({ isOpen: true }),
      closeWishlist: () => set({ isOpen: false }),
      toggleWishlist: () => set((state) => ({ isOpen: !state.isOpen })),

      setShopSlug: (slug: string) => {
        if (!slug) return
        set((state) => {
          if (state.shopSlug === slug) {
            const currentItems = (state.items && state.items.length > 0)
              ? state.items
              : (state.wishlists?.[slug] || [])
            return {
              shopSlug: slug,
              items: currentItems,
              wishlists: {
                ...(state.wishlists || {}),
                [slug]: currentItems,
              },
            }
          }

          // Switching store: save current items under old slug (if any)
          const updatedWishlists = { ...(state.wishlists || {}) }
          if (state.shopSlug) {
            updatedWishlists[state.shopSlug] = state.items || []
          }

          // Load target store's items
          const targetItems = updatedWishlists[slug] || []

          return {
            shopSlug: slug,
            items: targetItems,
            wishlists: updatedWishlists,
            isOpen: false,
          }
        })
      },
    }),
    {
      name: 'rp-wishlist',
      storage: createJSONStorage(() => localStorage),
      // Persist wishlists map and shopSlug
      partialize: (state) => ({
        wishlists: state.wishlists || {},
        shopSlug: state.shopSlug,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.shopSlug) {
          const rehydratedWishlists = state.wishlists || {}
          state.items = rehydratedWishlists[state.shopSlug] || []
        }
      },
    }
  )
)
