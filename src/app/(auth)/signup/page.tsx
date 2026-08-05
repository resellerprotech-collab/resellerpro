'use client'

import dynamic from 'next/dynamic'
import { IosSpinner } from '@/components/ui/ios-spinner'

const SignupForm = dynamic(() => import('@/components/auth/SignupForm'), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: '100vh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <IosSpinner size="xl" className="text-blue-600" />
    </div>
  ),
})

export default function SignupPage() {
  return <SignupForm />
}