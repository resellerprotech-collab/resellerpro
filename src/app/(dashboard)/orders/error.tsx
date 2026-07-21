'use client' // Add this directive!

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="text-center space-y-4">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
        <h2 className="text-2xl font-bold">Error Loading Orders</h2>
        <p className="text-muted-foreground">Something went wrong while fetching your orders.</p>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  )
}