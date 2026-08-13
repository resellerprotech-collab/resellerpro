'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Sparkles,
  Edit,
  Plus,
  Trash2,
  Check,
  Loader2,
  RefreshCw,
  IndianRupee,
  ShieldAlert,
  Zap,
  Tag
} from 'lucide-react'
import { toast } from '@/lib/toast'

export interface PlanData {
  id: string
  name: string
  display_name: string
  price: number
  offer_price: number | null
  order_limit: number | null
  tag_line: string | null
  features: string[]
  is_active: boolean
}

export function EkodrixPlanManager() {
  const [plans, setPlans] = useState<PlanData[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPlan, setEditingPlan] = useState<PlanData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Edit form state
  const [displayName, setDisplayName] = useState('')
  const [price, setPrice] = useState('')
  const [offerPrice, setOfferPrice] = useState('')
  const [orderLimit, setOrderLimit] = useState('')
  const [tagLine, setTagLine] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [featuresList, setFeaturesList] = useState<string[]>([])
  const [newFeatureText, setNewFeatureText] = useState('')

  const fetchPlans = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ekodrix-panel/plans')
      const result = await res.json()
      if (result.success) {
        setPlans(result.data || [])
      } else {
        toast.error('Failed to load subscription plans', { description: result.error })
      }
    } catch (err: any) {
      toast.error('Error loading plans', { description: err.message })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  const handleOpenEdit = (plan: PlanData) => {
    setEditingPlan(plan)
    setDisplayName(plan.display_name || plan.name)
    setPrice(plan.price.toString())
    setOfferPrice(plan.offer_price !== null && plan.offer_price !== undefined ? plan.offer_price.toString() : '')
    setOrderLimit(plan.order_limit !== null && plan.order_limit !== undefined ? plan.order_limit.toString() : '')
    setTagLine(plan.tag_line || '')
    setIsActive(plan.is_active !== false)
    setFeaturesList(Array.isArray(plan.features) ? [...plan.features] : [])
    setNewFeatureText('')
    setIsModalOpen(true)
  }

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return
    setFeaturesList(prev => [...prev, newFeatureText.trim()])
    setNewFeatureText('')
  }

  const handleRemoveFeature = (index: number) => {
    setFeaturesList(prev => prev.filter((_, i) => i !== index))
  }

  const handleSavePlan = async () => {
    if (!editingPlan) return

    if (!displayName.trim()) {
      toast.error('Display name is required')
      return
    }

    if (isNaN(Number(price))) {
      toast.error('Regular price must be a valid number')
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch('/api/ekodrix-panel/plans', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingPlan.id,
          display_name: displayName.trim(),
          price: Number(price),
          offer_price: offerPrice.trim() ? Number(offerPrice) : null,
          order_limit: orderLimit.trim() ? Number(orderLimit) : null,
          tag_line: tagLine.trim() || null,
          features: featuresList,
          is_active: isActive
        })
      })

      const result = await res.json()
      if (result.success) {
        toast.success('Plan Updated Successfully!', {
          description: `${displayName} prices & features updated dynamically across the entire app.`
        })
        setIsModalOpen(false)
        fetchPlans()
      } else {
        toast.error('Failed to update plan', { description: result.error })
      }
    } catch (err: any) {
      toast.error('Error saving plan', { description: err.message })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Dynamic Subscription Plans &amp; Pricing Manager
          </h2>
          <p className="text-xs text-gray-400">
            Changes made here update prices, offer discounts, limits &amp; bullet features dynamically across all databases and customer checkout pages.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchPlans}
          disabled={loading}
          className="border-white/10 bg-white/5 text-gray-300 hover:text-white rounded-xl text-xs h-9"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Plans
        </Button>
      </div>

      {/* Plans Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const hasOffer = plan.offer_price !== null && plan.offer_price !== undefined
            const effectivePrice = hasOffer ? plan.offer_price : plan.price

            return (
              <Card
                key={plan.id}
                className={`relative flex flex-col bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all rounded-2xl ${
                  !plan.is_active ? 'opacity-60' : ''
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px] font-black uppercase tracking-wider"
                    >
                      Internal Name: {plan.name}
                    </Badge>
                    <Badge
                      className={plan.is_active ? 'bg-emerald-500/20 text-emerald-400 border-none' : 'bg-red-500/20 text-red-400 border-none'}
                    >
                      {plan.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <CardTitle className="text-xl text-white font-bold flex items-center justify-between">
                    <span>{plan.display_name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 rounded-lg text-xs"
                      onClick={() => handleOpenEdit(plan)}
                    >
                      <Edit className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Button>
                  </CardTitle>

                  <CardDescription className="text-gray-400 text-xs">
                    {plan.tag_line || 'No tagline set'}
                  </CardDescription>

                  {/* Pricing Display */}
                  <div className="pt-3 flex items-baseline gap-2">
                    {hasOffer ? (
                      <>
                        <span className="text-2xl font-black text-white">₹{plan.offer_price}</span>
                        <span className="text-sm text-gray-500 line-through">₹{plan.price}</span>
                        <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                          Offer Live
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-black text-white">₹{plan.price}</span>
                    )}
                    <span className="text-xs text-gray-400">/ month</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-4 pt-0">
                  <div className="text-xs text-gray-400 flex items-center justify-between pt-2 border-t border-white/5">
                    <span>Order Limit:</span>
                    <span className="font-bold text-white">
                      {plan.order_limit ? `${plan.order_limit} Orders` : 'Unlimited'}
                    </span>
                  </div>

                  {/* Bullet Features */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Card Features List:</p>
                    <ul className="space-y-1.5 text-xs text-gray-300">
                      {Array.isArray(plan.features) && plan.features.length > 0 ? (
                        plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 italic text-[11px]">No feature points added yet</li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Edit Plan Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#0f172a] border border-white/10 text-white max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Tag className="w-5 h-5 text-emerald-400" />
              Edit Subscription Plan: {editingPlan?.display_name || editingPlan?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-400">
              Changes will dynamically update the subscription pricing cards, checkout amounts, and DB plan rules for all users instantly.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-bold text-gray-300">Display Name</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Professional Plan"
                className="mt-1 bg-white/5 border-white/10 text-white text-xs h-10 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold text-gray-300">Regular Price (₹) *</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 999"
                  className="mt-1 bg-white/5 border-white/10 text-white text-xs h-10 rounded-xl font-mono"
                />
                <p className="text-[10px] text-gray-500 mt-0.5">Original plan price</p>
              </div>

              <div>
                <Label className="text-xs font-bold text-gray-300">Offer Price (₹) (Optional)</Label>
                <Input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  placeholder="e.g. 499 (Leave empty for none)"
                  className="mt-1 bg-white/5 border-white/10 text-emerald-400 text-xs h-10 rounded-xl font-mono font-bold"
                />
                <p className="text-[10px] text-gray-500 mt-0.5">Discounted checkout amount</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold text-gray-300">Tagline / Subtitle</Label>
                <Input
                  value={tagLine}
                  onChange={(e) => setTagLine(e.target.value)}
                  placeholder="e.g. Most Popular for Resellers"
                  className="mt-1 bg-white/5 border-white/10 text-white text-xs h-10 rounded-xl"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-gray-300">Order Quota Limit</Label>
                <Input
                  type="number"
                  value={orderLimit}
                  onChange={(e) => setOrderLimit(e.target.value)}
                  placeholder="e.g. 100 (Leave empty = Unlimited)"
                  className="mt-1 bg-white/5 border-white/10 text-white text-xs h-10 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
              <div>
                <Label className="text-xs font-bold text-white">Active Plan Status</Label>
                <p className="text-[10px] text-gray-400">Allow users to view and subscribe to this plan</p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            {/* Bullet Points Feature Manager */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <Label className="text-xs font-bold text-gray-300">Bullet Features List (Shown on Cards)</Label>
              <div className="flex gap-2">
                <Input
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddFeature()
                    }
                  }}
                  placeholder="e.g. 1-Click WhatsApp Support"
                  className="bg-white/5 border-white/10 text-white text-xs h-9 rounded-xl flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddFeature}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-3 rounded-xl text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add
                </Button>
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto pt-1">
                {featuresList.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-200"
                  >
                    <span className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      {feat}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFeature(idx)}
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="border-white/10 bg-white/5 text-gray-300 hover:text-white rounded-xl text-xs h-10"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSavePlan}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs h-10 px-5"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
