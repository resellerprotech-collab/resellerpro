'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail } from 'lucide-react'
import { Section, ToggleRow } from './ShopSettingsHelpers'

interface NewsletterBannerSectionProps {
  formData: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleToggle: (name: string, val: boolean) => void
  isPending: boolean
  isEligible: boolean
}

export default function NewsletterBannerSection({
  formData,
  handleChange,
  handleToggle,
  isPending,
  isEligible,
}: NewsletterBannerSectionProps) {
  return (
    <Section icon={Mail} title="VIP Circle / Newsletter Banner" pro={!isEligible}>
      <ToggleRow
        label="Enable VIP Circle Banner"
        description="Show subscription banner strip on your store homepage footer"
        checked={formData.newsletterEnabled}
        onChange={v => handleToggle('newsletterEnabled', v)}
        disabled={!isEligible}
      />
      {formData.newsletterEnabled && (
        <div className="space-y-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Banner Heading Title</Label>
            <Input
              name="newsletterTitle"
              value={formData.newsletterTitle}
              onChange={handleChange}
              placeholder="JOIN OUR VIP CIRCLE"
              disabled={isPending || !isEligible}
              className="mt-1 h-9 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Banner Description Subtext</Label>
            <Input
              name="newsletterSubtitle"
              value={formData.newsletterSubtitle}
              onChange={handleChange}
              placeholder="Subscribe to get exclusive discount codes, new arrival alerts, and special event invites."
              disabled={isPending || !isEligible}
              className="mt-1 h-9 text-xs"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Input Placeholder Text</Label>
              <Input
                name="newsletterPlaceholder"
                value={formData.newsletterPlaceholder}
                onChange={handleChange}
                placeholder="Enter your email address"
                disabled={isPending || !isEligible}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Button Label</Label>
              <Input
                name="newsletterBtnText"
                value={formData.newsletterBtnText}
                onChange={handleChange}
                placeholder="SUBSCRIBE"
                disabled={isPending || !isEligible}
                className="mt-1 h-9 text-xs"
              />
            </div>
          </div>

          {/* Banner Live Preview Box */}
          <div className="mt-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Live Preview</p>
            <div className="p-4 md:p-5 rounded-2xl bg-[#1a1a1c] border border-slate-800 text-white">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1 max-w-lg">
                  <h3 className="text-base md:text-lg font-black tracking-tight text-white">
                    {formData.newsletterTitle || 'JOIN OUR VIP CIRCLE'}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {formData.newsletterSubtitle || 'Subscribe to get exclusive discount codes, new arrival alerts, and special event invites.'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto">
                  <input
                    type="text"
                    placeholder={formData.newsletterPlaceholder || 'Enter your email address'}
                    className="w-full sm:w-56 px-3.5 py-2 rounded-xl bg-[#0f0f11] border border-slate-800 text-white text-xs focus:outline-none placeholder:text-slate-600"
                    disabled
                  />
                  <button
                    type="button"
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold uppercase tracking-wide whitespace-nowrap transition-colors shadow-sm"
                    disabled
                  >
                    {formData.newsletterBtnText || 'SUBSCRIBE'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  )
}
