'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, CreditCard, FileText, ArrowRight, CheckCircle2, Download, Eye } from 'lucide-react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type BillingDetailsSectionProps = {
  subscription: any
  invoices?: any[]
  onAddPaymentMethod?: () => void
}

export function BillingDetailsSection({
  subscription,
  invoices = [],
  onAddPaymentMethod,
}: BillingDetailsSectionProps) {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const isFree = subscription?.plan?.name === 'free' || !subscription?.plan?.name

  const nextPaymentDate = subscription?.current_period_end
    ? format(new Date(subscription.current_period_end), 'dd MMM yyyy')
    : null

  return (
    <>
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Billing</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1: Next Payment */}
            <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between space-y-4">
              <div>
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
                  <Calendar className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Next payment</h3>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {isFree ? '—' : (nextPaymentDate || '—')}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {isFree ? "You're on the Free plan" : 'Renews automatically on your cycle'}
                </p>
              </div>
            </div>

            {/* Box 2: Payment Method */}
            <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between space-y-4">
              <div>
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Payment method</h3>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {isFree ? 'No active method' : 'Razorpay / Wallet'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {isFree ? 'Add a payment method' : 'Managed via secure Razorpay checkout'}
                </p>
              </div>
              {isFree && onAddPaymentMethod && (
                <div>
                  <button
                    onClick={onAddPaymentMethod}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                  >
                    Add now
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Box 3: Billing History */}
            <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between space-y-4">
              <div>
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Billing history</h3>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {invoices.length > 0
                    ? `${invoices.length} ${invoices.length === 1 ? 'Invoice' : 'Invoices'}`
                    : 'No invoices yet'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {invoices.length > 0
                    ? 'View past payment invoices and receipts'
                    : 'Invoices will appear here when you upgrade.'}
                </p>
              </div>

              {invoices.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                  >
                    View invoices
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Dialog */}
      <Dialog open={showInvoiceModal} onOpenChange={setShowInvoiceModal}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Billing History & Invoices</DialogTitle>
            <DialogDescription>
              View and download receipts for your past subscription payments.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3 max-h-[60vh] overflow-y-auto">
            {invoices.map((inv, idx) => (
              <div
                key={inv.id || idx}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {inv.metadata?.plan_name ? `${inv.metadata.plan_name} Plan` : 'Subscription Payment'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {inv.created_at ? format(new Date(inv.created_at), 'dd MMM yyyy, hh:mm a') : 'N/A'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 text-sm">
                    ₹{inv.amount}
                  </span>
                  <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-600 bg-emerald-50">
                    Paid
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
