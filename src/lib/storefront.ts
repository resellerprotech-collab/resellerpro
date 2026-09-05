import { cache } from 'react'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Profile } from '@/types'

/**
 * Deduplicated store profile fetch for storefront RSC renders.
 * Uses React.cache() so generateMetadata, layout.tsx, and page.tsx
 * share a single database query per render cycle instead of running 3 separate queries.
 */
export const getStoreProfile = cache(async (shopSlug: string): Promise<Profile | null> => {
  const supabase = await createAdminClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('shop_slug', shopSlug)
    .single()

  return profile as Profile | null
})
