<<<<<<< HEAD
import { Toaster as Sonner } from "sonner"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <Sonner position="top-right" richColors={false} expand={false} gap={8} />
    </div>
  )
}
=======
import { Toaster } from "@/components/ui/toaster"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Force light mode on auth pages regardless of system/user theme preference
    // This prevents the black screen issue on dark-mode OS devices
    <div className="light min-h-screen" style={{ colorScheme: 'light', backgroundColor: '#ffffff' }}>
      {children}
      <Toaster />
    </div>
  )
}
>>>>>>> dev-daxo
