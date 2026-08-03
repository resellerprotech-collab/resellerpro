'use client'

import { useState } from 'react'
import CmsSectionCard from '@/components/cms/CmsSectionCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { reorderCmsSectionsAction } from '@/app/actions/cms-sections'
import { toast } from 'sonner'
import { Layout, Save, RefreshCw, Sparkles, Layers, Eye } from 'lucide-react'
import type { CmsSectionItem } from '@/lib/services/cms/sections.service'

export default function CmsSectionEditorClient({
  initialSections,
  shopSlug
}: {
  initialSections: CmsSectionItem[]
  shopSlug: string
}) {
  const [sections, setSections] = useState<CmsSectionItem[]>(initialSections)
  const [savingOrder, setSavingOrder] = useState(false)

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newSections = [...sections]
    const temp = newSections[index]
    newSections[index] = newSections[index - 1]
    newSections[index - 1] = temp

    // Update sort_order numbers
    const reordered = newSections.map((sec, idx) => ({ ...sec, sort_order: idx + 1 }))
    setSections(reordered)
  }

  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return
    const newSections = [...sections]
    const temp = newSections[index]
    newSections[index] = newSections[index + 1]
    newSections[index + 1] = temp

    // Update sort_order numbers
    const reordered = newSections.map((sec, idx) => ({ ...sec, sort_order: idx + 1 }))
    setSections(reordered)
  }

  const handleUpdateSection = (updated: CmsSectionItem) => {
    setSections(prev => prev.map(s => s.section_type === updated.section_type ? updated : s))
  }

  const handleSaveOrder = async () => {
    setSavingOrder(true)
    const orderedTypes = sections.map(s => s.section_type)
    const res = await reorderCmsSectionsAction(orderedTypes)
    setSavingOrder(false)

    if (res.success) {
      toast.success('Section order saved successfully! ✨')
    } else {
      toast.error(res.error || 'Failed to save section order')
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview & Save Banner */}
      <Card className="border border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 via-background to-background shadow-sm">
        <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-600 text-white">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-foreground">Modular Content Sections</h2>
                <Badge variant="default" className="bg-indigo-600">CMS Active</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Reorder, enable, or disable homepage sections for both your store and Headless APIs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`/store/${shopSlug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border bg-background hover:bg-muted text-xs font-semibold transition-colors"
            >
              <Eye className="h-4 w-4" />
              Preview Storefront
            </a>
            <Button
              onClick={handleSaveOrder}
              disabled={savingOrder}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-2 shadow-sm shrink-0"
            >
              {savingOrder ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Section Order
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((sec, idx) => (
          <CmsSectionCard
            key={sec.section_type}
            section={sec}
            index={idx}
            total={sections.length}
            onMoveUp={() => handleMoveUp(idx)}
            onMoveDown={() => handleMoveDown(idx)}
            onUpdate={handleUpdateSection}
          />
        ))}
      </div>
    </div>
  )
}
