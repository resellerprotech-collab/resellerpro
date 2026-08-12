'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Search } from 'lucide-react'
import { Section } from './ShopSettingsHelpers'

interface SeoTabSectionProps {
  formData: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  isPending: boolean
  isEligible: boolean
}

export default function SeoTabSection({
  formData,
  handleChange,
  isPending,
  isEligible,
}: SeoTabSectionProps) {
  return (
    <div className="space-y-6">
      <Section icon={Search} title="SEO &amp; Meta Tags" pro={!isEligible}>
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-bold">Search Engine Title</Label>
            <Input name="seoTitle" value={formData.seoTitle} onChange={handleChange}
              placeholder="e.g. Royal Fashion Store - Trendy Clothing &amp; Accessories" disabled={isPending || !isEligible} className="mt-1 text-sm" />
            <p className="text-xs text-muted-foreground mt-1">Recommended: 50-60 characters</p>
          </div>
          <div>
            <Label className="text-xs font-bold">Meta Description</Label>
            <Textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange}
              placeholder="Brief summary of your store for Google search results..." rows={3} disabled={isPending || !isEligible} className="mt-1 text-sm" />
            <p className="text-xs text-muted-foreground mt-1">Recommended: 150-160 characters</p>
          </div>
        </div>
      </Section>
    </div>
  )
}
