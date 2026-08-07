'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ProfileForm from '@/components/settings/ProfileForm'
import { useProfile } from '@/lib/react-query/hooks/useProfile'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

import { useState } from 'react'
import { logout } from '@/app/(auth)/logout/actions'
import { LogoutConfirmModal } from '@/components/layout/LogoutConfirmModal'
import { LogOut } from 'lucide-react'

export function ProfileClient({ initialData }: { initialData?: any }) {
    const { data: user, isLoading, error } = useProfile(initialData)
    const [showLogoutModal, setShowLogoutModal] = useState(false)

    const handleConfirmLogout = async () => {
        await logout()
    }

    const currentProfile = user || initialData

    if (isLoading && !currentProfile) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!currentProfile) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-destructive gap-4">
                <p>Error loading profile data. Please refresh the page.</p>
                <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                    Retry
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="sm:text-3xl text-[25px] font-bold tracking-tight">Profile Settings</h1>
                <p className="text-muted-foreground text-[15px]">
                    Manage your personal information and preferences
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                        Update your profile details. Your email cannot be changed for security reasons.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfileForm user={currentProfile} />
                </CardContent>
            </Card>

            {/* Account Session Card */}
            <Card className="border-red-500/20 bg-red-500/5 dark:bg-red-950/10">
                <CardHeader>
                    <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2 text-lg">
                        <LogOut className="h-5 w-5" />
                        Account Session
                    </CardTitle>
                    <CardDescription>
                        Sign out of your ResellerPro admin dashboard session safely.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <p className="text-xs text-muted-foreground max-w-md">
                        Logging out will terminate your current active session on this browser. You will need to log back in to manage your store and products.
                    </p>
                    <Button
                        variant="destructive"
                        onClick={() => setShowLogoutModal(true)}
                        className="gap-2 font-semibold rounded-xl bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </CardContent>
            </Card>

            <LogoutConfirmModal
                open={showLogoutModal}
                onOpenChange={setShowLogoutModal}
                onConfirm={handleConfirmLogout}
            />
        </div>
    )
}
