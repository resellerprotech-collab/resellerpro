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
        <div className="space-y-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Banner Heading Title</Label>
            <Input
              name="newsletterTitle"
              value={formData.newsletterTitle}
              onChange={handleChange}
              placeholder="JOIN OUR VIP CIRCLE"
              disabled={isPending || !isEligible}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Banner Description Subtext</Label>
            <Input
              name="newsletterSubtitle"
              value={formData.newsletterSubtitle}
              onChange={handleChange}
              placeholder="Subscribe to get exclusive discount codes, new arrival alerts, and special event invites."
              disabled={isPending || !isEligible}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Input Placeholder Text</Label>
              <Input
                name="newsletterPlaceholder"
                value={formData.newsletterPlaceholder}
                onChange={handleChange}
                placeholder="Enter your email address"
                disabled={isPending || !isEligible}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Button Label</Label>
              <Input
                name="newsletterBtnText"
                value={formData.newsletterBtnText}
                onChange={handleChange}
                placeholder="SUBSCRIBE"
                disabled={isPending || !isEligible}
                className="mt-1"
              />
            </div>
          </div>

          {/* Banner Live Preview Box */}
          <div className="mt-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Live Preview</p>
            <div className="p-6 md:p-8 rounded-2xl bg-[#1a1a1c] border border-slate-800 text-white">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1.5 max-w-lg">
                  <h3 className="text-xl md:text-2xl font-black tracking-tight text-white">
                    {formData.newsletterTitle || 'JOIN OUR VIP CIRCLE'}
                  </h3>
                  <p className="text-[13px] text-slate-400 leading-relaxed">
                    {formData.newsletterSubtitle || 'Subscribe to get exclusive discount codes, new arrival alerts, and special event invites.'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                  <input
                    type="text"
                    placeholder={formData.newsletterPlaceholder || 'Enter your email address'}
                    className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-[#0f0f11] border border-slate-800 text-white text-sm focus:outline-none placeholder:text-slate-600"
                    disabled
                  />
                  <button
                    type="button"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wide whitespace-nowrap transition-colors shadow-lg shadow-indigo-900/20"
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
