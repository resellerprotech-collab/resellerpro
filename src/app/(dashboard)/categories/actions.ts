'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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

    return { success: true, data }
  } catch (error: any) {
    console.error('Unexpected error creating category:', error)
    return { success: false, message: 'Internal server error' }
  }
}
