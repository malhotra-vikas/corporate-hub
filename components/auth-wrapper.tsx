"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { VerificationOverlay } from "@/components/verification-overlay"

interface AuthWrapperProps {
    children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
    const { user, loading } = useAuth()

    if (!user) {
        
    }
    const isVerified = user?.is_verified || false

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <>
            {children}
            <VerificationOverlay isVerified={isVerified} />
        </>
    )
}

