import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface VerificationOverlayProps {
    isVerified: boolean
}

export const VerificationOverlay: React.FC<VerificationOverlayProps> = ({ isVerified }) => {
    if (isVerified) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Email Verification Required</h2>
                <p className="mb-6">
                    Please verify your email address to access all features. Check your inbox for a verification link.
                </p>
                <div className="flex justify-between">
                    <Button asChild>
                        <Link href="/resend-verification">Resend Verification Email</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/logout">Logout</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

