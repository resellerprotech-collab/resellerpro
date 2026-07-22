import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Set Up Your Store - ResellerPro',
  description: 'Complete your store setup in just 2 minutes.',
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
