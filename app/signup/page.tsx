"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

export default function SignUp() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [companyTicker, setCompanyTicker] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const { signUp } = useAuth()

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        try {
            await signUp(email, password, companyName, companyTicker)
            router.push("/dashboard")
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError("An unexpected error occurred. Please try again later.")
            }
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>Create a new account to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleEmailSignUp} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Company Name</Label>
                            <Input
                                id="companyName"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="Enter your Company name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Company Ticker</Label>
                            <Input
                                id="companyTicker"
                                value={companyTicker}
                                onChange={(e) => setCompanyTicker(e.target.value)}
                                placeholder="Enter your Company Ticker"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full bg-[#cdf683] text-black hover:bg-[#b8e15e]">
                            Sign Up
                        </Button>
                    </form>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-center w-full">
                        Already have an account?{" "}
                        <Link href="/signin" className="text-blue-500 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

