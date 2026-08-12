'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MapPin } from 'lucide-react'
import { Section } from './ShopSettingsHelpers'

interface FooterTabSectionProps {
  formData: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  isPending: boolean
  isEligible: boolean
}

export default function FooterTabSection({
  formData,
  handleChange,
  isPending,
  isEligible,
}: FooterTabSectionProps) {
  return (
    <div className="space-y-6">
      <Section icon={MapPin} title="Custom Footer" pro={!isEligible}>
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-bold">Footer About Text</Label>
            <Textarea name="footerAbout" value={formData.footerAbout} onChange={handleChange}
              placeholder="Short description displayed in storefront footer..." rows={2} disabled={isPending || !isEligible} className="mt-1 text-sm" />
          </div>
          <div>
            <Label className="text-xs font-bold">Store Address</Label>
            <Input name="footerAddress" value={formData.footerAddress} onChange={handleChange}
              placeholder="123 Fashion Street, Mumbai, India" disabled={isPending || !isEligible} className="mt-1 text-sm" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-bold">Support Email</Label>
              <Input name="footerEmail" value={formData.footerEmail} onChange={handleChange}
                placeholder="support@yourstore.com" disabled={isPending || !isEligible} className="mt-1 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-bold">Support Phone</Label>
              <Input name="footerPhone" value={formData.footerPhone} onChange={handleChange}
                placeholder="+91 98765 43210" disabled={isPending || !isEligible} className="mt-1 text-sm" />
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
