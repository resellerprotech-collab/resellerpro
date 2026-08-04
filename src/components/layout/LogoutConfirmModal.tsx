'use client'

import { useState } from 'react'
import { LogOut, AlertTriangle, Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface LogoutConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void> | void
  title?: string
  description?: string
  confirmButtonText?: string
}

export function LogoutConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  title = 'Confirm Logout',
  description = 'Are you sure you want to log out of your session? You will need to sign back in to access your dashboard.',
  confirmButtonText = 'Yes, Logout',
}: LogoutConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onConfirm()
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(val) => !isLoading && onOpenChange(val)}>
      <AlertDialogContent className="max-w-md rounded-2xl p-6 border border-border/80 bg-background/95 backdrop-blur-xl shadow-2xl animate-in fade-in-0 zoom-in-95">
        <AlertDialogHeader className="space-y-3 flex flex-col items-center text-center sm:text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 ring-8 ring-red-500/5 transition-transform hover:scale-105">
            <LogOut className="h-7 w-7" />
          </div>
          <AlertDialogTitle className="text-xl font-bold tracking-tight">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center gap-2.5 pt-4 border-t border-border/50 mt-4">
          <AlertDialogCancel
            disabled={isLoading}
            className="w-full sm:w-1/2 rounded-xl h-11 border-slate-200 dark:border-slate-800 hover:bg-muted font-medium transition-all"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full sm:w-1/2 rounded-xl h-11 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/35 transition-all border-0"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Logging out...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <LogOut className="h-4 w-4" />
                {confirmButtonText}
              </span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
