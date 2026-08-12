'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tag } from 'lucide-react'
import { Section, ToggleRow } from './ShopSettingsHelpers'

interface OfferBannerSectionProps {
  formData: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleToggle: (name: string, val: boolean) => void
  isPending: boolean
  isEligible: boolean
}

export default function OfferBannerSection({
  formData,
  handleChange,
  handleToggle,
  isPending,
  isEligible,
}: OfferBannerSectionProps) {
  return (
    <Section icon={Tag} title="Special Promotion Banner" pro={!isEligible}>
      <ToggleRow
        label="Enable Special Promotion Banner"
        description="Show high-conversion offer banner strip on your store homepage"
        checked={formData.offerBannerEnabled}
        onChange={v => handleToggle('offerBannerEnabled', v)}
        disabled={!isEligible}
      />
      {formData.offerBannerEnabled && (
        <div className="space-y-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Badge Label</Label>
              <Input
                name="offerBannerBadge"
                value={formData.offerBannerBadge}
                onChange={handleChange}
                placeholder="⚡ Special Promotion"
                disabled={isPending || !isEligible}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Coupon Code</Label>
              <Input
                name="offerBannerCode"
                value={formData.offerBannerCode}
                onChange={handleChange}
                placeholder="SAVE10"
                disabled={isPending || !isEligible}
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label>Offer Headline</Label>
            <Input
              name="offerBannerTitle"
              value={formData.offerBannerTitle}
              onChange={handleChange}
              placeholder="Limited Time Offer: Get 10% OFF on Orders Above ₹1,499"
              disabled={isPending || !isEligible}
              className="mt-1.5"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Subtext / Instructions</Label>
              <Input
                name="offerBannerSubtext"
                value={formData.offerBannerSubtext}
                onChange={handleChange}
                placeholder="Use code SAVE10 at checkout."
                disabled={isPending || !isEligible}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input
                name="offerBannerBtnText"
                value={formData.offerBannerBtnText}
                onChange={handleChange}
                placeholder="Claim Offer Now"
                disabled={isPending || !isEligible}
                className="mt-1.5"
              />
            </div>
          </div>

          {/* Banner Live Preview Box */}
          <div className="mt-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Preview</p>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="space-y-1 text-center sm:text-left">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {formData.offerBannerBadge || '⚡ Special Promotion'}
                </span>
                <p className="text-sm font-black text-white leading-tight">
                  {formData.offerBannerTitle || 'Limited Time Offer: Get 10% OFF on Orders Above ₹1,499'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {formData.offerBannerSubtext || `Use code ${formData.offerBannerCode || 'SAVE10'} at checkout.`}
                </p>
              </div>
              <span className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl whitespace-nowrap shadow-sm">
                {formData.offerBannerBtnText || 'Claim Offer Now'}
              </span>
            </div>
          </div>
        </div>
      )}
    </Section>
  )
}
