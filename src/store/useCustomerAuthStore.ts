import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CustomerOrder {
  id: string
  date: string
  itemsCount: number
  total: number
  status: 'Confirmed' | 'Processing' | 'In Transit' | 'Delivered'
  itemsSummary: string
  paymentMethod: string
}

export interface CustomerUser {
  id: string
  name: string
  email: string
  phone?: string
  username: string
  createdAt: string
}

interface CustomerAuthStore {
  customer: CustomerUser | null
  orders: CustomerOrder[]
  registeredUsers: CustomerUser[]
  registerCustomer: (name: string, email: string, username: string, phone?: string) => { success: boolean; message: string }
  loginCustomer: (usernameOrEmail: string, password: string) => { success: boolean; message: string }
  logoutCustomer: () => void
  addCustomerOrder: (order: CustomerOrder) => void
  checkEmailExists: (email: string) => boolean
}

const DEFAULT_MOCK_ORDERS: CustomerOrder[] = [
  {
    id: 'ORD-892104',
    date: 'Yesterday, 4:15 PM',
    itemsCount: 2,
    total: 2499,
    status: 'In Transit',
    itemsSummary: 'Kasavu Cotton Shirt (x1), Kasavu Saree (x1)',
    paymentMethod: 'Cash on Delivery'
  },
  {
    id: 'ORD-761920',
    date: '3 days ago',
    itemsCount: 1,
    total: 1799,
    status: 'Delivered',
    itemsSummary: 'Kathakali Printed Shirt (x1)',
    paymentMethod: 'UPI / Online'
  }
]

export const useCustomerAuthStore = create<CustomerAuthStore>()(
  persist(
    (set, get) => ({
      customer: null,
      orders: DEFAULT_MOCK_ORDERS,
      registeredUsers: [],

      registerCustomer: (name, email, username, phone) => {
        const newCustomer: CustomerUser = {
          id: `CUST-${Date.now().toString().slice(-6)}`,
          name: name.trim() || 'Valued Customer',
          email: email.trim(),
          username: username.trim(),
          phone: phone?.trim(),
          createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }
        set((state) => ({
          customer: newCustomer,
          registeredUsers: [...state.registeredUsers, newCustomer],
          orders: state.orders.length > 0 ? state.orders : DEFAULT_MOCK_ORDERS
        }))
        return { success: true, message: 'Account created successfully!' }
      },

      loginCustomer: (usernameOrEmail, password) => {
        const cleanName = usernameOrEmail.split('@')[0]
        const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
        const loggedInCustomer: CustomerUser = {
          id: `CUST-${Date.now().toString().slice(-6)}`,
          name: formattedName || 'Valued Customer',
          email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@gmail.com`,
          username: usernameOrEmail,
          createdAt: 'Active Member'
        }
        set({
          customer: loggedInCustomer,
          orders: get().orders.length > 0 ? get().orders : DEFAULT_MOCK_ORDERS
        })
        return { success: true, message: 'Signed in successfully!' }
      },

      logoutCustomer: () => {
        set({ customer: null })
      },

      addCustomerOrder: (order) => {
        set((state) => ({ orders: [order, ...state.orders] }))
      },

      checkEmailExists: (email) => {
        return get().registeredUsers.some(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase()
        )
      }
    }),
    {
      name: 'rp-customer-auth',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
