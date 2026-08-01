'use client'

import { useState } from 'react'
import { X, Search, Package, CheckCircle2, Clock, Truck, ShieldAlert } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AccountModalProps {
  isOpen: boolean
  onClose: () => void
  shopSlug: string
  shopName: string
}

export function AccountModal({ isOpen, onClose, shopSlug, shopName }: AccountModalProps) {
  const [orderQuery, setOrderQuery] = useState('')
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mockOrder, setMockOrder] = useState<any | null>(null)

  function handleSearchOrder(e: React.FormEvent) {
    e.preventDefault()
    if (!orderQuery.trim()) return

    setLoading(true)
    setTimeout(() => {
      setSearched(true)
      setLoading(false)
      // Provide clean simulated lookup
      if (orderQuery.toLowerCase().includes('123') || orderQuery.length > 3) {
        setMockOrder({
          id: `ORD-${orderQuery.toUpperCase().slice(-6)}`,
          status: 'In Transit',
          date: 'Yesterday, 4:15 PM',
          items: '2 Items',
          total: '₹2,499',
          paymentMethod: 'Cash on Delivery',
          expectedDelivery: 'In 2-3 Business Days',
          trackingNumber: 'TRK-98402194',
        })
      } else {
        setMockOrder(null)
      }
    }, 600)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 overflow-hidden border border-slate-100"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Track Order & Account</h3>
                <p className="text-xs text-slate-500">{shopName} Customer Portal</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Order ID or Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. ORD-8921 or 9876543210"
                    value={orderQuery}
                    onChange={(e) => setOrderQuery(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all"
                  />
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !orderQuery.trim()}
                className="w-full h-11 bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Package className="w-4 h-4" />
                    Lookup Order Status
                  </>
                )}
              </button>
            </form>

            {searched && (
              <div className="mt-6 pt-5 border-t border-slate-100">
                {mockOrder ? (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900">{mockOrder.id}</span>
                      <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Truck className="w-3 h-3" /> {mockOrder.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <p><span className="font-semibold text-slate-800">Order Date:</span> {mockOrder.date}</p>
                      <p><span className="font-semibold text-slate-800">Details:</span> {mockOrder.items} ({mockOrder.total})</p>
                      <p><span className="font-semibold text-slate-800">Payment:</span> {mockOrder.paymentMethod}</p>
                      <p><span className="font-semibold text-slate-800">Est. Delivery:</span> {mockOrder.expectedDelivery}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-900">
                    <ShieldAlert className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                    <p className="text-xs font-bold">No recent order found</p>
                    <p className="text-[11px] text-amber-700 mt-0.5">Please verify your order number or phone number.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
