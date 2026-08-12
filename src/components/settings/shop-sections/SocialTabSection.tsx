'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  MessageCircle, Share2, Instagram, Facebook, Twitter, Youtube
} from 'lucide-react'
import { Section, ToggleRow, SocialInput } from './ShopSettingsHelpers'

interface SocialTabSectionProps {
  formData: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleToggle: (name: string, val: boolean) => void
  isPending: boolean
  isEligible: boolean
}

export default function SocialTabSection({
  formData,
  handleChange,
  handleToggle,
  isPending,
  isEligible,
}: SocialTabSectionProps) {
  return (
    <div className="space-y-6">
      <Section icon={MessageCircle} title="WhatsApp Chat Widget" pro={!isEligible}>
        <ToggleRow label="Floating Chat Button" description="Show WhatsApp chat button on all pages" checked={formData.chatWidgetEnabled} onChange={v => handleToggle('chatWidgetEnabled', v)} disabled={!isEligible} />
        {formData.chatWidgetEnabled && (
          <div className="mt-3 space-y-3">
            <div>
              <Label>WhatsApp Phone Number</Label>
              <Input name="socialWhatsApp" value={formData.socialWhatsApp} onChange={handleChange}
                placeholder="e.g. 9876543210 or +91 98765 43210" disabled={isPending || !isEligible} className="mt-1.5" />
            </div>
            <div>
              <Label>Pre-filled Message</Label>
              <Input name="chatWidgetMessage" value={formData.chatWidgetMessage} onChange={handleChange}
                placeholder="Hi! I found your store online..." disabled={isPending || !isEligible} className="mt-1.5" />
            </div>
            <div className="mt-3 flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-900/30">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-green-900 dark:text-green-300">Widget Preview</p>
                <p className="text-[11px] text-green-700 dark:text-green-400">Floating button appears in bottom corner of your store</p>
              </div>
            </div>
          </div>
        )}
      </Section>

      <Section icon={Share2} title="Social Media Links" pro={!isEligible}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SocialInput icon={Instagram} label="Instagram" name="socialInstagram" value={formData.socialInstagram} onChange={handleChange} placeholder="https://instagram.com/yourhandle" disabled={isPending || !isEligible} />
          <SocialInput icon={Facebook} label="Facebook" name="socialFacebook" value={formData.socialFacebook} onChange={handleChange} placeholder="https://facebook.com/yourpage" disabled={isPending || !isEligible} />
          <SocialInput icon={Twitter} label="Twitter / X" name="socialTwitter" value={formData.socialTwitter} onChange={handleChange} placeholder="https://twitter.com/yourhandle" disabled={isPending || !isEligible} />
          <SocialInput icon={Youtube} label="YouTube" name="socialYoutube" value={formData.socialYoutube} onChange={handleChange} placeholder="https://youtube.com/@yourchannel" disabled={isPending || !isEligible} />
        </div>
      </Section>
    </div>
  )
}
