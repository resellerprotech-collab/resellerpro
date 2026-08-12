'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Shield, Trash2, Star, Plus, Upload, Loader2, Truck, RotateCcw,
  HeartHandshake, Check
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Section, ToggleRow } from './ShopSettingsHelpers'

interface TrustBadgesSectionProps {
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleToggle: (name: string, val: boolean) => void
  updateTrustBadgeItem: (badgeId: string, field: string, value: string) => void
  handleBadgeIconUpload: (e: React.ChangeEvent<HTMLInputElement>, badgeId: string) => Promise<void>
  uploadingField: string | null
  isPending: boolean
  isEligible: boolean
}

export default function TrustBadgesSection({
  formData,
  setFormData,
  handleChange,
  handleToggle,
  updateTrustBadgeItem,
  handleBadgeIconUpload,
  uploadingField,
  isPending,
  isEligible,
}: TrustBadgesSectionProps) {
  const currentBadgeCount = (formData.trustBadges || []).length
  const isMaxBadgesReached = currentBadgeCount >= 4

  return (
    <Section icon={Shield} title="Trust Badges" pro={!isEligible}>
      <ToggleRow label="Show Trust Badges" description="Display trust indicators below products" checked={formData.trustBadgesEnabled} onChange={v => handleToggle('trustBadgesEnabled', v)} disabled={!isEligible} />
      {formData.trustBadgesEnabled && (
        <div className="space-y-5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Section Heading & Subheading */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
            <div>
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Section Heading</Label>
              <Input
                name="trustBadgesHeading"
                placeholder="Built for Your Peace of Mind"
                value={formData.trustBadgesHeading || ''}
                onChange={handleChange}
                disabled={!isEligible || isPending}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Section Subheading</Label>
              <Input
                name="trustBadgesSubheading"
                placeholder="Trusted by 5,000+ businesses and individuals worldwide"
                value={formData.trustBadgesSubheading || ''}
                onChange={handleChange}
                disabled={!isEligible || isPending}
              />
            </div>
          </div>

          {/* Badge Items List */}
          <div className="space-y-3">
            {formData.trustBadges.map((badgeId: string, idx: number) => {
              const badgePresets: Record<string, { label: string; icon: any }> = {
                secure_payment: { label: 'Secure Payment', icon: Shield },
                fast_delivery: { label: 'Fast Delivery', icon: Truck },
                easy_returns: { label: 'Easy Returns', icon: RotateCcw },
                quality: { label: 'Quality Assured', icon: Star },
                support: { label: '24/7 Support', icon: HeartHandshake },
                authentic: { label: '100% Authentic', icon: Check },
              }
              const preset = badgePresets[badgeId]
              const customItem = formData.trustBadgeItems?.[badgeId] || {}
              const badgeTitle = customItem.title !== undefined ? customItem.title : (preset?.label || `Badge ${idx + 1}`)
              const IconComp = preset?.icon || Shield

              return (
                <div key={badgeId} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-start sm:items-end gap-3">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 flex items-center justify-center shrink-0 self-end mb-[1px]">
                      {customItem.iconUrl ? (
                        <img src={customItem.iconUrl} alt={badgeTitle} className="w-full h-full object-cover" />
                      ) : (
                        <IconComp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <Label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Badge Name</Label>
                        <Input
                          value={badgeTitle}
                          onChange={(e) => updateTrustBadgeItem(badgeId, 'title', e.target.value)}
                          placeholder="e.g. Fast Shipping"
                          disabled={isPending || !isEligible}
                          className="h-8 text-xs bg-white dark:bg-slate-950"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Description (Optional)</Label>
                        <Input
                          value={customItem.description || ''}
                          onChange={(e) => updateTrustBadgeItem(badgeId, 'description', e.target.value)}
                          placeholder="e.g. 24-48 hr dispatch"
                          disabled={isPending || !isEligible}
                          className="h-8 text-xs bg-white dark:bg-slate-950"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end mb-[1px]">
                      <label
                        htmlFor={`badge_file_${badgeId}`}
                        className={cn(
                          "h-8 px-3 inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap",
                          (!isEligible || uploadingField !== null) && "opacity-50 pointer-events-none"
                        )}
                      >
                        {uploadingField === `badge_${badgeId}` ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        Upload Image
                      </label>
                      <input
                        id={`badge_file_${badgeId}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleBadgeIconUpload(e, badgeId)}
                        className="hidden"
                        disabled={!isEligible || uploadingField !== null}
                      />

                      <button
                        type="button"
                        title="Remove Badge"
                        onClick={() => {
                          setFormData((p: any) => ({
                            ...p,
                            trustBadges: p.trustBadges.filter((id: string) => id !== badgeId)
                          }))
                        }}
                        className="h-8 w-8 inline-flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Add Badge Button (Max 4 Limit) */}
            <button
              type="button"
              onClick={() => {
                if (isMaxBadgesReached) return
                const newBadgeId = `badge-${Date.now()}`
                setFormData((p: any) => ({
                  ...p,
                  trustBadges: [...p.trustBadges, newBadgeId].slice(0, 4),
                  trustBadgeItems: {
                    ...(p.trustBadgeItems || {}),
                    [newBadgeId]: { title: 'New Badge', description: '', iconUrl: '' }
                  }
                }))
              }}
              disabled={!isEligible || isMaxBadgesReached}
              className={cn(
                "w-full py-2.5 px-4 border-2 border-dashed rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                isMaxBadgesReached
                  ? "border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 bg-slate-50/50 dark:bg-slate-900/30 cursor-not-allowed"
                  : "border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 text-slate-600 dark:text-slate-400 hover:text-indigo-600"
              )}
            >
              <Plus className="w-4 h-4" />
              {isMaxBadgesReached ? `Maximum 4 Badges Allowed (${currentBadgeCount}/4)` : `Add New Badge (${currentBadgeCount}/4)`}
            </button>
          </div>
        </div>
      )}
    </Section>
  )
}
