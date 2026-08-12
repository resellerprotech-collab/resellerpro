'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { VerifyEmailModal } from '@/components/dashboard/VerifyEmailModal'
import { useRouter } from 'next/navigation'

interface VerificationContextType {
    isVerified: boolean
    email: string
    userDismissed: boolean
    openVerificationModal: () => void
    closeVerificationModal: () => void
    checkVerification: () => boolean // Returns true if verified, else opens modal
    setVerified: (verified: boolean) => void
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined)

export function useVerification() {
    const context = useContext(VerificationContext)
    if (!context) {
        throw new Error('useVerification must be used within a VerificationProvider')
    }
    return context
}

interface VerificationProviderProps {
    children: React.ReactNode
    initialVerified: boolean
    email: string
}

export function VerificationProvider({
    children,
    initialVerified,
    email
}: VerificationProviderProps) {
    const [isVerified, setIsVerified] = useState(initialVerified)
    const [isOpen, setIsOpen] = useState(false)
    const [userDismissed, setUserDismissed] = useState(false)
    const router = useRouter()

    // Sync with prop updates (e.g. after server revalidation)
    useEffect(() => {
        setIsVerified(initialVerified)
        if (initialVerified) setUserDismissed(false)
    }, [initialVerified])

    const openVerificationModal = () => {
        setUserDismissed(false)
        setIsOpen(true)
    }
    const closeVerificationModal = () => setIsOpen(false)

    // Called when user closes dialog without verifying
    const handleOpenChange = (open: boolean) => {
        if (!open) setUserDismissed(true)
        setIsOpen(open)
    }

    const checkVerification = () => {
        if (isVerified) return true
        openVerificationModal()
        return false
    }

    const handleVerified = () => {
        setIsVerified(true)
        setUserDismissed(false)
        router.refresh() // Refresh server components to update gated content on server side too
    }

    return (
        <VerificationContext.Provider value={{
            isVerified,
            email,
            userDismissed,
            openVerificationModal,
            closeVerificationModal,
            checkVerification,
            setVerified: setIsVerified
        }}>
            {children}
            <VerifyEmailModal
                open={isOpen}
                onOpenChange={handleOpenChange}
                email={email}
                onVerified={handleVerified}
            />
        </VerificationContext.Provider>
    )
}
