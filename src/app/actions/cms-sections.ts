'use server'

import { createClient } from '@/lib/supabase/server'
import { CmsSectionsService } from '@/lib/services/cms/sections.service'
import { revalidatePath } from 'next/cache'

/**
 * Fetch all CMS sections for current user
 */
export async function getCmsSectionsAction() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Authentication required', data: [] }

  try {
    const sections = await CmsSectionsService.getSections(user.id)
    return { success: true, data: sections }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to load CMS sections', data: [] }
  }
}

/**
 * Update content & state of a single section
 */
export async function updateCmsSectionAction(sectionType: string, payload: { is_enabled?: boolean; content?: Record<string, any>; label?: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Authentication required' }

  try {
    const updated = await CmsSectionsService.upsertSection(user.id, sectionType, payload)
    
    revalidatePath('/my-store')
    revalidatePath('/my-store/cms')
    revalidatePath('/settings/shop')
    
    return { success: true, data: updated, message: 'Section updated successfully' }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update section' }
  }
}

/**
 * Update section order
 */
export async function reorderCmsSectionsAction(orderedSectionTypes: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Authentication required' }

  try {
    await CmsSectionsService.updateSectionsOrder(user.id, orderedSectionTypes)

    revalidatePath('/my-store')
    revalidatePath('/my-store/cms')
    revalidatePath('/settings/shop')

    return { success: true, message: 'Section order saved successfully' }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to reorder sections' }
  }
}
