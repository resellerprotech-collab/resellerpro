'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from '@/lib/toast'
import { Loader2, Upload, User, Mail, Phone, Building, Smartphone } from 'lucide-react'
import { updateProfile, uploadAvatar } from '@/app/(dashboard)/settings/actions'
import { ImageCropper } from '../shared/ImageCropper'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

type UserData = {
  id: string
  email: string
  full_name: string
  phone: string
  avatar_url: string
  business_name: string
  upi_id?: string | null
  upi_name?: string | null
  upi_instructions?: string | null
  created_at: string
}

export default function ProfileForm({ user }: { user: UserData }) {
  const router = useRouter()

  const queryClient = useQueryClient()
  const [isPending, startTransition] = useTransition()
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [cropImage, setCropImage] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    upi_id: user?.upi_id || '',
    upi_name: user?.upi_name || '',
    upi_instructions: user?.upi_instructions || '',
  })

  // Sync formData when React Query invalidates and fetches new user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        full_name: user.full_name || prev.full_name,
        phone: user.phone || prev.phone,
        upi_id: user.upi_id || prev.upi_id,
        upi_name: user.upi_name || prev.upi_name,
        upi_instructions: user.upi_instructions || prev.upi_instructions,
      }))
    }
  }, [user])

  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target
    let { value } = e.target

    // Restrict phone to digits only
    if (name === 'phone') {
      value = value.replace(/\D/g, '')
    }

    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Avatar image must be less than 2MB.',
      })
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please upload an image file.',
      })
      return
    }

    // Read file as data URL for cropper
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      setCropImage(reader.result?.toString() || null)
    })
    reader.readAsDataURL(file)
    // Clear input value so same file can be selected again
    e.target.value = ''
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsUploadingAvatar(true)

    try {
      const file = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' })
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', user.id)

      const result = await uploadAvatar(formData)

      if (result.success && result.avatarUrl) {
        // Append timestamp to force cache refresh
        const newAvatarUrl = `${result.avatarUrl}?t=${new Date().getTime()}`
        setAvatarUrl(newAvatarUrl)
        setCropImage(null) // Close cropper
        toast.success('Profile picture updated')
        router.refresh()
      } else {
        throw new Error(result.message)
      }
    } catch (error: any) {
      toast.error('Unable to upload picture', {
        description: error.message || 'Check your image file and try again.',
      })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.full_name.trim()) {
      toast.error('Full name required', {
        description: 'Please enter your full name.',
      })
      return
    }

    startTransition(async () => {
      const data = new FormData()
      data.append('userId', user.id)
      data.append('full_name', formData.full_name)
      data.append('phone', formData.phone)
      data.append('upi_id', formData.upi_id)
      data.append('upi_name', formData.upi_name)
      data.append('upi_instructions', formData.upi_instructions)

      const result = await updateProfile(data)

      if (result.success) {
        toast.success('Profile updated')
        
        // Invalidate React Query to ensure it fetches updated data from the server
        queryClient.invalidateQueries({ queryKey: ['profile'] })
        
        router.refresh()
      } else {
        toast.error('Unable to update profile', {
          description: result.message || 'Something went wrong. Please try again.',
        })
      }
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Business Logo Section */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center gap-2">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Logo" className="h-4 w-4 rounded-sm object-cover" />
          ) : (
            <Building className="h-4 w-4 text-primary" />
          )}
          Business Logo
        </Label>
        <div className="flex items-center gap-6 p-4 border rounded-xl bg-muted/30">
          <Avatar className="h-24 w-24 border-2 border-background shadow-sm">
            <AvatarImage src={avatarUrl || undefined} alt={user.business_name || formData.full_name} />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground font-bold">
              {user.business_name ? getInitials(user.business_name) : (formData.full_name ? getInitials(formData.full_name) : 'BN')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <Label htmlFor="avatar" className="cursor-pointer">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploadingAvatar}
                  asChild
                >
                  <span>
                    {isUploadingAvatar ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Change Logo
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </Label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploadingAvatar}
            />
            <p className="text-xs text-muted-foreground mt-2">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>
      </div>

      {cropImage && (
        <ImageCropper
          image={cropImage}
          open={!!cropImage}
          onClose={() => setCropImage(null)}
          onCropComplete={handleCropComplete}
          aspectRatio={1}
        />
      )}

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="full_name">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Full Name *
          </div>
        </Label>
        <Input
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          required
          disabled={isPending}
        />
      </div>

      {/* Email (Read-only) */}
      <div className="space-y-2">
        <Label htmlFor="email">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </div>
        </Label>
        <Input
          id="email"
          type="email"
          value={user.email}
          disabled
          className="bg-muted"
        />
        <p className="text-xs text-muted-foreground">
          Email cannot be changed. Contact support if you need to update it.
        </p>
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone Number
          </div>
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Enter your phone number"
          disabled={isPending}
        />
      </div>

      {/* Business Name (Read-only) */}
      <div className="space-y-2">
        <Label htmlFor="business_name">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Business Name
          </div>
        </Label>
        <Input
          id="business_name"
          type="text"
          value={user.business_name}
          disabled
          className="bg-muted"
        />
        <p className="text-xs text-muted-foreground">
          Business name can be edited from business settings.
        </p>
      </div>

      {/* GPay / UPI Payment Details */}
      <div className="pt-4 border-t space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Smartphone className="h-4 w-4 text-emerald-600" />
          GPay / UPI Payment Settings
        </h3>
        
        <div className="space-y-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="space-y-1.5">
            <Label htmlFor="upi_id" className="text-xs font-semibold">
              UPI ID / GPay Mobile Number
            </Label>
            <Input
              id="upi_id"
              name="upi_id"
              value={formData.upi_id}
              onChange={handleInputChange}
              placeholder="e.g. 9048571147@okbizaxis or 9048571147"
              className="bg-white dark:bg-slate-950 font-mono text-xs sm:text-sm"
              disabled={isPending}
            />
            <p className="text-[10px] text-muted-foreground">
              Automatically sent to customers on WhatsApp when they choose "Pay via UPI" at checkout.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="upi_name" className="text-xs font-semibold">
              GPay / Account Holder Name
            </Label>
            <Input
              id="upi_name"
              name="upi_name"
              value={formData.upi_name}
              onChange={handleInputChange}
              placeholder="e.g. Royal Fashion Store"
              className="bg-white dark:bg-slate-950 text-xs sm:text-sm"
              disabled={isPending}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="upi_instructions" className="text-xs font-semibold">
              Payment Instructions / Custom Note (Optional)
            </Label>
            <textarea
              id="upi_instructions"
              name="upi_instructions"
              value={formData.upi_instructions}
              onChange={handleInputChange}
              placeholder="e.g. Accepting GPay, PhonePe, Paytm transfers..."
              rows={2}
              className="w-full px-3 py-2 text-xs rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
              disabled={isPending}
            />
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Member since: {new Date(user.created_at).toLocaleDateString('en-IN', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  )
}