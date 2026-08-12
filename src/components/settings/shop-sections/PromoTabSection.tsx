'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Megaphone, Check, Upload, Loader2, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PromoItem } from '@/types'
import { Section, ToggleRow } from './ShopSettingsHelpers'

interface PromoTabSectionProps {
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
  handleToggle: (name: string, val: boolean) => void
  handlePromoFileUpload: (e: React.ChangeEvent<HTMLInputElement>, targetField: 'promoFullBanner' | 'promoCard1' | 'promoCard2') => Promise<void>
  updatePromoItem: (targetField: 'promoFullBanner' | 'promoCard1' | 'promoCard2', updates: Partial<PromoItem>) => void
  categoryList: string[]
  productList: { id: string; name: string }[]
  uploadingField: string | null
  isEligible: boolean
}

export default function PromoTabSection({
  formData,
  setFormData,
  handleToggle,
  handlePromoFileUpload,
  updatePromoItem,
  categoryList,
  productList,
  uploadingField,
  isEligible,
}: PromoTabSectionProps) {

  const renderClickActionFields = (
    label: string,
    targetField: 'promoFullBanner' | 'promoCard1' | 'promoCard2',
    item: PromoItem
  ) => {
    return (
      <div className="space-y-3">
        <div>
          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Click Action ({label})</Label>
          <select
            value={item?.clickAction || 'shop'}
            onChange={(e) => updatePromoItem(targetField, { clickAction: e.target.value as any, clickTarget: '' })}
            className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="shop">Shop Page (All Products)</option>
            <option value="category">Category</option>
            <option value="product">Product</option>
            <option value="collection">Collection (Future)</option>
            <option value="custom_url">Custom URL</option>
          </select>
        </div>

        {item?.clickAction === 'category' && (
          <div>
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Destination Category</Label>
            {categoryList.length > 0 ? (
              <select
                value={item?.clickTarget || ''}
                onChange={(e) => updatePromoItem(targetField, { clickTarget: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Choose Category --</option>
                {categoryList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 mt-1">No store categories found. Add products with categories first.</p>
            )}
          </div>
        )}

        {item?.clickAction === 'product' && (
          <div>
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Destination Product</Label>
            {productList.length > 0 ? (
              <select
                value={item?.clickTarget || ''}
                onChange={(e) => updatePromoItem(targetField, { clickTarget: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Choose Product --</option>
                {productList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 mt-1">No products found in store. Add products to catalog first.</p>
            )}
          </div>
        )}

        {item?.clickAction === 'custom_url' && (
          <div>
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Destination URL</Label>
            <Input
              placeholder="https://example.com/promo or /store/my-shop/shop"
              value={item?.clickTarget || ''}
              onChange={(e) => updatePromoItem(targetField, { clickTarget: e.target.value })}
              className="mt-1 text-xs"
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Section icon={Megaphone} title="Homepage Promotional Section" pro={!isEligible}>
        <ToggleRow
          label="Enable Promotional Section"
          description="Show a high-impact promotional section on your storefront homepage between Featured Products and Best Sellers."
          checked={formData.promoSectionEnabled}
          onChange={v => handleToggle('promoSectionEnabled', v)}
          disabled={!isEligible}
        />

        {formData.promoSectionEnabled && (
          <div className="space-y-6 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Choose Layout */}
            <div>
              <Label className="text-sm font-bold text-slate-900 dark:text-slate-100 block mb-2">
                Choose Layout
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option 1: Full Width Banner */}
                <button
                  type="button"
                  onClick={() => setFormData((p: any) => ({ ...p, promoLayout: 'full_width' }))}
                  className={cn(
                    "p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between gap-3",
                    formData.promoLayout === 'full_width'
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-md"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      ○ Full Width Banner
                    </span>
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      formData.promoLayout === 'full_width'
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-300 dark:border-slate-700"
                    )}>
                      {formData.promoLayout === 'full_width' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <div className="w-full h-12 rounded-xl bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">100% Full Width Banner</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Single high-impact banner image spanning the container width. Complete banner is clickable.
                  </p>
                </button>

                {/* Option 2: Two Promotional Cards */}
                <button
                  type="button"
                  onClick={() => setFormData((p: any) => ({ ...p, promoLayout: 'two_cards' }))}
                  className={cn(
                    "p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between gap-3",
                    formData.promoLayout === 'two_cards'
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-md"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      ○ Two Promotional Cards
                    </span>
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      formData.promoLayout === 'two_cards'
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-300 dark:border-slate-700"
                    )}>
                      {formData.promoLayout === 'two_cards' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 w-full h-12">
                    <div className="h-full rounded-lg bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-slate-500 uppercase">Card 1</span>
                    </div>
                    <div className="h-full rounded-lg bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-slate-500 uppercase">Card 2</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Two side-by-side promotional cards. Each card has its own image &amp; destination link.
                  </p>
                </button>
              </div>
            </div>

            {/* Layout 1: Full Width Banner Controls */}
            {formData.promoLayout === 'full_width' && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Full Width Banner Image &amp; Click Action
                </h4>

                <div>
                  <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 block">Banner Image</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-44 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {formData.promoFullBanner?.imageUrl ? (
                        <img src={formData.promoFullBanner.imageUrl} alt="Full Banner" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                      )}
                      {uploadingField === 'promoFullBanner' && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="promo_full_file" className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        Upload Banner Image
                      </label>
                      <input
                        id="promo_full_file"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePromoFileUpload(e, 'promoFullBanner')}
                        className="hidden"
                        disabled={!isEligible || uploadingField !== null}
                      />
                      {formData.promoFullBanner?.imageUrl && (
                        <button
                          type="button"
                          onClick={() => updatePromoItem('promoFullBanner', { imageUrl: '' })}
                          className="text-xs text-red-500 font-bold block hover:underline"
                        >
                          Remove Image
                        </button>
                      )}
                      <p className="text-[10px] text-slate-400">Upload banner image created in Canva/Photoshop/AI. Max 5MB.</p>
                    </div>
                  </div>
                </div>

                {renderClickActionFields('Full Banner', 'promoFullBanner', formData.promoFullBanner)}
              </div>
            )}

            {/* Layout 2: Two Promotional Cards Controls */}
            {formData.promoLayout === 'two_cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1 */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Card 1 (Left Card)
                  </h4>

                  <div>
                    <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 block">Card 1 Image</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        {formData.promoCard1?.imageUrl ? (
                          <img src={formData.promoCard1.imageUrl} alt="Card 1" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                        )}
                        {uploadingField === 'promoCard1' && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="promo_card1_file" className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          Upload Image
                        </label>
                        <input
                          id="promo_card1_file"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePromoFileUpload(e, 'promoCard1')}
                          className="hidden"
                          disabled={!isEligible || uploadingField !== null}
                        />
                        {formData.promoCard1?.imageUrl && (
                          <button
                            type="button"
                            onClick={() => updatePromoItem('promoCard1', { imageUrl: '' })}
                            className="text-xs text-red-500 font-bold block hover:underline"
                          >
                            Remove Image
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {renderClickActionFields('Card 1', 'promoCard1', formData.promoCard1)}
                </div>

                {/* Card 2 */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Card 2 (Right Card)
                  </h4>

                  <div>
                    <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 block">Card 2 Image</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        {formData.promoCard2?.imageUrl ? (
                          <img src={formData.promoCard2.imageUrl} alt="Card 2" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                        )}
                        {uploadingField === 'promoCard2' && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="promo_card2_file" className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          Upload Image
                        </label>
                        <input
                          id="promo_card2_file"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePromoFileUpload(e, 'promoCard2')}
                          className="hidden"
                          disabled={!isEligible || uploadingField !== null}
                        />
                        {formData.promoCard2?.imageUrl && (
                          <button
                            type="button"
                            onClick={() => updatePromoItem('promoCard2', { imageUrl: '' })}
                            className="text-xs text-red-500 font-bold block hover:underline"
                          >
                            Remove Image
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {renderClickActionFields('Card 2', 'promoCard2', formData.promoCard2)}
                </div>
              </div>
            )}

            {/* Section Preview */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Section Live Preview</p>
              {formData.promoLayout === 'two_cards' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-28 rounded-xl overflow-hidden relative bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <img
                      src={formData.promoCard1?.imageUrl || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80'}
                      alt="Preview Card 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="h-28 rounded-xl overflow-hidden relative bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <img
                      src={formData.promoCard2?.imageUrl || 'https://images.unsplash.com/photo-1490578474895-699bc4e2cf59?w=800&auto=format&fit=crop&q=80'}
                      alt="Preview Card 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="h-32 rounded-xl overflow-hidden relative bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <img
                    src={formData.promoFullBanner?.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&auto=format&fit=crop&q=80'}
                    alt="Preview Full Banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Section>
    </div>
  )
}
