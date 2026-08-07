import { Suspense } from 'react'
import { ProfileClient } from './ProfileClient'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export const metadata = {
  title: 'Profile Settings - ResellerPro',
  description: 'Manage your profile information',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <Suspense fallback={<div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
      <ProfileClient initialData={profile || undefined} />
    </Suspense>
  )
}