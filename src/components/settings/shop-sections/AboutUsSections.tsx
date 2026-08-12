'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  BookOpen, BarChart3, Upload, Loader2, Eye, ExternalLink, Image as ImageIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Section, ToggleRow } from './ShopSettingsHelpers'

interface AboutUsSectionsProps {
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleToggle: (name: string, val: boolean) => void
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => Promise<void>
  uploadingField: string | null
  isPending: boolean
  isEligible: boolean
}

export default function AboutUsSections({
  formData,
  setFormData,
  handleChange,
  handleToggle,
  handleFileUpload,
  uploadingField,
  isPending,
  isEligible,
}: AboutUsSectionsProps) {
  return (
    <div className="space-y-6">
      {/* ─── ABOUT PAGE HEADER BANNER ─── */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50/30 to-card dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-card border border-indigo-100 dark:border-indigo-900/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/40">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">About Page Content</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Customize the story, image, and stats shown on your About Us page</p>
          </div>
        </div>
        {formData.shop_slug && (
          <a
            href={`/store/${formData.shop_slug}/about`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-xl transition-colors shrink-0"
          >
            <Eye className="w-3.5 h-3.5" />
            View About Page
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* ─── ABOUT PAGE STORY SECTION ─── */}
      <Section icon={BookOpen} title="About Us Page - Story Section" pro={!isEligible}>
        <ToggleRow
          label="Enable Brand Story Section"
          description="Display your story content, main headline, bottom tagline, and image on your store About Us page"
          checked={formData.aboutStoryEnabled}
          onChange={v => handleToggle('aboutStoryEnabled', v)}
          disabled={!isEligible}
        />

        {formData.aboutStoryEnabled && (
          <div className="space-y-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <Label>Main Headline</Label>
              <Input
                name="aboutStoryTitle"
                value={formData.aboutStoryTitle}
                onChange={handleChange}
                placeholder="Built With Passion, Driven By You"
                disabled={isPending || !isEligible}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>About Content / Narrative Text</Label>
              <Textarea
                name="aboutPara1"
                value={formData.aboutPara1}
                onChange={handleChange}
                placeholder={`${formData.shop_slug || 'Your store'} was born out of a simple idea — to make every online shopping experience seamless, joyful, and trustworthy.`}
                rows={3}
                disabled={isPending || !isEligible}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Bottom Line / Signature Text</Label>
              <Input
                name="aboutSignatureText"
                value={formData.aboutSignatureText}
                onChange={handleChange}
                placeholder="Thank you for being part of our journey."
                disabled={isPending || !isEligible}
                className="mt-1.5"
              />
            </div>

            {/* Story Image Upload */}
            <div>
              <Label className="text-xs font-semibold mb-1.5 block">Story Banner Image</Label>
              <div className="flex items-start gap-4">
                <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  {formData.aboutStoryImage ? (
                    <img src={formData.aboutStoryImage} alt="Story Image" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-400">
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-[10px] font-medium">No image</span>
                    </div>
                  )}
                  {uploadingField === 'aboutStoryImage' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="about_story_image_file"
                    className={cn(
                      "cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors",
                      (!isEligible || uploadingField !== null) && "opacity-50 pointer-events-none"
                    )}
                  >
                    {uploadingField === 'aboutStoryImage' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    Upload Story Image
                  </label>
                  <input
                    id="about_story_image_file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'aboutStoryImage')}
                    className="hidden"
                    disabled={!isEligible || uploadingField !== null}
                  />
                  {formData.aboutStoryImage && (
                    <button
                      type="button"
                      onClick={() => setFormData((p: any) => ({ ...p, aboutStoryImage: '' }))}
                      className="text-xs text-red-500 font-bold block hover:underline"
                    >
                      Remove Image
                    </button>
                  )}
                  <p className="text-[10px] text-slate-400">Landscape image recommended. Max 5MB.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Section>

      {/* ─── ABOUT PAGE STATS BANNER SECTION ─── */}
      <Section icon={BarChart3} title="About Us Page - Store Statistics Banner" pro={!isEligible}>
        <ToggleRow
          label="Enable Store Statistics Banner"
          description="Display key trust metrics (Customers, Products, Countries, Feedback) on your About Us page"
          checked={formData.aboutStatsEnabled}
          onChange={v => handleToggle('aboutStatsEnabled', v)}
          disabled={!isEligible}
        />

        {formData.aboutStatsEnabled && (
          <div className="space-y-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Customize the 4 key metrics displayed on the stats bar:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(formData.aboutStats || []).map((st: any, idx: number) => (
                <div key={st.id || idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Metric #{idx + 1}
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[11px]">Big Value (Number)</Label>
                      <Input
                        value={st.value}
                        onChange={(e) => {
                          const val = e.target.value
                          setFormData((prev: any) => {
                            const updated = [...(prev.aboutStats || [])]
                            updated[idx] = { ...updated[idx], value: val }
                            return { ...prev, aboutStats: updated }
                          })
                        }}
                        placeholder="50K+"
                        disabled={isPending || !isEligible}
                        className="mt-1 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px]">Icon Style</Label>
                      <select
                        value={st.iconName || 'users'}
                        onChange={(e) => {
                          const val = e.target.value
                          setFormData((prev: any) => {
                            const updated = [...(prev.aboutStats || [])]
                            updated[idx] = { ...updated[idx], iconName: val }
                            return { ...prev, aboutStats: updated }
                          })
                        }}
                        disabled={isPending || !isEligible}
                        className="mt-1 w-full h-9 px-3 rounded-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-none"
                      >
                        <option value="users">Users / Customers</option>
                        <option value="shopping-bag">Shopping Bag / Products</option>
                        <option value="globe">Globe / International</option>
                        <option value="award">Award / Star Feedback</option>
                        <option value="shield-check">Shield / Trust</option>
                        <option value="heart">Heart / Satisfaction</option>
                        <option value="truck">Truck / Shipping</option>
                        <option value="smile">Smile / Reviews</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-[11px]">Metric Label</Label>
                    <Input
                      value={st.label}
                      onChange={(e) => {
                        const val = e.target.value
                        setFormData((prev: any) => {
                          const updated = [...(prev.aboutStats || [])]
                          updated[idx] = { ...updated[idx], label: val }
                          return { ...prev, aboutStats: updated }
                        })
                      }}
                      placeholder="Happy Customers"
                      disabled={isPending || !isEligible}
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>
    </div>
  )
}
