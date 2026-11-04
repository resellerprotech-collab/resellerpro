'use client'

import React, { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Save, Loader2, AlertTriangle, Plus } from 'lucide-react'
import { deleteProductVariantAction, updateProductVariantAction, addProductVariantAction } from '@/app/(dashboard)/products/actions'
import { toast } from '@/lib/toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface VariantMatrixManagerProps {
  productId: string
  options: any[]
  variants: any[]
}

export default function VariantMatrixManager({ productId, options: initialOptions, variants: initialVariants }: VariantMatrixManagerProps) {
  const [variants, setVariants] = useState<any[]>(initialVariants)
  const [options, setOptions] = useState<any[]>(initialOptions)
  const [editingRows, setEditingRows] = useState<Record<string, { selling_price: number; cost_price: number; stock_quantity: number; sku: string }>>({})
  const [loadingRowId, setLoadingRowId] = useState<string | null>(null)
  const [deletingRowId, setDeletingRowId] = useState<string | null>(null)
  const [variantToDelete, setVariantToDelete] = useState<any | null>(null)
  const [addingTitle, setAddingTitle] = useState<string | null>(null)

  // Compute missing/unlaunched cartesian combinations
  const missingCombinations = useMemo(() => {
    if (!options || options.length === 0) return []

    const validOptions = options.filter(o => o.name && o.values && o.values.length > 0)
    if (validOptions.length === 0) return []

    const cartesian = (acc: Record<string, string>[], optionIdx: number): Record<string, string>[] => {
      if (optionIdx >= validOptions.length) return acc
      const currentOpt = validOptions[optionIdx]
      const nextAcc: Record<string, string>[] = []

      for (const val of currentOpt.values) {
        if (acc.length === 0) {
          nextAcc.push({ [currentOpt.name]: val })
        } else {
          for (const item of acc) {
            nextAcc.push({ ...item, [currentOpt.name]: val })
          }
        }
      }

      return cartesian(nextAcc, optionIdx + 1)
    }

    const allCombs = cartesian([], 0)

    // Filter out combinations that ALREADY exist in active variants
    return allCombs.filter(comb => {
      const title = Object.values(comb).join(' / ')
      return !variants.some(v => v.title === title)
    }).map(comb => ({
      title: Object.values(comb).join(' / '),
      option_values: comb,
    }))
  }, [options, variants])

  // Handle row field changes
  const handleFieldChange = (variantId: string, field: string, value: any, currentVariant: any) => {
    setEditingRows(prev => {
      const existing = prev[variantId] || {
        selling_price: currentVariant.selling_price || 0,
        cost_price: currentVariant.cost_price || 0,
        stock_quantity: currentVariant.stock_quantity || 0,
        sku: currentVariant.sku || '',
      }
      return {
        ...prev,
        [variantId]: {
          ...existing,
          [field]: value,
        },
      }
    })
  }

  const handleSaveVariant = async (variant: any) => {
    const editData = editingRows[variant.id]
    if (!editData) return

    setLoadingRowId(variant.id)
    try {
      const res = await updateProductVariantAction(variant.id, productId, editData)
      if (res.success) {
        toast.success(`Updated ${variant.title}`)
        setVariants(prev =>
          prev.map(v => (v.id === variant.id ? { ...v, ...editData } : v))
        )
        setEditingRows(prev => {
          const next = { ...prev }
          delete next[variant.id]
          return next
        })
      } else {
        toast.error(res.message || 'Failed to update variant')
      }
    } catch (err: any) {
      toast.error(err.message || 'Error updating variant')
    } finally {
      setLoadingRowId(null)
    }
  }

  const confirmDeleteVariant = async () => {
    if (!variantToDelete) return

    const variant = variantToDelete
    setDeletingRowId(variant.id)
    setVariantToDelete(null)

    try {
      const res = await deleteProductVariantAction(variant.id, productId)
      if (res.success) {
        toast.success(`Deleted combination "${variant.title}"`)
        setVariants(prev => prev.filter(v => v.id !== variant.id))
      } else {
        toast.error(res.message || 'Failed to delete variant')
      }
    } catch (err: any) {
      toast.error(err.message || 'Error deleting variant')
    } finally {
      setDeletingRowId(null)
    }
  }

  const handleAddMissingCombination = async (comb: { title: string; option_values: Record<string, string> }) => {
    setAddingTitle(comb.title)
    try {
      const res = await addProductVariantAction(productId, {
        title: comb.title,
        option_values: comb.option_values,
        stock_quantity: 10,
      })
      if (res.success) {
        toast.success(`Added combination "${comb.title}"`)
        window.location.reload()
      } else {
        toast.error(res.message || 'Failed to add variant combination')
      }
    } catch (err: any) {
      toast.error(err.message || 'Error adding variant combination')
    } finally {
      setAddingTitle(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Custom Confirmation Dialog for Deleting Variant */}
      <AlertDialog open={!!variantToDelete} onOpenChange={open => !open && setVariantToDelete(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-100 dark:bg-red-950/60 text-red-600 rounded-full shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <AlertDialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                  Delete Variant Combination?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Are you sure you want to delete <strong className="text-slate-800 dark:text-slate-200">"{variantToDelete?.title}"</strong>? It will be permanently removed from your catalog and will no longer appear on your store.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
            <AlertDialogCancel className="text-xs font-semibold">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteVariant}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
            >
              Yes, Delete Variant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Product Options Summary */}
      {options.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Product Options</h3>
          <div className="flex flex-wrap gap-4">
            {options.map((opt: any) => (
              <div key={opt.id || opt.name} className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 min-w-[140px]">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{opt.name}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(opt.values || []).map((val: string) => (
                    <Badge key={val} variant="secondary" className="text-xs font-semibold px-2 py-0.5">
                      {val}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Variant Combination Matrix Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Variant Combination Matrix ({variants.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Edit stock/prices or delete combinations that were never launched
          </p>
        </div>

        {variants.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-sm text-slate-500">
            No active variant combinations. All variants deleted or turned off.
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3">Variant Combination</th>
                  <th className="p-3 w-32">Selling Price (₹)</th>
                  <th className="p-3 w-32">Cost Price (₹)</th>
                  <th className="p-3 w-28">Stock Qty</th>
                  <th className="p-3 w-32">SKU Code</th>
                  <th className="p-3 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {variants.map((v: any) => {
                  const edited = editingRows[v.id]
                  const sellingPrice = edited?.selling_price !== undefined ? edited.selling_price : v.selling_price || 0
                  const costPrice = edited?.cost_price !== undefined ? edited.cost_price : v.cost_price || 0
                  const stockQuantity = edited?.stock_quantity !== undefined ? edited.stock_quantity : v.stock_quantity || 0
                  const sku = edited?.sku !== undefined ? edited.sku : v.sku || ''
                  const isDirty = edited !== undefined

                  const isLoading = loadingRowId === v.id
                  const isDeleting = deletingRowId === v.id

                  return (
                    <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">
                        <span className="inline-block px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs">
                          {v.title}
                        </span>
                      </td>

                      {/* Selling Price */}
                      <td className="p-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={sellingPrice}
                          onChange={e => handleFieldChange(v.id, 'selling_price', parseFloat(e.target.value) || 0, v)}
                          className="h-8 text-xs font-semibold"
                        />
                      </td>

                      {/* Cost Price */}
                      <td className="p-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={costPrice}
                          onChange={e => handleFieldChange(v.id, 'cost_price', parseFloat(e.target.value) || 0, v)}
                          className="h-8 text-xs text-slate-600"
                        />
                      </td>

                      {/* Stock Quantity */}
                      <td className="p-2">
                        <Input
                          type="number"
                          min="0"
                          value={stockQuantity}
                          onChange={e => handleFieldChange(v.id, 'stock_quantity', parseInt(e.target.value, 10) || 0, v)}
                          className={`h-8 text-xs font-bold ${stockQuantity > 0 ? 'border-green-300 text-green-700' : 'border-red-300 text-red-700'}`}
                        />
                      </td>

                      {/* SKU */}
                      <td className="p-2">
                        <Input
                          type="text"
                          placeholder="SKU"
                          value={sku}
                          onChange={e => handleFieldChange(v.id, 'sku', e.target.value, v)}
                          className="h-8 text-xs font-mono"
                        />
                      </td>

                      {/* Actions */}
                      <td className="p-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {isDirty && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleSaveVariant(v)}
                              disabled={isLoading}
                              className="h-8 px-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                              title="Save changes to this variant"
                            >
                              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setVariantToDelete(v)}
                            disabled={isDeleting}
                            className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                            title="Delete this variant combination"
                          >
                            {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Missing / Unlaunched Combinations Restore Section */}
      {missingCombinations.length > 0 && (
        <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl space-y-3 text-xs">
          <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-300">
            <span>Missing / Unlaunched Combinations ({missingCombinations.length})</span>
            <span className="text-[11px] font-normal text-amber-700 dark:text-amber-400">
              Click + Add to launch any deleted combination on your store
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingCombinations.map(comb => {
              const isAdding = addingTitle === comb.title
              return (
                <button
                  key={comb.title}
                  type="button"
                  onClick={() => handleAddMissingCombination(comb)}
                  disabled={isAdding}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 rounded-lg text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors shadow-sm disabled:opacity-50"
                  title="Click to launch this combination in your store"
                >
                  {isAdding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5 text-amber-600" />}
                  <span>+ Launch {comb.title}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
