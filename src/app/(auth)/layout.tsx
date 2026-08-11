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