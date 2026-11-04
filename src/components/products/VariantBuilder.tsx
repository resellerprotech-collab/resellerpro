'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Layers, Tag } from 'lucide-react'

export interface OptionDraft {
  name: string
  valuesText: string // comma-separated, e.g. "S, M, L, XL"
}

export interface VariantDraft {
  id?: string
  title: string
  option_values: Record<string, string>
  cost_price: number
  selling_price: number
  compare_at_price?: number | null
  stock_quantity: number
  sku: string
}

interface VariantBuilderProps {
  initialHasVariants?: boolean
  initialOptions?: Array<{ name: string; values: string[] }>
  initialVariants?: VariantDraft[]
  defaultCostPrice?: number
  defaultSellingPrice?: number
  onChange?: (data: {
    hasVariants: boolean
    optionsJson: string
    variantsJson: string
  }) => void
}

export function VariantBuilder({
  initialHasVariants = false,
  initialOptions = [],
  initialVariants = [],
  defaultCostPrice = 0,
  defaultSellingPrice = 0,
  onChange,
}: VariantBuilderProps) {
  const [hasVariants, setHasVariants] = useState<boolean>(initialHasVariants)

  const [options, setOptions] = useState<OptionDraft[]>(() => {
    if (initialOptions.length > 0) {
      return initialOptions.map(o => ({
        name: o.name,
        valuesText: (o.values || []).join(', '),
      }))
    }
    return [{ name: 'Size', valuesText: 'S, M, L, XL' }]
  })

  const [variants, setVariants] = useState<VariantDraft[]>(initialVariants)
  const [excludedTitles, setExcludedTitles] = useState<Set<string>>(new Set())

  // Suggestion chips for quick category setups
  const PRESET_OPTIONS = [
    { label: '+ Clothing (Size & Color)', options: [{ name: 'Size', valuesText: 'S, M, L, XL' }, { name: 'Color', valuesText: 'Black, White, Blue' }] },
    { label: '+ Shoes (Footwear Size)', options: [{ name: 'Size', valuesText: 'UK 7, UK 8, UK 9, UK 10' }] },
    { label: '+ Food/Bakery (Weight)', options: [{ name: 'Weight', valuesText: '250g, 500g, 1kg' }] },
    { label: '+ Tech (Storage)', options: [{ name: 'Storage', valuesText: '64GB, 128GB, 256GB' }] },
  ]

  // Generate Cartesian Product of Option Values
  const generateVariants = () => {
    const validOptions = options
      .map(o => ({
        name: o.name.trim(),
        values: o.valuesText
          .split(',')
          .map(v => v.trim())
          .filter(Boolean),
      }))
      .filter(o => o.name && o.values.length > 0)

    if (validOptions.length === 0) {
      setVariants([])
      return
    }

    // Cartesian product helper
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

    const combinations = cartesian([], 0)

    // Map combinations to VariantDraft array preserving existing custom prices/stock if present
    const updatedVariants: VariantDraft[] = combinations
      .map(comb => {
        const title = Object.values(comb).join(' / ')
        if (excludedTitles.has(title)) {
          return null
        }

        const existing = variants.find(v => v.title === title)

        if (existing) {
          return {
            ...existing,
            option_values: comb,
          }
        }

        return {
          title,
          option_values: comb,
          cost_price: defaultCostPrice || 0,
          selling_price: defaultSellingPrice || 0,
          compare_at_price: null,
          stock_quantity: 10,
          sku: '',
        }
      })
      .filter(Boolean) as VariantDraft[]

    setVariants(updatedVariants)
  }

  const onChangeRef = React.useRef(onChange)
  React.useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Update parent form whenever options/variants change
  useEffect(() => {
    if (!onChangeRef.current) return

    if (!hasVariants) {
      onChangeRef.current({
        hasVariants: false,
        optionsJson: '[]',
        variantsJson: '[]',
      })
      return
    }

    const formattedOptions = options
      .map(o => ({
        name: o.name.trim(),
        values: o.valuesText
          .split(',')
          .map(v => v.trim())
          .filter(Boolean),
      }))
      .filter(o => o.name && o.values.length > 0)

    onChangeRef.current({
      hasVariants: true,
      optionsJson: JSON.stringify(formattedOptions),
      variantsJson: JSON.stringify(variants),
    })
  }, [hasVariants, options, variants])

  const addOption = () => {
    setOptions(prev => [...prev, { name: '', valuesText: '' }])
  }

  const removeOption = (index: number) => {
    setOptions(prev => prev.filter((_, i) => i !== index))
  }

  const updateOption = (index: number, field: 'name' | 'valuesText', value: string) => {
    setOptions(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const updateVariant = (index: number, field: keyof VariantDraft, value: any) => {
    setVariants(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const removeVariantRow = (index: number) => {
    const target = variants[index]
    if (target?.title) {
      setExcludedTitles(prev => {
        const next = new Set(prev)
        next.add(target.title)
        return next
      })
    }
    setVariants(prev => prev.filter((_, i) => i !== index))
  }

  const restoreVariantTitle = (title: string) => {
    setExcludedTitles(prev => {
      const next = new Set(prev)
      next.delete(title)
      return next
    })
  }

  const applyPreset = (preset: typeof PRESET_OPTIONS[0]) => {
    setOptions(preset.options)
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm space-y-5">
      {/* Hidden inputs to support traditional HTML form submission */}
      <input type="hidden" name="has_variants" value={hasVariants ? 'true' : 'false'} />
      <input
        type="hidden"
        name="options_json"
        value={
          hasVariants
            ? JSON.stringify(
                options
                  .map(o => ({
                    name: o.name.trim(),
                    values: o.valuesText
                      .split(',')
                      .map(v => v.trim())
                      .filter(Boolean),
                  }))
                  .filter(o => o.name && o.values.length > 0)
              )
            : '[]'
        }
      />
      <input type="hidden" name="variants_json" value={hasVariants ? JSON.stringify(variants) : '[]'} />

      {/* Header & Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Product Variants & Options</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Add sizes (S, M, L), colors, weights, or custom options with unique prices & stock levels.
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={hasVariants}
            onChange={e => setHasVariants(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      {hasVariants && (
        <div className="space-y-6 pt-2 border-t border-gray-100 dark:border-gray-800">
          {/* Preset Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-indigo-500" /> Quick Presets for Your Business Category:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_OPTIONS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="px-2.5 py-1 text-xs bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Option Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                1. Define Options (e.g. Size, Color, Weight)
              </span>
              <button
                type="button"
                onClick={addOption}
                className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium"
              >
                <Plus className="w-3.5 h-3.5" /> Add Another Option
              </button>
            </div>

            {options.map((opt, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800 items-center"
              >
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Option Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Size or Color"
                    value={opt.name}
                    onChange={e => updateOption(idx, 'name', e.target.value)}
                    className="w-full text-xs rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-gray-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="sm:col-span-7">
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Option Values (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. S, M, L, XL or Red, Blue"
                    value={opt.valuesText}
                    onChange={e => updateOption(idx, 'valuesText', e.target.value)}
                    className="w-full text-xs rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-gray-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="sm:col-span-1 flex justify-end pt-4 sm:pt-0">
                  {options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove option"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={generateVariants}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <Layers className="w-4 h-4" /> Generate Variant Combination Matrix
            </button>
          </div>

          {/* Variant Matrix Table */}
          {variants.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                2. Set Price & Stock for Each Variant ({variants.length} Combinations)
              </span>

              <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-lg">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold">
                      <th className="p-2.5">Variant</th>
                      <th className="p-2.5 w-24">Selling Price (₹)</th>
                      <th className="p-2.5 w-24">Cost Price (₹)</th>
                      <th className="p-2.5 w-24">Stock Qty</th>
                      <th className="p-2.5 w-28">SKU Code</th>
                      <th className="p-2.5 w-10 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                    {variants.map((v, vIdx) => (
                      <tr key={vIdx} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                        <td className="p-2.5 font-medium text-gray-900 dark:text-white">
                          <span className="inline-block px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded font-semibold text-[11px]">
                            {v.title}
                          </span>
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={v.selling_price}
                            onChange={e => updateVariant(vIdx, 'selling_price', parseFloat(e.target.value) || 0)}
                            className="w-full text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={v.cost_price}
                            onChange={e => updateVariant(vIdx, 'cost_price', parseFloat(e.target.value) || 0)}
                            className="w-full text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            value={v.stock_quantity}
                            onChange={e => updateVariant(vIdx, 'stock_quantity', parseInt(e.target.value, 10) || 0)}
                            className="w-full text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            placeholder="Optional SKU"
                            value={v.sku}
                            onChange={e => updateVariant(vIdx, 'sku', e.target.value)}
                            className="w-full text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeVariantRow(vIdx)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title={`Delete variant ${v.title}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Excluded Combinations (Deleted Variants) restore bar */}
          {excludedTitles.size > 0 && (
            <div className="p-3 bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-lg space-y-2 text-xs">
              <div className="flex items-center justify-between font-medium text-red-800 dark:text-red-300">
                <span>Removed Combinations ({excludedTitles.size})</span>
                <span className="text-[11px] text-red-600/80 dark:text-red-400/80">These will not be created/launched in store</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Array.from(excludedTitles).map(title => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => restoreVariantTitle(title)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-white dark:bg-gray-800 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded text-[11px] hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    title="Click to restore this combination"
                  >
                    <span>{title}</span>
                    <Plus className="w-3 h-3 text-red-500" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

