'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Shield, Truck, RotateCcw, Check, ExternalLink, Trash2, Plus, ListPlus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PolicyBlock } from '@/types'
import { Section } from './ShopSettingsHelpers'

interface PoliciesTabSectionProps {
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
  selectedPolicyKey: 'shipping' | 'returns' | 'privacy' | 'terms'
  setSelectedPolicyKey: React.Dispatch<React.SetStateAction<'shipping' | 'returns' | 'privacy' | 'terms'>>
  isPending: boolean
  isEligible: boolean
}

export default function PoliciesTabSection({
  formData,
  setFormData,
  selectedPolicyKey,
  setSelectedPolicyKey,
  isPending,
  isEligible,
}: PoliciesTabSectionProps) {

  const handleAddPolicyBlock = (pkey: string) => {
    const newBlock = {
      id: `pblk_${Date.now()}`,
      heading: 'New Policy Section',
      icon: 'shield',
      description: 'Enter your section description here...',
      points: [],
    }
    setFormData((prev: any) => ({
      ...prev,
      policyBlocks: {
        ...(prev.policyBlocks || {}),
        [pkey]: [...(prev.policyBlocks?.[pkey] || []), newBlock],
      }
    }))
  }

  const handleUpdatePolicyBlock = (pkey: string, blockId: string, updates: Partial<PolicyBlock>) => {
    setFormData((prev: any) => ({
      ...prev,
      policyBlocks: {
        ...(prev.policyBlocks || {}),
        [pkey]: (prev.policyBlocks?.[pkey] || []).map((b: PolicyBlock) => b.id === blockId ? { ...b, ...updates } : b),
      }
    }))
  }

  const handleDeletePolicyBlock = (pkey: string, blockId: string) => {
    setFormData((prev: any) => ({
      ...prev,
      policyBlocks: {
        ...(prev.policyBlocks || {}),
        [pkey]: (prev.policyBlocks?.[pkey] || []).filter((b: PolicyBlock) => b.id !== blockId),
      }
    }))
  }

  const handleAddPolicyPoint = (pkey: string, blockId: string) => {
    setFormData((prev: any) => ({
      ...prev,
      policyBlocks: {
        ...(prev.policyBlocks || {}),
        [pkey]: (prev.policyBlocks?.[pkey] || []).map((b: PolicyBlock) => {
          if (b.id !== blockId) return b
          return { ...b, points: [...(b.points || []), 'New policy point detail'] }
        }),
      }
    }))
  }

  const handleUpdatePolicyPoint = (pkey: string, blockId: string, idx: number, val: string) => {
    setFormData((prev: any) => ({
      ...prev,
      policyBlocks: {
        ...(prev.policyBlocks || {}),
        [pkey]: (prev.policyBlocks?.[pkey] || []).map((b: PolicyBlock) => {
          if (b.id !== blockId) return b
          const updatedPoints = [...(b.points || [])]
          updatedPoints[idx] = val
          return { ...b, points: updatedPoints }
        }),
      }
    }))
  }

  const handleDeletePolicyPoint = (pkey: string, blockId: string, idx: number) => {
    setFormData((prev: any) => ({
      ...prev,
      policyBlocks: {
        ...(prev.policyBlocks || {}),
        [pkey]: (prev.policyBlocks?.[pkey] || []).map((b: PolicyBlock) => {
          if (b.id !== blockId) return b
          return { ...b, points: (b.points || []).filter((_, i) => i !== idx) }
        }),
      }
    }))
  }

  const renderPolicySectionManager = (pkey: 'shipping' | 'returns' | 'privacy' | 'terms') => {
    const blocks: PolicyBlock[] = formData.policyBlocks?.[pkey] || []
    const routesMap = {
      shipping: '/shipping-policy',
      returns: '/return-policy',
      privacy: '/privacy-policy',
      terms: '/terms',
    }
    const titlesMap = {
      shipping: 'Shipping & Delivery Policy Page',
      returns: 'Return & Refund Policy Page',
      privacy: 'Privacy Policy Page',
      terms: 'Terms & Conditions Page',
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 block">
              {titlesMap[pkey]}
            </span>
            <p className="text-[11px] text-slate-500">
              Add headings, subheadings, descriptions, and bullet points. Edit or delete any section.
            </p>
          </div>
          <a
            href={`/store/${formData.shop_slug}${routesMap[pkey]}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            View Live Page <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Section Blocks List */}
        <div className="space-y-4">
          {blocks.map((block: PolicyBlock, idx: number) => (
            <div
              key={block.id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <div className="flex items-center gap-2 flex-1">
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <select
                    value={block.icon || 'shield'}
                    onChange={(e) => handleUpdatePolicyBlock(pkey, block.id, { icon: e.target.value })}
                    className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300"
                  >
                    <option value="truck">🚚 Truck</option>
                    <option value="rotate">🔄 Return</option>
                    <option value="shield">🛡️ Shield</option>
                    <option value="clock">⏰ Clock</option>
                    <option value="check">✅ Check</option>
                    <option value="lock">🔒 Lock</option>
                    <option value="file">📄 Document</option>
                  </select>
                  <Input
                    value={block.heading}
                    onChange={(e) => handleUpdatePolicyBlock(pkey, block.id, { heading: e.target.value })}
                    placeholder="Section Heading Title..."
                    className="text-xs font-bold h-9"
                    disabled={isPending || !isEligible}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeletePolicyBlock(pkey, block.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-8 px-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Subheading (Optional) */}
              <div>
                <Label className="text-[11px] font-semibold text-slate-500 mb-1 block">Subheading (Optional)</Label>
                <Input
                  value={block.subheading || ''}
                  onChange={(e) => handleUpdatePolicyBlock(pkey, block.id, { subheading: e.target.value })}
                  placeholder="e.g. 100% Verified & Hassle-Free"
                  className="text-xs h-8"
                  disabled={isPending || !isEligible}
                />
              </div>

              {/* Description Paragraph */}
              <div>
                <Label className="text-[11px] font-semibold text-slate-500 mb-1 block">Description Paragraph</Label>
                <Textarea
                  value={block.description || ''}
                  onChange={(e) => handleUpdatePolicyBlock(pkey, block.id, { description: e.target.value })}
                  placeholder="Write section explanation text..."
                  rows={2}
                  className="text-xs"
                  disabled={isPending || !isEligible}
                />
              </div>

              {/* Bullet Points */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Bullet Points / List Items</Label>
                  <button
                    type="button"
                    onClick={() => handleAddPolicyPoint(pkey, block.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <ListPlus className="w-3.5 h-3.5" /> Add Point
                  </button>
                </div>
                {(block.points || []).map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">•</span>
                    <Input
                      value={pt}
                      onChange={(e) => handleUpdatePolicyPoint(pkey, block.id, pIdx, e.target.value)}
                      placeholder={`Point #${pIdx + 1}...`}
                      className="text-xs h-8 flex-1"
                      disabled={isPending || !isEligible}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeletePolicyPoint(pkey, block.id, pIdx)}
                      className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add New Section Button */}
        <Button
          type="button"
          onClick={() => handleAddPolicyBlock(pkey)}
          variant="outline"
          className="w-full py-2.5 border-dashed border-2 border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add New Policy Section
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Section icon={Shield} title="Customer Store Policies" pro={!isEligible}>
        <p className="text-xs text-slate-500 mb-4">
          Customize policy sections for each legal page on your online store. Select a policy page below to add headings, subheadings, descriptions, and bullet points.
        </p>

        {/* Policy Page Selector Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { key: 'shipping', label: 'Shipping & Delivery', icon: Truck },
            { key: 'returns', label: 'Return & Refund', icon: RotateCcw },
            { key: 'privacy', label: 'Privacy Policy', icon: Shield },
            { key: 'terms', label: 'Terms & Conditions', icon: Check },
          ].map((item) => {
            const isSelected = selectedPolicyKey === item.key
            const Icon = item.icon
            return (
              <button
                key={item.key}
                type="button"
                disabled={!isEligible}
                onClick={() => setSelectedPolicyKey(item.key as any)}
                className={cn(
                  "p-3.5 rounded-xl border-2 flex flex-col items-center gap-2 text-center transition-all cursor-pointer",
                  isSelected
                    ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                )}
              >
                <Icon className={cn("w-5 h-5", isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400")} />
                <span className="text-xs font-bold leading-tight">{item.label}</span>
              </button>
            )
          })}
        </div>

        {/* Render Section Block Manager */}
        {renderPolicySectionManager(selectedPolicyKey)}
      </Section>
    </div>
  )
}
