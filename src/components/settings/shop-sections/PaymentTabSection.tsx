'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { CreditCard, Sparkles, Truck, MessageCircle } from 'lucide-react'
import { Section } from './ShopSettingsHelpers'

interface PaymentTabSectionProps {
  formData: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleToggle: (name: string, val: boolean) => void
  planName: string
  isPending: boolean
}

export default function PaymentTabSection({
  formData,
  handleChange,
  handleToggle,
  planName,
  isPending,
}: PaymentTabSectionProps) {
  return (
    <div className="space-y-6">
      <Section icon={CreditCard} title="Payment Option Management">
        <div className="space-y-5">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Control which payment options are available on your customer checkout page.
          </p>

          {/* Live Status Matrix Summary Card */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-indigo-100 dark:border-indigo-950/50 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2">
            <div className="flex items-center gap-2">
              <h5 className="text-xs font-bold text-indigo-950 dark:text-indigo-200">Active Checkout Configuration</h5>
            </div>
            <div className="text-[11px] font-medium">
              {planName?.toLowerCase() === 'free' ? (
                <p className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  Free Plan ➔ Store Checkout locked to <u>WhatsApp Order Only</u>. Upgrade subscription to enable Online Payment &amp; COD.
                </p>
              ) : !formData.enableOnlinePayment ? (
                <p className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  Online Payment OFF ➔ Checkout shows <u>WhatsApp Order Only</u> (Online Payment &amp; COD hidden).
                </p>
              ) : !formData.enableCod ? (
                <p className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                  Online Payment ON + COD OFF ➔ Checkout shows <u>Online Payment</u> &amp; <u>WhatsApp Order</u>.
                </p>
              ) : (
                <p className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Online Payment ON + COD ON ➔ Checkout shows <u>Online Payment</u>, <u>COD</u> &amp; <u>WhatsApp Order</u>.
                </p>
              )}
            </div>
          </div>

          {/* 1. Online Payment Switch */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">Online Payment</h4>
                    {planName?.toLowerCase() === 'free' && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">
                        🔒 Paid Plan Feature
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Enable or disable online card / netbanking / UPI payments</p>
                </div>
              </div>
              <Switch
                checked={planName?.toLowerCase() === 'free' ? false : formData.enableOnlinePayment}
                onCheckedChange={(val) => handleToggle('enableOnlinePayment', val)}
                disabled={planName?.toLowerCase() === 'free'}
              />
            </div>

            {formData.enableOnlinePayment && (
              <div className="space-y-4 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/50 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <Label className="text-xs font-bold text-blue-950 dark:text-blue-200">
                      Razorpay API Integration Settings
                    </Label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        Razorpay Key ID
                      </Label>
                      <Input
                        name="razorpayKeyId"
                        value={formData.razorpayKeyId || ''}
                        onChange={handleChange}
                        placeholder="e.g. rzp_live_xxxxxxxxxxxxxx or rzp_test_xxxxxxx"
                        className="mt-1 text-xs font-mono"
                        disabled={isPending}
                      />
                      <p className="text-[10px] text-slate-400 mt-0.5">Found in your Razorpay Dashboard ➔ API Keys</p>
                    </div>
                    <div>
                      <Label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        Razorpay Key Secret (Optional)
                      </Label>
                      <Input
                        name="razorpayKeySecret"
                        type="password"
                        value={formData.razorpayKeySecret || ''}
                        onChange={handleChange}
                        placeholder="••••••••••••••••"
                        className="mt-1 text-xs font-mono"
                        disabled={isPending}
                      />
                      <p className="text-[10px] text-slate-400 mt-0.5">Used for webhook &amp; signature verification</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Display Title</Label>
                    <Input
                      name="onlinePaymentTitle"
                      value={formData.onlinePaymentTitle}
                      onChange={handleChange}
                      placeholder="Online Payment"
                      className="mt-1 text-xs"
                      disabled={isPending}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Subtitle / Description</Label>
                    <Input
                      name="onlinePaymentDescription"
                      value={formData.onlinePaymentDescription}
                      onChange={handleChange}
                      placeholder="Credit/Debit Card, NetBanking &amp; UPI"
                      className="mt-1 text-xs"
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      UPI ID / GPay Mobile Number (Optional)
                    </Label>
                    <Input
                      name="upi_id"
                      value={formData.upi_id || ''}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210@okbizaxis or 9876543210"
                      className="mt-1 text-xs sm:text-sm font-mono"
                      disabled={isPending}
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Account Holder / GPay Name
                    </Label>
                    <Input
                      name="upi_name"
                      value={formData.upi_name || ''}
                      onChange={handleChange}
                      placeholder="e.g. Royal Fashion Store"
                      className="mt-1 text-xs sm:text-sm"
                      disabled={isPending}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Cash on Delivery (COD) Switch */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">Cash on Delivery (COD)</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Enable or disable COD option at checkout</p>
                </div>
              </div>
              <Switch
                checked={formData.enableCod}
                onCheckedChange={(val) => handleToggle('enableCod', val)}
                disabled={!formData.enableOnlinePayment}
              />
            </div>

            {!formData.enableOnlinePayment && (
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                ⚠️ When Online Payment is OFF, Cash on Delivery is automatically hidden at checkout (WhatsApp Order Only).
              </p>
            )}

            {formData.enableCod && formData.enableOnlinePayment && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                <div>
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Display Title</Label>
                  <Input
                    name="codTitle"
                    value={formData.codTitle}
                    onChange={handleChange}
                    placeholder="Cash on Delivery (COD)"
                    className="mt-1 text-xs"
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Subtitle / Description</Label>
                  <Input
                    name="codDescription"
                    value={formData.codDescription}
                    onChange={handleChange}
                    placeholder="Pay cash on delivery"
                    className="mt-1 text-xs"
                    disabled={isPending}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. Place Order via WhatsApp Settings */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">Place Order via WhatsApp</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Default fallback and WhatsApp direct order option</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
              <div>
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Display Title</Label>
                <Input
                  name="whatsappOrderTitle"
                  value={formData.whatsappOrderTitle}
                  onChange={handleChange}
                  placeholder="Place Order via WhatsApp"
                  className="mt-1 text-xs"
                  disabled={isPending}
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Subtitle / Description</Label>
                <Input
                  name="whatsappOrderDescription"
                  value={formData.whatsappOrderDescription}
                  onChange={handleChange}
                  placeholder="Direct order &amp; support on WhatsApp"
                  className="mt-1 text-xs"
                  disabled={isPending}
                />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
