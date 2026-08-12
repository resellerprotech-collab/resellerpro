'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Quote, Trash2, User, Star, Plus, Upload, Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Section, ToggleRow } from './ShopSettingsHelpers'

interface TestimonialsSectionProps {
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
  handleToggle: (name: string, val: boolean) => void
  updateTestimonial: (index: number, field: string, value: string | number) => void
  handleTestimonialAvatarUpload: (index: number, e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  uploadingField: string | null
  isEligible: boolean
}

export default function TestimonialsSection({
  formData,
  setFormData,
  handleToggle,
  updateTestimonial,
  handleTestimonialAvatarUpload,
  uploadingField,
  isEligible,
}: TestimonialsSectionProps) {
  return (
    <Section icon={Quote} title="Customer Testimonials" pro={!isEligible}>
      <ToggleRow label="Enable Testimonials" description="Show customer reviews on your store" checked={formData.testimonialsEnabled} onChange={v => handleToggle('testimonialsEnabled', v)} disabled={!isEligible} />
      {formData.testimonialsEnabled && (
        <div className="space-y-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
            <div>
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Section Heading</Label>
              <Input
                placeholder="What Our Customers Say"
                value={formData.testimonialsHeading || ''}
                onChange={e => setFormData((prev: any) => ({ ...prev, testimonialsHeading: e.target.value }))}
                disabled={!isEligible}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Section Subheading</Label>
              <Input
                placeholder="Trusted by 5,000+ businesses and individuals worldwide"
                value={formData.testimonialsSubheading || ''}
                onChange={e => setFormData((prev: any) => ({ ...prev, testimonialsSubheading: e.target.value }))}
                disabled={!isEligible}
              />
            </div>
          </div>

          {formData.testimonials.map((t: any, i: number) => (
            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Testimonial {i + 1}</p>
                {formData.testimonials.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.testimonials.filter((_: any, idx: number) => idx !== i)
                      setFormData((prev: any) => ({ ...prev, testimonials: updated }))
                    }}
                    className="text-red-500 hover:text-red-600 text-xs flex items-center gap-1 font-medium transition-colors"
                    disabled={!isEligible}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="flex flex-col items-center gap-2 shrink-0 self-center sm:self-start">
                  <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 overflow-hidden flex items-center justify-center relative group shadow-sm">
                    {t.avatarUrl ? (
                      <img src={t.avatarUrl} alt={t.name || `Customer ${i + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                    )}
                    {uploadingField === `testimonial_avatar_${i}` && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleTestimonialAvatarUpload(i, e)}
                      disabled={!isEligible || uploadingField !== null}
                    />
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                      <Upload className="w-3 h-3" /> {t.avatarUrl ? 'Change' : 'Upload Image'}
                    </span>
                  </label>
                  {t.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => updateTestimonial(i, 'avatarUrl', '')}
                      className="text-[10px] text-red-500 hover:underline"
                      disabled={!isEligible}
                    >
                      Remove Image
                    </button>
                  )}
                </div>

                <div className="flex-1 space-y-2.5 w-full">
                  <Input placeholder="Customer name" value={t.name} onChange={e => updateTestimonial(i, 'name', e.target.value)} disabled={!isEligible} />
                  <Textarea placeholder="What they said about your products..." value={t.text} onChange={e => updateTestimonial(i, 'text', e.target.value)} rows={2} disabled={!isEligible} />
                  <div className="flex items-center gap-2 pt-1">
                    <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Rating:</Label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} type="button" onClick={() => updateTestimonial(i, 'rating', star)} disabled={!isEligible}>
                          <Star className={cn("w-5 h-5 transition-colors", star <= (t.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-700')} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              setFormData((prev: any) => ({
                ...prev,
                testimonials: [...prev.testimonials, { name: '', text: '', rating: 5, avatarUrl: '' }]
              }))
            }}
            className="w-full py-2.5 px-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-2"
            disabled={!isEligible}
          >
            <Plus className="w-4 h-4" /> Add Testimonial
          </button>
        </div>
      )}
    </Section>
  )
}
