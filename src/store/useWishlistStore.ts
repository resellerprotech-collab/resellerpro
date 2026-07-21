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
  isOpen: boolean
  addItem: (item: WishlistItem) => void
  removeItem: (productId: string) => void
  toggleItem: (item: WishlistItem) => void
  hasItem: (productId: string) => boolean
  clearWishlist: () => void
  openWishlist: () => void
  closeWishlist: () => void
  toggleWishlist: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          const exists = state.items.some((item) => item.productId === newItem.productId)
          if (exists) return {}
          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }))
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
        return get().items.some((item) => item.productId === productId)
      },

      clearWishlist: () => set({ items: [] }),

      openWishlist: () => set({ isOpen: true }),
      closeWishlist: () => set({ isOpen: false }),
      toggleWishlist: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'rp-wishlist',
      storage: createJSONStorage(() => localStorage),
      // Only persist items — not UI state
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
)
