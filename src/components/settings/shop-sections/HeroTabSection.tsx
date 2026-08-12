'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  PanelTop, Bell, Check, Loader2, Upload, Image as ImageIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { HeroBannerItem } from '@/types'
import { Section, ToggleRow, ColorPicker } from './ShopSettingsHelpers'

interface HeroTabSectionProps {
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleToggle: (name: string, val: boolean) => void
  handleMultipleBannersUpload: (e: React.ChangeEvent<HTMLInputElement>, replaceIndex?: number) => Promise<void>
  updateBannerItem: (index: number, updates: Partial<HeroBannerItem>) => void
  removeBannerItem: (index: number) => void
  handleMultipleMobileImagesUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  updateMobileBannerItem: (index: number, updates: Partial<HeroBannerItem>) => void
  removeMobileHeroImage: (index: number) => void
  handleMultipleImagesUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  updateShowcaseBannerItem: (index: number, updates: Partial<HeroBannerItem>) => void
  removeHeroImage: (index: number) => void
  categoryList: string[]
  productList: { id: string; name: string }[]
  categories: string[]
  products: { id: string; name: string }[]
  uploadingField: string | null
  isPending: boolean
  isEligible: boolean
}

export default function HeroTabSection({
  formData,
  setFormData,
  handleChange,
  handleToggle,
  handleMultipleBannersUpload,
  updateBannerItem,
  removeBannerItem,
  handleMultipleMobileImagesUpload,
  updateMobileBannerItem,
  removeMobileHeroImage,
  handleMultipleImagesUpload,
  updateShowcaseBannerItem,
  removeHeroImage,
  categoryList,
  productList,
  categories,
  products,
  uploadingField,
  isPending,
  isEligible,
}: HeroTabSectionProps) {
  return (
    <div className="space-y-6">
      <Section icon={PanelTop} title="Hero Banner Customization" pro={!isEligible}>
        <ToggleRow label="Enable Hero Banner" description="Show custom hero layout on your storefront" checked={formData.heroEnabled} onChange={v => handleToggle('heroEnabled', v)} disabled={!isEligible} />
        {formData.heroEnabled && (
          <div className="space-y-6 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">

            {/* ── Visual Layout Selector ───────────────────────── */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Choose Your Hero Layout</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Card 1: Product Showcase Hero */}
                <button
                  type="button"
                  onClick={() => !isEligible ? undefined : setFormData((prev: any) => ({ ...prev, heroTemplate: 'split' }))}
                  disabled={!isEligible}
                  className={cn(
                    "group relative rounded-2xl overflow-hidden text-left transition-all duration-300 border-2 focus:outline-none",
                    formData.heroTemplate === 'split'
                      ? "border-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.15)] dark:shadow-[0_0_0_4px_rgba(99,102,241,0.25)]"
                      : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg",
                    !isEligible && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {/* Mini Preview Mockup */}
                  <div className="relative bg-slate-950 px-4 pt-4 pb-2 flex gap-3 overflow-hidden min-h-[110px]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(99,102,241,0.18),transparent_60%)]" />
                    <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)] [background-size:14px_14px]" />
                    <div className="relative z-10 flex flex-col gap-1.5 flex-1 justify-center">
                      <div className="w-14 h-1.5 bg-white/25 rounded-full" />
                      <div className="w-24 h-2.5 bg-white/80 rounded-full" />
                      <div className="w-20 h-2 bg-white/40 rounded-full" />
                      <div className="flex gap-1.5 mt-1">
                        <div className="h-5 w-12 rounded-md bg-white" />
                        <div className="h-5 w-12 rounded-md border border-white/30" />
                      </div>
                      <div className="flex gap-2 mt-0.5">
                        <div className="w-8 h-1 bg-white/20 rounded-full" />
                        <div className="w-8 h-1 bg-white/20 rounded-full" />
                        <div className="w-8 h-1 bg-white/20 rounded-full" />
                      </div>
                    </div>
                    <div className="relative z-10 w-16 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shadow-xl">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/30 to-white/10" />
                      </div>
                    </div>
                  </div>
                  {/* Card Footer */}
                  <div className="px-4 py-3 bg-white dark:bg-slate-900 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-black text-sm text-slate-900 dark:text-white">Product Showcase Hero</span>
                        {formData.heroTemplate === 'split' && (
                          <span className="shrink-0 flex items-center gap-1 text-[9px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                            <Check className="w-2.5 h-2.5" /> Selected
                          </span>
                        )}
                      </div>
                      <span className="inline-block text-[9px] font-black uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 px-2 py-0.5 rounded-full mb-1.5">✦ Best for Products</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Interactive product showcase with CTA and sliding product images.</p>
                    </div>
                  </div>
                </button>

                {/* Card 2: Promotion Banner */}
                <button
                  type="button"
                  onClick={() => !isEligible ? undefined : setFormData((prev: any) => ({ ...prev, heroTemplate: 'banner' }))}
                  disabled={!isEligible}
                  className={cn(
                    "group relative rounded-2xl overflow-hidden text-left transition-all duration-300 border-2 focus:outline-none",
                    formData.heroTemplate === 'banner'
                      ? "border-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.15)] dark:shadow-[0_0_0_4px_rgba(99,102,241,0.25)]"
                      : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg",
                    !isEligible && "opacity-60 cursor-not-allowed"
                  )}
                >
                  <div className="relative min-h-[110px] overflow-hidden bg-gradient-to-br from-rose-500 via-orange-500 to-yellow-400 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/10" />
                    {formData.heroImageUrl && formData.heroTemplate === 'banner' ? (
                      <img src={formData.heroImageUrl} alt="Banner preview" className="w-full h-full object-cover absolute inset-0" />
                    ) : (
                      <div className="relative z-10 flex flex-col items-center gap-2 px-6">
                        <div className="w-32 h-2 bg-white/80 rounded-full" />
                        <div className="w-20 h-1.5 bg-white/50 rounded-full" />
                        <div className="mt-1 w-16 h-4 rounded-lg bg-white/30 border border-white/50" />
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-3 bg-white dark:bg-slate-900 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-black text-sm text-slate-900 dark:text-white">Promotion Banner</span>
                        {formData.heroTemplate === 'banner' && (
                          <span className="shrink-0 flex items-center gap-1 text-[9px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                            <Check className="w-2.5 h-2.5" /> Selected
                          </span>
                        )}
                      </div>
                      <span className="inline-block text-[9px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 px-2 py-0.5 rounded-full mb-1.5">✦ Best for Offers</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Upload your Canva/promo design. Click anywhere on banner goes to your chosen destination.</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* ── Mobile Banner Settings ──────────── */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <Label className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    <span className="text-sm font-black">Mobile Banner</span>
                  </Label>
                  <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                    Upload up to 4 dedicated mobile banner images optimized specifically for mobile screens (&lt; 1024px). Displays regardless of chosen hero layout.
                  </p>
                </div>
                {(formData.heroMobileImages || (formData.heroMobileImageUrl ? [formData.heroMobileImageUrl] : [])).length < 4 && (
                  <label
                    htmlFor="hero_mobile_images_file"
                    className={cn(
                      "cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shrink-0 shadow-sm",
                      (!isEligible || uploadingField !== null) && "opacity-50 pointer-events-none"
                    )}
                  >
                    {uploadingField === 'heroMobileImages' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    Add Mobile Banner
                  </label>
                )}
                <input
                  id="hero_mobile_images_file"
                  type="file"
                  accept="image/*"
                  onChange={handleMultipleMobileImagesUpload}
                  className="hidden"
                  disabled={!isEligible || uploadingField !== null}
                />
              </div>

              {(formData.heroMobileBanners || []).length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center bg-white/50 dark:bg-slate-950/50">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">No mobile banners uploaded yet</p>
                  <p className="text-[10px] text-slate-400">Upload up to 4 mobile banner images — configure distinct destination links for each.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(formData.heroMobileBanners || []).map((banner: HeroBannerItem, idx: number) => {
                    const actionType = banner.clickAction || 'shop'
                    return (
                      <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-3 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center text-[10px] font-black">
                              {idx + 1}
                            </span>
                            Mobile Banner {idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeMobileHeroImage(idx)}
                            className="text-[10px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                          <div className="md:col-span-4 flex items-center gap-3">
                            <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shrink-0">
                              <img src={banner.imageUrl} alt={`Mobile Banner ${idx + 1}`} className="w-full h-full object-contain p-1" />
                            </div>
                            <p className="text-[9px] text-slate-400">Mobile Banner {idx + 1}</p>
                          </div>

                          <div className="md:col-span-8 space-y-2">
                            <Label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Click Action Destination</Label>
                            <div className="grid grid-cols-3 gap-1">
                              {[
                                { value: 'shop', label: '🛍️ Shop' },
                                { value: 'category', label: '🗂️ Cat.' },
                                { value: 'product', label: '📱 Prod.' },
                              ].map(opt => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => updateMobileBannerItem(idx, {
                                    clickAction: opt.value as any,
                                    link: opt.value === 'shop' ? '#products' : opt.value === 'collections' ? '#collections' : banner.link
                                  })}
                                  disabled={!isEligible}
                                  className={cn(
                                    "py-1.5 px-1 text-[10px] font-bold rounded-lg border transition-all text-center",
                                    actionType === opt.value
                                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                                      : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                                  )}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>

                            {actionType === 'category' && (
                              <select
                                value={banner.link || ''}
                                onChange={(e) => updateMobileBannerItem(idx, { link: e.target.value })}
                                disabled={!isEligible}
                                className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-800 px-2.5 text-xs bg-white dark:bg-slate-900 dark:text-slate-100"
                              >
                                <option value="">Select Category…</option>
                                {categoryList.map(cat => (
                                  <option key={cat} value={`?category=${encodeURIComponent(cat)}`}>{cat}</option>
                                ))}
                                {categoryList.length === 0 && <option value="" disabled>No categories yet</option>}
                              </select>
                            )}

                            {actionType === 'product' && (
                              <select
                                value={banner.link || ''}
                                onChange={(e) => updateMobileBannerItem(idx, { link: e.target.value })}
                                disabled={!isEligible}
                                className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-800 px-2.5 text-xs bg-white dark:bg-slate-900 dark:text-slate-100"
                              >
                                <option value="">Select Product…</option>
                                {productList.map(p => (
                                  <option key={p.id} value={`p/${p.id}`}>{p.name}</option>
                                ))}
                                {productList.length === 0 && <option value="" disabled>No products yet</option>}
                              </select>
                            )}

                            {actionType === 'custom_url' && (
                              <Input
                                value={banner.link || ''}
                                onChange={(e) => updateMobileBannerItem(idx, { link: e.target.value })}
                                placeholder="https://your-custom-link.com"
                                className="w-full h-8 text-xs bg-white dark:bg-slate-900"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* ── Settings for Product Showcase Hero ──────────── */}
            {formData.heroTemplate === 'split' && (
              <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                    Product Showcase Hero Settings
                  </span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                </div>

                {/* 1. Background Color */}
                <ColorPicker
                  label="Hero Background Color"
                  description="Select a dark or rich background color for your desktop hero card."
                  name="heroBgColor"
                  value={formData.heroBgColor}
                  onChange={handleChange}
                  onSet={(v) => setFormData((p: any) => ({ ...p, heroBgColor: v }))}
                  presets={['#0f172a', '#1e1b4b', '#0c0a09', '#052e16', '#450a0a', '#1e3a5f', '#18181b', '#0d1117']}
                />

                {/* 2. Text Content & Highlight Badge */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
                  <div className="border-b border-slate-200/60 dark:border-slate-800 pb-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="text-indigo-600">📝</span> Hero Headline &amp; Subtitle
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Configure the top badge tag, main title, and subtext for desktop view.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs font-bold">Top Highlight Tag (Mini Badge)</Label>
                      <Input name="heroBadge" value={formData.heroBadge} onChange={handleChange}
                        placeholder="e.g. New Arrival" disabled={isPending || !isEligible} className="mt-1 text-xs h-9" />
                      <p className="text-[9px] text-slate-400 mt-1">Tag shown above main title</p>
                    </div>
                    <div>
                      <Label className="text-xs font-bold">Main Headline</Label>
                      <Input name="heroTitle" value={formData.heroTitle} onChange={handleChange}
                        placeholder="e.g. Premium Quality. Timeless Style." disabled={isPending || !isEligible} className="mt-1 text-xs h-9" />
                      <p className="text-[9px] text-slate-400 mt-1">Main banner heading title</p>
                    </div>
                    <div>
                      <Label className="text-xs font-bold">Subtitle</Label>
                      <Input name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange}
                        placeholder="e.g. Discover premium products at best prices" disabled={isPending || !isEligible} className="mt-1 text-xs h-9" />
                      <p className="text-[9px] text-slate-400 mt-1">Short tagline under headline</p>
                    </div>
                  </div>
                </div>

                {/* 3. Action Buttons (CTA) */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
                  <div className="border-b border-slate-200/60 dark:border-slate-800 pb-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="text-indigo-600">🔘</span> Action Button (CTA)
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Button displayed on the hero banner (defaults to your shop page).</p>
                  </div>

                  <div>
                    <Label className="text-xs font-bold block mb-1.5">Select Primary Button Label</Label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {['Shop Now', 'Explore Now'].map(preset => {
                        const isSelected = (formData.heroCtaText || 'Shop Now') === preset
                        return (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setFormData((p: any) => ({ ...p, heroCtaText: preset }))}
                            className={cn(
                              "px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-2xs",
                              isSelected
                                ? "bg-indigo-600 border-indigo-600 text-white shadow-indigo-600/20"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700"
                            )}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                            {preset}
                          </button>
                        )
                      })}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
                      Selected button label: <strong className="text-slate-900 dark:text-white">{formData.heroCtaText || 'Shop Now'}</strong> (links directly to shop page).
                    </p>
                  </div>
                </div>

                {/* 4. Trust Badges & Guarantee Labels */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
                  <div className="border-b border-slate-200/60 dark:border-slate-800 pb-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="text-indigo-600">🛡</span> Trust &amp; Guarantee Badges
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">3 trust signals displayed below action buttons to build customer confidence.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs font-bold">Trust Badge 1</Label>
                      <Input name="heroBadge1" value={formData.heroBadge1} onChange={handleChange}
                        placeholder="e.g. Free Shipping" disabled={isPending || !isEligible} className="mt-1 text-xs h-9" />
                    </div>
                    <div>
                      <Label className="text-xs font-bold">Trust Badge 2</Label>
                      <Input name="heroBadge2" value={formData.heroBadge2} onChange={handleChange}
                        placeholder="e.g. Easy Returns" disabled={isPending || !isEligible} className="mt-1 text-xs h-9" />
                    </div>
                    <div>
                      <Label className="text-xs font-bold">Trust Badge 3</Label>
                      <Input name="heroBadge3" value={formData.heroBadge3} onChange={handleChange}
                        placeholder="e.g. COD Available" disabled={isPending || !isEligible} className="mt-1 text-xs h-9" />
                    </div>
                  </div>
                </div>

                {/* Product Showcase Images */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <Label>Product Showcase Images <span className="text-slate-400 font-normal">(up to 5 — auto-slides)</span></Label>
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-mono font-semibold text-[9px] tracking-wider">
                          300 × 300 px
                        </span>
                        Square PNG/JPG recommended &middot; transparent background works best &middot; max 5 MB
                      </p>
                    </div>
                    {(formData.heroImages || []).length < 5 && (
                      <label
                        htmlFor="hero_images_file"
                        className={cn(
                          "cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors",
                          (!isEligible || uploadingField !== null) && "opacity-50 pointer-events-none"
                        )}
                      >
                        {uploadingField === 'heroImages' ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        Add Image
                      </label>
                    )}
                    <input
                      id="hero_images_file"
                      type="file"
                      accept="image/*"
                      onChange={handleMultipleImagesUpload}
                      className="hidden"
                      disabled={!isEligible || uploadingField !== null}
                    />
                  </div>

                  {(formData.heroShowcaseBanners || []).length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center bg-white/50 dark:bg-slate-950/50">
                      <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No images added yet</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Upload up to 5 product showcase images — configure distinct click targets for each.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(formData.heroShowcaseBanners || []).map((banner: HeroBannerItem, idx: number) => {
                        const actionType = banner.clickAction || 'shop'
                        return (
                          <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-3 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center text-[10px] font-black">
                                  {idx + 1}
                                </span>
                                Showcase Image {idx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeHeroImage(idx)}
                                className="text-[10px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400"
                              >
                                Remove
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                              <div className="md:col-span-4 flex items-center gap-3">
                                <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shrink-0">
                                  <img src={banner.imageUrl} alt={`Showcase Image ${idx + 1}`} className="w-full h-full object-contain p-1" />
                                </div>
                                <p className="text-[9px] text-slate-400">Showcase Image {idx + 1}</p>
                              </div>

                              <div className="md:col-span-8 space-y-2">
                                <Label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Click Action Destination</Label>
                                <div className="grid grid-cols-3 gap-1">
                                  {[
                                    { value: 'shop', label: '🛍️ Shop' },
                                    { value: 'category', label: '🗂️ Cat.' },
                                    { value: 'product', label: '📱 Prod.' },
                                  ].map(opt => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => updateShowcaseBannerItem(idx, {
                                        clickAction: opt.value as any,
                                        link: opt.value === 'shop' ? '#products' : opt.value === 'collections' ? '#collections' : banner.link
                                      })}
                                      disabled={!isEligible}
                                      className={cn(
                                        "py-1.5 px-1 text-[10px] font-bold rounded-lg border transition-all text-center",
                                        actionType === opt.value
                                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                                          : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                                      )}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>

                                {actionType === 'category' && (
                                  <select
                                    value={banner.link || ''}
                                    onChange={(e) => updateShowcaseBannerItem(idx, { link: e.target.value })}
                                    disabled={!isEligible}
                                    className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-800 px-2.5 text-xs bg-white dark:bg-slate-900 dark:text-slate-100"
                                  >
                                    <option value="">Select Category…</option>
                                    {categoryList.map(cat => (
                                      <option key={cat} value={`?category=${encodeURIComponent(cat)}`}>{cat}</option>
                                    ))}
                                    {categoryList.length === 0 && <option value="" disabled>No categories yet</option>}
                                  </select>
                                )}

                                {actionType === 'product' && (
                                  <select
                                    value={banner.link || ''}
                                    onChange={(e) => updateShowcaseBannerItem(idx, { link: e.target.value })}
                                    disabled={!isEligible}
                                    className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-800 px-2.5 text-xs bg-white dark:bg-slate-900 dark:text-slate-100"
                                  >
                                    <option value="">Select Product…</option>
                                    {productList.map(p => (
                                      <option key={p.id} value={`p/${p.id}`}>{p.name}</option>
                                    ))}
                                    {products.length === 0 && <option value="" disabled>No products yet</option>}
                                  </select>
                                )}

                                {actionType === 'custom_url' && (
                                  <Input
                                    value={banner.link || ''}
                                    onChange={(e) => updateShowcaseBannerItem(idx, { link: e.target.value })}
                                    placeholder="https://your-custom-link.com"
                                    className="w-full h-8 text-xs bg-white dark:bg-slate-900"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Live Preview */}
                <div className="rounded-2xl overflow-hidden bg-slate-950 text-white p-5 relative border border-slate-800">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0 pointer-events-none" />
                  <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                  <p className="relative z-10 text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3">Live Preview</p>
                  <div className="relative z-10 grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-8 space-y-2 text-left">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-white/10 text-slate-200 border border-white/5">
                        {formData.heroBadge || 'New Arrival'}
                      </span>
                      <h2 className="text-base font-black tracking-tight leading-tight text-white">{formData.heroTitle || 'Premium Quality. Timeless Style.'}</h2>
                      <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{formData.heroSubtitle || 'Discover our new collection of premium products.'}</p>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-3 py-1.5 bg-white text-slate-950 font-black text-[10px] rounded-lg shadow-sm">{formData.heroCtaText || 'Shop Now'}</span>
                      </div>
                      <div className="flex items-center gap-3 pt-2 border-t border-white/10 text-slate-400 text-[8px] font-bold">
                        <span>✓ {formData.heroBadge1 || 'Free Shipping'}</span>
                        <span>✓ {formData.heroBadge2 || 'Easy Returns'}</span>
                        <span>✓ {formData.heroBadge3 || 'COD Available'}</span>
                      </div>
                    </div>
                    <div className="col-span-4 flex justify-center">
                      <div className="relative w-full max-w-[110px] h-20 sm:h-24 rounded-xl overflow-hidden shadow-xl flex items-center justify-center">
                        {(formData.heroImages || []).length > 0 ? (
                          <img src={formData.heroImages[0]} className="w-full h-full object-cover" alt="Mockup" />
                        ) : (
                          <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&auto=format&fit=crop" className="w-full h-full object-cover" alt="Default Product" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Settings for Promotion Banner (Multi-Banner Slider & Destinations) ── */}
            {formData.heroTemplate === 'banner' && (
              <div className="space-y-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-2">Promotion Banner Carousel &amp; Navigation</span>
                  <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                </div>

                {/* Banner List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Desktop Banners</Label>
                      <p className="text-[11px] text-slate-500">Upload single or multiple promo banners — they will auto-slide on your storefront carousel.</p>
                      <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full font-mono font-semibold text-[9px] tracking-wider">
                          1200 × 480 px
                        </span>
                        Wide landscape image &middot; JPG/PNG/WebP &middot; max 5 MB
                      </p>
                    </div>
                    <label
                      htmlFor="hero_banner_multi_file"
                      className={cn(
                        "cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm",
                        (!isEligible || uploadingField !== null) && "opacity-50 pointer-events-none"
                      )}
                    >
                      {uploadingField === 'heroBanners-new' ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      Add New Banner
                    </label>
                    <input
                      id="hero_banner_multi_file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleMultipleBannersUpload(e)}
                      className="hidden"
                      disabled={!isEligible || uploadingField !== null}
                    />
                  </div>

                  {(formData.heroBanners || []).length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
                      <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">No Banners Uploaded Yet</p>
                      <p className="text-[11px] text-slate-400 max-w-sm">Upload promotional banner graphics created in Canva, ChatGPT, or Photoshop. Each banner can link directly to a product, category, or offer page.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(formData.heroBanners || []).map((banner: HeroBannerItem, idx: number) => {
                        const actionType = banner.clickAction || 'shop'
                        return (
                          <div key={banner.id || idx} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-sm">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-black text-xs flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                                  {idx + 1}
                                </span>
                                <span className="font-bold text-xs text-slate-900 dark:text-white">Promotional Banner {idx + 1}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeBannerItem(idx)}
                                className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                              >
                                Remove
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                              <div className="md:col-span-5 flex gap-3 items-center">
                                <div className="relative w-36 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shrink-0">
                                  <img src={banner.imageUrl} alt={`Banner ${idx + 1}`} className="w-full h-full object-cover" />
                                  {uploadingField === `heroBanners-${idx}` && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <label
                                    htmlFor={`change_banner_file_${idx}`}
                                    className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-bold text-slate-700 dark:text-slate-200 transition-colors"
                                  >
                                    <Upload className="w-3 h-3" />
                                    Change Image
                                  </label>
                                  <input
                                    id={`change_banner_file_${idx}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleMultipleBannersUpload(e, idx)}
                                    className="hidden"
                                    disabled={!isEligible || uploadingField !== null}
                                  />
                                  <p className="text-[9px] text-slate-400 mt-1">1920×600 px recommended</p>
                                </div>
                              </div>

                              <div className="md:col-span-7 space-y-2">
                                <Label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Click Action Destination</Label>
                                <div className="grid grid-cols-3 gap-1">
                                  {[
                                    { value: 'shop', label: '🛍️ Shop' },
                                    { value: 'category', label: '🗂️ Cat.' },
                                    { value: 'product', label: '📱 Prod.' },
                                  ].map(opt => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => updateBannerItem(idx, {
                                        clickAction: opt.value as any,
                                        link: opt.value === 'shop' ? '#products' : opt.value === 'collections' ? '#collections' : ''
                                      })}
                                      disabled={!isEligible}
                                      className={cn(
                                        "py-1.5 px-1 text-[10px] font-bold rounded-lg border transition-all text-center",
                                        actionType === opt.value
                                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                                          : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                                      )}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>

                                {actionType === 'category' && (
                                  <select
                                    value={banner.link || ''}
                                    onChange={(e) => updateBannerItem(idx, { link: e.target.value })}
                                    disabled={!isEligible}
                                    className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-800 px-2.5 text-xs bg-white dark:bg-slate-900 dark:text-slate-100"
                                  >
                                    <option value="">Select Category…</option>
                                    {categories.map(cat => (
                                      <option key={cat} value={`?category=${encodeURIComponent(cat)}`}>{cat}</option>
                                    ))}
                                    {categories.length === 0 && <option value="" disabled>No categories yet</option>}
                                  </select>
                                )}

                                {actionType === 'product' && (
                                  <select
                                    value={banner.link || ''}
                                    onChange={(e) => updateBannerItem(idx, { link: e.target.value })}
                                    disabled={!isEligible}
                                    className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-800 px-2.5 text-xs bg-white dark:bg-slate-900 dark:text-slate-100"
                                  >
                                    <option value="">Select Product…</option>
                                    {products.map(p => (
                                      <option key={p.id} value={`p/${p.id}`}>{p.name}</option>
                                    ))}
                                    {products.length === 0 && <option value="" disabled>No products yet</option>}
                                  </select>
                                )}

                                {actionType === 'custom_url' && (
                                  <Input
                                    value={banner.link || ''}
                                    onChange={(e) => updateBannerItem(idx, { link: e.target.value })}
                                    placeholder="https://your-custom-link.com"
                                    disabled={!isEligible}
                                    className="h-8 text-xs"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Section>

      <Section icon={Bell} title="Announcement Banner" pro={!isEligible}>
        <ToggleRow label="Enable Banner" description="Top marquee banner for promotions" checked={formData.bannerEnabled} onChange={v => handleToggle('bannerEnabled', v)} disabled={!isEligible} />
        {formData.bannerEnabled && (
          <div className="mt-3">
            <Input name="bannerText" value={formData.bannerText} onChange={handleChange}
              placeholder="🎉 Free shipping on orders above ₹500!" disabled={isPending || !isEligible} />
            {formData.bannerText && (
              <div className="mt-3 rounded-lg overflow-hidden border">
                <div className="py-2 px-4 text-center text-xs font-bold text-white" style={{ backgroundColor: formData.primaryColor }}>{formData.bannerText}</div>
              </div>
            )}
          </div>
        )}
      </Section>
    </div>
  )
}
