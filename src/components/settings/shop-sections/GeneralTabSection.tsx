'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Globe, Info, Image as ImageIcon, ShoppingBag, Clock,
  Truck, Upload, Loader2, Check
} from 'lucide-react'
import { Section } from './ShopSettingsHelpers'

interface GeneralTabSectionProps {
  formData: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleToggle: (name: string, val: boolean) => void
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => Promise<void>
  storeUrlPrefix: string
  uploadingField: string | null
  isPending: boolean
  isEligible: boolean
}

export default function GeneralTabSection({
  formData,
  handleChange,
  handleToggle,
  handleFileUpload,
  storeUrlPrefix,
  uploadingField,
  isPending,
  isEligible,
}: GeneralTabSectionProps) {
  return (
    <div className="space-y-6">
      {/* Store URL */}
      <Section icon={Globe} title="Store URL">
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-r-0 border-slate-200 dark:border-slate-800 rounded-l-lg text-slate-500 dark:text-slate-400 text-sm shrink-0">
              {storeUrlPrefix}
            </div>
            <Input id="shop_slug" name="shop_slug" value={formData.shop_slug} onChange={handleChange} placeholder="your-shop-name" className="rounded-l-none" disabled={isPending} />
          </div>
          <p className="text-xs text-muted-foreground">Lowercase letters, numbers, hyphens only.</p>
        </div>
      </Section>

      {/* Store Description */}
      <Section icon={Info} title="Store Description">
        <Textarea name="shop_description" value={formData.shop_description} onChange={handleChange}
          placeholder="Tell customers about your business..." rows={3} disabled={isPending} />
      </Section>

      {/* Store Logo */}
      <Section icon={ImageIcon} title="Store Logo">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
              {formData.shop_logo_url ? (
                <img src={formData.shop_logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <ShoppingBag className="w-8 h-8 text-slate-300 dark:text-slate-750" />
              )}
              {uploadingField === 'shop_logo_url' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-1.5">
              <label htmlFor="shop_logo_file" className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-250 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                Upload Logo
              </label>
              <input
                id="shop_logo_file"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'shop_logo_url')}
                className="hidden"
                disabled={isPending || uploadingField !== null}
              />
              <p className="text-[11px] text-slate-400">Recommended: Square PNG/JPG, transparent background, under 5MB</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Store Status */}
      <Section icon={Clock} title="Store Status" pro={!isEligible}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="storeStatus" className="text-xs font-bold mb-1.5 block">Store Operating Mode</Label>
            <select
              id="storeStatus"
              name="storeStatus"
              value={formData.storeStatus}
              onChange={handleChange}
              disabled={isPending || !isEligible}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="open">🟢 Open (Store Active &amp; Accepting Orders)</option>
              <option value="vacation">🟡 Vacation Mode (Store Visible, Orders Paused)</option>
              <option value="closed">🔴 Closed (Store Offline)</option>
            </select>
          </div>

          {formData.storeStatus === 'vacation' && (
            <div>
              <Label htmlFor="vacationMessage" className="text-xs font-bold mb-1.5 block">Vacation Notice Message</Label>
              <Input
                id="vacationMessage"
                name="vacationMessage"
                value={formData.vacationMessage}
                onChange={handleChange}
                placeholder="We are currently away on vacation! Orders will resume on..."
                className="text-xs"
                disabled={isPending || !isEligible}
              />
            </div>
          )}
        </div>
      </Section>

      {/* Delivery & Shipping Fee Settings */}
      <Section icon={Truck} title="Delivery &amp; Shipping Fee Settings">
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Set up automatic shipping charges calculated during customer checkout.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: 'free', label: '100% Free Shipping', desc: 'No shipping charges on any order' },
              { value: 'above_amount', label: 'Free Above Order ₹', desc: 'Free delivery above threshold amount' },
              { value: 'flat', label: 'Flat Shipping Fee', desc: 'Fixed shipping fee on all orders' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleChange({ target: { name: 'shippingType', value: opt.value } } as any)}
                disabled={isPending}
                className={`p-3 rounded-xl border text-left transition-all ${
                  formData.shippingType === opt.value
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{opt.label}</span>
                  {formData.shippingType === opt.value && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{opt.desc}</p>
              </button>
            ))}
          </div>

          {formData.shippingType === 'above_amount' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <Label htmlFor="freeShippingThreshold" className="text-xs font-bold mb-1 block">Free Shipping Threshold (₹)</Label>
                <Input
                  id="freeShippingThreshold"
                  name="freeShippingThreshold"
                  type="number"
                  value={formData.freeShippingThreshold ?? 0}
                  onChange={handleChange}
                  placeholder="500"
                  className="text-xs"
                  disabled={isPending}
                />
                <p className="text-[10px] text-slate-400 mt-1">Orders above this amount get FREE shipping</p>
              </div>
              <div>
                <Label htmlFor="flatShippingFee" className="text-xs font-bold mb-1 block">Standard Shipping Charge (₹)</Label>
                <Input
                  id="flatShippingFee"
                  name="flatShippingFee"
                  type="number"
                  value={formData.flatShippingFee ?? 0}
                  onChange={handleChange}
                  placeholder="49"
                  className="text-xs"
                  disabled={isPending}
                />
                <p className="text-[10px] text-slate-400 mt-1">Charged on orders below the threshold</p>
              </div>
            </div>
          )}

          {formData.shippingType === 'flat' && (
            <div className="pt-2 max-w-xs">
              <Label htmlFor="flatShippingFee" className="text-xs font-bold mb-1 block">Flat Shipping Charge (₹)</Label>
              <Input
                id="flatShippingFee"
                name="flatShippingFee"
                type="number"
                value={formData.flatShippingFee ?? 0}
                onChange={handleChange}
                placeholder="49"
                className="text-xs"
                disabled={isPending}
              />
              <p className="text-[10px] text-slate-400 mt-1">Applied to all customer orders</p>
            </div>
          )}

          {formData.shippingType === 'free' && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>All orders on your store will feature 100% FREE Delivery!</span>
            </div>
          )}
        </div>
      </Section>
    </div>
  )
}
