import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CmsSectionsService } from '@/lib/services/cms/sections.service'
import CmsSectionEditorClient from '@/components/cms/CmsSectionEditorClient'

export const metadata = {
  title: 'Homepage Section Manager - ResellerPro CMS',
  description: 'Manage, reorder, enable or disable modular content sections for your store.',
}

export default async function CmsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, shop_slug, store_mode')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/my-store')
  }

  // Fetch or auto-seed CMS sections
  const sections = await CmsSectionsService.getSections(user.id)

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">CMS Section Manager</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize section ordering, toggle section visibility, and update content blocks across your public storefront and Headless APIs.
        </p>
      </div>

      <CmsSectionEditorClient
        initialSections={sections}
        shopSlug={profile.shop_slug || ''}
      />
    </div>
  )
}
