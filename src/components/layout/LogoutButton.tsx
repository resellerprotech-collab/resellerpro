'use client'

import { useState } from 'react'
import { logout } from '@/app/(auth)/logout/actions'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { LogOut } from 'lucide-react'
import { LogoutConfirmModal } from './LogoutConfirmModal'

export function LogoutButton() {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleConfirmLogout = async () => {
    await logout()
  }

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault()
          setShowConfirm(true)
        }}
        className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer font-medium"
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Logout</span>
      </DropdownMenuItem>

      <LogoutConfirmModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleConfirmLogout}
      />
    </>
  )
}