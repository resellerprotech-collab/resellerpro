'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Palette, Layout, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Section, ToggleRow, ColorPicker } from './ShopSettingsHelpers'

interface AppearanceTabSectionProps {
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleToggle: (name: string, val: boolean) => void
}

export default function AppearanceTabSection({
  formData,
  setFormData,
  handleChange,
  handleToggle,
}: AppearanceTabSectionProps) {
  return (
    <div className="space-y-6">
      {/* Branding & Theme Colors */}
      <Section icon={Palette} title="Store Colors &amp; Theme">
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Customize the visual colors for your storefront elements. Click a color box or select a preset palette below.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <ColorPicker
              label="Primary Brand Color"
              description="Main action buttons (Buy Now, Add to Cart), links &amp; active tabs."
              name="primaryColor"
              value={formData.primaryColor}
              onChange={handleChange}
              onSet={(v) => setFormData((p: any) => ({ ...p, primaryColor: v }))}
              presets={['#4f46e5', '#059669', '#dc2626', '#ea580c', '#7c3aed', '#0891b2']}
            />
            <ColorPicker
              label="Secondary Hover Color"
              description="Navigation hover highlights, sub-headers &amp; secondary buttons."
              name="secondaryColor"
              value={formData.secondaryColor}
              onChange={handleChange}
              onSet={(v) => setFormData((p: any) => ({ ...p, secondaryColor: v }))}
              presets={['#4338ca', '#047857', '#b91c1c', '#c2410c', '#6d28d9', '#0369a1']}
            />
            <ColorPicker
              label="Accent &amp; Promo Highlight"
              description="Sale tags, discount badges, offer banners &amp; notification badges."
              name="accentColor"
              value={formData.accentColor}
              onChange={handleChange}
              onSet={(v) => setFormData((p: any) => ({ ...p, accentColor: v }))}
              presets={['#f97316', '#eab308', '#ec4899', '#14b8a6', '#8b5cf6', '#f43f5e']}
            />
            <ColorPicker
              label="Dark Background &amp; Titles"
              description="Dark sections, footer backdrop, main titles &amp; hero text."
              name="neutralDarkColor"
              value={formData.neutralDarkColor}
              onChange={handleChange}
              onSet={(v) => setFormData((p: any) => ({ ...p, neutralDarkColor: v }))}
              presets={['#0f172a', '#1e293b', '#334155', '#18181b', '#27272a', '#171717']}
            />
            <ColorPicker
              label="Top Header Background"
              description="Background color of your store's top navigation bar."
              name="navbarBgColor"
              value={formData.navbarBgColor}
              onChange={handleChange}
              onSet={(v) => setFormData((p: any) => ({ ...p, navbarBgColor: v }))}
              presets={['#ffffff', '#f8fafc', '#0f172a', '#1e293b', '#4f46e5', '#059669']}
            />
            <ColorPicker
              label="Header Text &amp; Icons"
              description="Color for header menu items, search bar icon &amp; cart icon."
              name="navbarTextColor"
              value={formData.navbarTextColor}
              onChange={handleChange}
              onSet={(v) => setFormData((p: any) => ({ ...p, navbarTextColor: v }))}
              presets={['#0f172a', '#334155', '#ffffff', '#e2e8f0', '#4f46e5', '#ffffff']}
            />
          </div>
        </div>
      </Section>

      {/* Layout & Typography */}
      <Section icon={Layout} title="Layout &amp; Typography">
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6 pt-2">
            <div>
              <Label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-400">Button Shape</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'rounded', label: 'Rounded', radius: 'rounded-lg' },
                  { value: 'pill', label: 'Pill', radius: 'rounded-full' },
                  { value: 'sharp', label: 'Square', radius: 'rounded-none' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData((p: any) => ({ ...p, buttonStyle: opt.value }))}
                    className={cn(
                      "py-2 px-2 text-xs font-bold border transition-all text-center",
                      opt.radius,
                      formData.buttonStyle === opt.value
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="fontFamily" className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-400">Font Family</Label>
              <select
                id="fontFamily"
                name="fontFamily"
                value={formData.fontFamily}
                onChange={handleChange}
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 px-3 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
              >
                <option value="default">System Default</option>
                <option value="inter">Inter (Clean &amp; Modern)</option>
                <option value="poppins">Poppins (Friendly)</option>
                <option value="playfair">Playfair (Elegant Luxury)</option>
                <option value="roboto">Roboto (Professional)</option>
                <option value="outfit">Outfit (Bold &amp; Contemporary)</option>
              </select>
            </div>
          </div>
        </div>
      </Section>

      {/* Display Options */}
      <Section icon={Eye} title="Display Options">
        <div className="space-y-3">
          <ToggleRow label="Show Prices" description="Display product prices publicly on storefront" checked={formData.showPrices} onChange={v => handleToggle('showPrices', v)} />
          <ToggleRow label="WhatsApp Buy Button" description="Show 'Buy on WhatsApp' button on product pages" checked={formData.showWhatsApp} onChange={v => handleToggle('showWhatsApp', v)} />
          <ToggleRow label="Category Showcase" description="Show visual category cards on store homepage" checked={formData.categoryShowcase} onChange={v => handleToggle('categoryShowcase', v)} />
        </div>
      </Section>
    </div>
  )
}
