"use client"

import { useState } from "react"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignIn() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await signInWithEmailAndPassword(auth, email, password)
            router.push("/dashboard")
        } catch (error) {
            setError("Failed to sign in. Please check your credentials.")
        }
    }

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider()
        try {
            await signInWithPopup(auth, provider)
            router.push("/dashboard")
        } catch (error) {
            setError("Failed to sign in with Google.")
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleEmailSignIn} className="space-y-4">
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
                            Sign In
                        </Button>
                    </form>
                    <div className="mt-4">
                        <Button variant="outline" className="w-full border-[#cdf683]" onClick={handleGoogleSignIn}>
                            Sign In with Google
                        </Button>
                    </div>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-center w-full">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-blue-500 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

