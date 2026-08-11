'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { IosSpinner } from '@/components/ui/ios-spinner'

const LoginForm = dynamic(() => import('@/components/auth/LoginForm'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <IosSpinner size="xl" className="text-blue-600" />
    </div>
  ),
})

export default function SigninPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <IosSpinner size="xl" className="text-blue-600" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
