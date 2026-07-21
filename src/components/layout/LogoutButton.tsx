import { logout } from '@/app/(auth)/logout/actions'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  return (
    // This form will call the `logout` server action when submitted
    <form action={logout}>
      <button type="submit" className="w-full">
        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </button>
    </form>
  )
}