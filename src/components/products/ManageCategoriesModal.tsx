'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/lib/toast'
import { Trash2, Edit, Plus, Image as ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'
import type { Category } from '@/types'
import { 
  getCategoriesAction, 
  createCategoryAction, 
  updateCategoryAction, 
  deleteCategoryAction 
} from '@/app/(dashboard)/categories/actions'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ManageCategoriesModal({ open, onOpenChange, onSuccess }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list')
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  
  const [name, setName] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [removeImage, setRemoveImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  

  const router = useRouter()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (open) {
      fetchCategories()
      resetForm()
      setMode('list')
    }
  }, [open])

  async function fetchCategories() {
    setFetching(true)
    try {
      const res = await getCategoriesAction()
      if (res.success && res.data) {
        setCategories(res.data)
      } else {
        toast.error('Unable to load categories', { description: res.message || 'Please refresh the page.' })
      }
    } catch (err) {
      console.error(err)
      toast.error('Unable to load categories')
    } finally {
      setFetching(false)
    }
  }

  const resetForm = () => {
    setName('')
    setImageFile(null)
    setImagePreview(null)
    setRemoveImage(false)
    setEditingCategory(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setRemoveImage(false)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setRemoveImage(true)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Category name required', { description: 'Please enter a category name.' })
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', name.trim())
      
      if (imageFile) {
        formData.append('image', imageFile)
      }

      let res;
      if (mode === 'add') {
        res = await createCategoryAction(formData)
      } else if (mode === 'edit' && editingCategory) {
        formData.append('id', editingCategory.id)
        formData.append('oldName', editingCategory.name)
        if (removeImage) {
          formData.append('removeImage', 'true')
        }
        res = await updateCategoryAction(formData)
      }

      if (res?.success) {
        toast.success(mode === 'add' ? 'Category created' : 'Category updated')
        await fetchCategories()
        setMode('list')
        resetForm()
        if (onSuccess) onSuccess()
        router.refresh()
        // Invalidate products query so dashboard reflects updated product categories
        queryClient.invalidateQueries({ queryKey: ['products'] })
        queryClient.invalidateQueries({ queryKey: ['products-stats'] })
      } else {
        toast.error(mode === 'add' ? 'Unable to create category' : 'Unable to update category', {
          description: res?.message || 'Check your input and try again.',
        })
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong', { description: 'Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (category: Category) => {
    if (!confirm('Are you sure you want to delete this category? All products under this category will be moved to "Others".')) {
      return
    }

    setLoading(true)
    try {
      const res = await deleteCategoryAction(category.id, category.name)
      if (res.success) {
        toast.success('Category deleted')
        setCategories(categories.filter(c => c.id !== category.id))
        if (onSuccess) onSuccess()
        router.refresh()
        // Invalidate products query so dashboard reflects deleted categories (moved to Others)
        queryClient.invalidateQueries({ queryKey: ['products'] })
        queryClient.invalidateQueries({ queryKey: ['products-stats'] })
      } else {
        toast.error('Unable to delete category', { description: res.message || 'Please try again.' })
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong', { description: 'Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const openEdit = (category: Category) => {
    setEditingCategory(category)
    setName(category.name)
    setImagePreview(category.image_url || null)
    setMode('edit')
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!loading) onOpenChange(val)
    }}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'list' && 'Manage Categories'}
            {mode === 'add' && 'Add New Category'}
            {mode === 'edit' && 'Edit Category'}
          </DialogTitle>
        </DialogHeader>

        {mode === 'list' && (
          <div className="space-y-4 pt-2">
            <div className="flex justify-end">
              <Button size="sm" onClick={() => {
                resetForm()
                setMode('add')
              }}>
                <Plus className="w-4 h-4 mr-2" /> Add Category
              </Button>
            </div>

            {fetching ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No categories found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border flex items-center justify-center bg-muted overflow-hidden relative">
                        {cat.image_url ? (
                          <Image src={cat.image_url} alt={cat.name} fill className="object-cover" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <span className="font-medium text-sm">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}>
                        <Edit className="w-4 h-4 text-slate-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(cat)} disabled={loading}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {(mode === 'add' || mode === 'edit') && (
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Smartwatches"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Category Image (Optional)</Label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center bg-muted overflow-hidden relative">
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="w-[220px]"
                  />
                  {imagePreview && (
                    <Button type="button" variant="ghost" size="sm" onClick={handleRemoveImage} className="text-red-500 w-fit">
                      Remove Image
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Recommended: 200x200px square image. Will be displayed as a circle in the storefront.</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setMode('list')} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {mode === 'add' ? 'Create' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
