'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  GripVertical, ChevronDown, ChevronUp, Eye, EyeOff, Sparkles,
  Layout, PanelTop, Grid, Star, MessageSquare, Shield, Mail, RefreshCw, Check, Upload
} from 'lucide-react'
import { updateCmsSectionAction, reorderCmsSectionsAction } from '@/app/actions/cms-sections'
import { toast } from 'sonner'
import type { CmsSectionItem } from '@/lib/services/cms/sections.service'

interface CmsSectionCardProps {
  section: CmsSectionItem
  index: number
  total: number
  onMoveUp: () => void
  onMoveDown: () => void
  onUpdate: (updatedSection: CmsSectionItem) => void
}

export default function CmsSectionCard({
  section,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onUpdate
}: CmsSectionCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [enabled, setEnabled] = useState(section.is_enabled)
  const [content, setContent] = useState(section.content || {})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleToggle = async (checked: boolean) => {
    setEnabled(checked)
    const updated = { ...section, is_enabled: checked }
    onUpdate(updated)

    const res = await updateCmsSectionAction(section.section_type, { is_enabled: checked })
    if (res.success) {
      toast.success(`${section.label} ${checked ? 'enabled' : 'disabled'}`)
    } else {
      setEnabled(!checked)
      toast.error(res.error || 'Failed to update section state')
    }
  }

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await updateCmsSectionAction(section.section_type, { content })
    setSaving(false)

    if (res.success) {
      toast.success(`${section.label} content saved ✨`)
      onUpdate({ ...section, content })
      setExpanded(false)
    } else {
      toast.error(res.error || 'Failed to save section content')
    }
  }

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'hero': return <PanelTop className="h-5 w-5 text-indigo-500" />
      case 'categories': return <Grid className="h-5 w-5 text-emerald-500" />
      case 'featured_products':
      case 'best_sellers': return <Star className="h-5 w-5 text-amber-500" />
      case 'promotional_banner':
      case 'offer_strip': return <Sparkles className="h-5 w-5 text-purple-500" />
      case 'testimonials': return <MessageSquare className="h-5 w-5 text-blue-500" />
      case 'why_choose_us': return <Shield className="h-5 w-5 text-cyan-500" />
      case 'newsletter': return <Mail className="h-5 w-5 text-rose-500" />
      default: return <Layout className="h-5 w-5 text-slate-500" />
    }
  }

  return (
    <Card className={`border shadow-sm transition-all duration-200 ${enabled ? 'bg-card' : 'bg-muted/40 opacity-75'}`}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          {/* Reorder controls & Icon */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={onMoveUp}
                disabled={index === 0}
                className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                title="Move section up"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onMoveDown}
                disabled={index === total - 1}
                className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                title="Move section down"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-muted/60 border">
              {getSectionIcon(section.section_type)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-foreground">{section.label}</h3>
                <Badge variant={enabled ? "default" : "secondary"} className="text-[10px] uppercase font-bold tracking-wider">
                  {enabled ? 'Active' : 'Hidden'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Position #{index + 1} • {section.section_type} section
              </p>
            </div>
          </div>

          {/* Right Actions: Enable Switch & Expand Editor */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor={`switch-${section.section_type}`} className="text-xs text-muted-foreground hidden sm:inline-block">
                {enabled ? 'Visible' : 'Hidden'}
              </Label>
              <Switch
                id={`switch-${section.section_type}`}
                checked={enabled}
                onCheckedChange={handleToggle}
              />
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="gap-1.5 text-xs font-semibold"
            >
              {expanded ? 'Close' : 'Edit Content'}
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>

        {/* Expandable Section Content Form Editor */}
        {expanded && (
          <form onSubmit={handleSaveContent} className="mt-5 pt-4 border-t space-y-4 animate-in fade-in-50 duration-200">
            {section.section_type === 'hero' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Hero Title</Label>
                    <Input
                      value={content.heroTitle || ''}
                      onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                      placeholder="e.g. Premium Quality. Timeless Style."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Hero Subtitle</Label>
                    <Input
                      value={content.heroSubtitle || ''}
                      onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                      placeholder="e.g. Discover our curated collection."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Primary CTA Button Text</Label>
                    <Input
                      value={content.heroCtaText || ''}
                      onChange={(e) => setContent({ ...content, heroCtaText: e.target.value })}
                      placeholder="Shop Now"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Primary CTA Link</Label>
                    <Input
                      value={content.heroCtaLink || ''}
                      onChange={(e) => setContent({ ...content, heroCtaLink: e.target.value })}
                      placeholder="#products or /shop"
                    />
                  </div>
                </div>

                {/* Hero Showcase Images Upload */}
                <div className="space-y-2 pt-2 border-t">
                  <Label className="text-xs font-semibold flex items-center justify-between">
                    <span>Hero Showcase Image</span>
                    {uploading && <span className="text-[10px] text-indigo-600 animate-pulse font-medium">Uploading image...</span>}
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      value={content.heroImageUrl || (content.heroImages?.[0] || '')}
                      onChange={(e) => setContent({ ...content, heroImageUrl: e.target.value, heroImages: [e.target.value] })}
                      placeholder="https://... or upload file"
                    />
                    <label className="cursor-pointer shrink-0">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setUploading(true)
                          try {
                            const { createClient } = await import('@/lib/supabase/client')
                            const supabase = createClient()
                            const fileExt = file.name.split('.').pop()
                            const fileName = `cms-hero-${Date.now()}.${fileExt}`
                            const filePath = `cms/${fileName}`
                            const { error } = await supabase.storage.from('product-images').upload(filePath, file, { upsert: true })
                            if (error) throw error
                            const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filePath)
                            const publicUrl = urlData.publicUrl
                            setContent(prev => ({ ...prev, heroImageUrl: publicUrl, heroImages: [publicUrl] }))
                            toast.success('Hero image uploaded! ✨')
                          } catch (err: any) {
                            toast.error(err.message || 'Image upload failed')
                          } finally {
                            setUploading(false)
                          }
                        }}
                      />
                      <div className="px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold border border-indigo-200 flex items-center gap-1.5 transition-colors">
                        <Upload className="h-3.5 w-3.5" />
                        Upload
                      </div>
                    </label>
                  </div>
                  {(content.heroImageUrl || content.heroImages?.[0]) && (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border bg-muted mt-2">
                      <img src={content.heroImageUrl || content.heroImages?.[0]} alt="Hero preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {section.section_type === 'promotional_banner' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold flex items-center justify-between">
                    <span>Promotional Full Banner Image</span>
                    {uploading && <span className="text-[10px] text-indigo-600 animate-pulse font-medium">Uploading...</span>}
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      value={content.promoFullBanner?.imageUrl || ''}
                      onChange={(e) => setContent({
                        ...content,
                        promoFullBanner: { ...(content.promoFullBanner || {}), imageUrl: e.target.value }
                      })}
                      placeholder="Banner Image URL or Upload"
                    />
                    <label className="cursor-pointer shrink-0">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setUploading(true)
                          try {
                            const { createClient } = await import('@/lib/supabase/client')
                            const supabase = createClient()
                            const fileExt = file.name.split('.').pop()
                            const fileName = `cms-promo-${Date.now()}.${fileExt}`
                            const filePath = `cms/${fileName}`
                            const { error } = await supabase.storage.from('product-images').upload(filePath, file, { upsert: true })
                            if (error) throw error
                            const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filePath)
                            const publicUrl = urlData.publicUrl
                            setContent(prev => ({
                              ...prev,
                              promoFullBanner: { ...(prev.promoFullBanner || {}), imageUrl: publicUrl }
                            }))
                            toast.success('Promotional banner uploaded! ✨')
                          } catch (err: any) {
                            toast.error(err.message || 'Upload failed')
                          } finally {
                            setUploading(false)
                          }
                        }}
                      />
                      <div className="px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold border border-indigo-200 flex items-center gap-1.5 transition-colors">
                        <Upload className="h-3.5 w-3.5" />
                        Upload
                      </div>
                    </label>
                  </div>
                  {content.promoFullBanner?.imageUrl && (
                    <div className="relative h-28 w-full rounded-xl overflow-hidden border bg-muted mt-2">
                      <img src={content.promoFullBanner.imageUrl} alt="Promo preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {section.section_type === 'offer_strip' && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Offer Banner Message</Label>
                  <Input
                    value={content.bannerText || ''}
                    onChange={(e) => setContent({ ...content, bannerText: e.target.value })}
                    placeholder="Limited Time Offer: Get 10% OFF on Orders Above ₹1,499"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Promo Code (Optional)</Label>
                  <Input
                    value={content.promoCode || ''}
                    onChange={(e) => setContent({ ...content, promoCode: e.target.value })}
                    placeholder="SAVE10"
                  />
                </div>
              </div>
            )}

            {(section.section_type === 'featured_products' || section.section_type === 'best_sellers') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Section Heading</Label>
                  <Input
                    value={content.title || ''}
                    onChange={(e) => setContent({ ...content, title: e.target.value })}
                    placeholder="Section Title"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Section Subtitle / Badge</Label>
                  <Input
                    value={content.subtitle || ''}
                    onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                    placeholder="Section Tagline"
                  />
                </div>
              </div>
            )}

            {section.section_type === 'newsletter' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Newsletter Title</Label>
                  <Input
                    value={content.title || ''}
                    onChange={(e) => setContent({ ...content, title: e.target.value })}
                    placeholder="Join Our VIP Circle"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Newsletter Subtitle</Label>
                  <Input
                    value={content.subtitle || ''}
                    onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                    placeholder="Subscribe to get exclusive discount codes & alerts."
                  />
                </div>
              </div>
            )}

            {!['hero', 'offer_strip', 'featured_products', 'best_sellers', 'newsletter'].includes(section.section_type) && (
              <div className="p-3 rounded-lg bg-muted/40 text-xs text-muted-foreground">
                This section manages dynamic store items (e.g. products, categories, trust badges) directly from your store configuration settings.
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setExpanded(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5">
                {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
