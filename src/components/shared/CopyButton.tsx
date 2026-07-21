'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Copy, Check } from 'lucide-react'

export function CopyButton({ textToCopy }: { textToCopy: string }) {
  const { toast } = useToast()
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy)
    setIsCopied(true)
    toast({ title: 'Copied to clipboard!' })
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleCopy}>
      {isCopied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  )
}