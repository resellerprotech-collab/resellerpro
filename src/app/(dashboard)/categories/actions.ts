'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCategoriesAction() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching categories:', error)
    return { success: false, message: error.message }
  }

  return { success: true, data }
}

export async function createCategoryAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const name = formData.get('name') as string
  const image = formData.get('image') as File | null

  if (!name) {
    return { success: false, message: 'Name is required' }
  }

  try {
    let imageUrl = null

    if (image && image.size > 0) {
      const ext = image.name.split('.').pop()
      const fileName = `${user.id}/category-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, image)

      if (uploadError) {
        console.error('Error uploading category image:', uploadError)
        return { success: false, message: 'Failed to upload image' }
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      imageUrl = data.publicUrl
    }

    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: user.id,
        name: name,
        image_url: imageUrl,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return { success: false, message: 'A category with this name already exists' }
      }
      console.error('Error creating category:', error)
      return { success: false, message: error.message }
    }

    // Revalidate storefront cache
    const { data: profile } = await supabase.from('profiles').select('shop_slug').eq('id', user.id).single()
    if (profile?.shop_slug) {
      revalidatePath(`/store/${profile.shop_slug}`, 'layout')
      revalidatePath(`/store/${profile.shop_slug}`)
      revalidatePath(`/store/${profile.shop_slug}/shop`)
    }

    return { success: true, data }
  } catch (error: any) {
    console.error('Unexpected error creating category:', error)
    return { success: false, message: 'Internal server error' }
  }
}

export async function updateCategoryAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const oldName = formData.get('oldName') as string
  const image = formData.get('image') as File | null | string
  const removeImage = formData.get('removeImage') === 'true'

  if (!id || !name) {
    return { success: false, message: 'ID and Name are required' }
  }

  try {
    const updateData: any = { name }

    if (removeImage) {
      updateData.image_url = null
    } else if (image && typeof image !== 'string' && image.size > 0) {
      const ext = image.name.split('.').pop()
      const fileName = `${user.id}/category-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, image)

      if (uploadError) {
        console.error('Error uploading category image:', uploadError)
        return { success: false, message: 'Failed to upload image' }
      }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      updateData.image_url = urlData.publicUrl
    }

    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return { success: false, message: 'A category with this name already exists' }
      }
      console.error('Error updating category:', error)
      return { success: false, message: error.message }
    }

    if (oldName && oldName !== name) {
      const { error: productsError } = await supabase
        .from('products')
        .update({ category: name })
        .eq('user_id', user.id)
        .eq('category', oldName)

      if (productsError) console.error('Error updating product categories:', productsError)
    }

    // Revalidate storefront cache
    const { data: profile } = await supabase.from('profiles').select('shop_slug').eq('id', user.id).single()
    if (profile?.shop_slug) {
      revalidatePath(`/store/${profile.shop_slug}`, 'layout')
      revalidatePath(`/store/${profile.shop_slug}`)
      revalidatePath(`/store/${profile.shop_slug}/shop`)
    }

    return { success: true, data }
  } catch (error: any) {
    console.error('Unexpected error updating category:', error)
    return { success: false, message: 'Internal server error' }
  }
}

export async function deleteCategoryAction(id: string, categoryName: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting category:', error)
      return { success: false, message: error.message }
    }

    if (categoryName) {
      const { error: productsError } = await supabase
        .from('products')
        .update({ category: 'Others' })
        .eq('user_id', user.id)
        .eq('category', categoryName)

      if (productsError) console.error('Error updating orphaned products:', productsError)
    }

    // Revalidate storefront cache
    const { data: profile } = await supabase.from('profiles').select('shop_slug').eq('id', user.id).single()
    if (profile?.shop_slug) {
      revalidatePath(`/store/${profile.shop_slug}`, 'layout')
      revalidatePath(`/store/${profile.shop_slug}`)
      revalidatePath(`/store/${profile.shop_slug}/shop`)
    }

    return { success: true }
  } catch (error: any) {
    console.error('Unexpected error deleting category:', error)
    return { success: false, message: 'Internal server error' }
  }
}
