"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import SerpApi from "@/lib/api/serp.api"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Loader2 } from "lucide-react"
import type React from "react"

interface CompanyDetails {
    name: string
    industry: string
    foundedYear: number
    ceoName: string
    companyTicker: string
    exchange: string
    // Add any additional properties from companyAbout, newsResults, companyFinancials, and companyDiscoverMore
}

export default function SignUp() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [companyTicker, setCompanyTicker] = useState("")
    const [companyExchange, setCompanyExchange] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { signUp } = useAuth()
    const serpApi = new SerpApi()

    const EXCHANGE_NASDAQ = "NASDAQ"
    const EXCHANGE_DOW = "DJI"

    const fetchCompanyDetails = useCallback(
        async (ticker: string) => {
            if (ticker.length < 2) {
                setCompanyDetails(null)
                return
            }

            setIsLoading(true)
            setError(null)

            try {
                let serpCompanyDetails = null

                // Try fetching company details from EXCHANGE_DOW
                serpCompanyDetails = await serpApi.getCompanyDetails({
                    companyTicker: ticker,
                    exchange: EXCHANGE_DOW,
                })

                // If company not found in EXCHANGE_DOW, try EXCHANGE_NASDAQ
                if (!serpCompanyDetails || !serpCompanyDetails.data || !serpCompanyDetails.data.companySummary) {
                    serpCompanyDetails = await serpApi.getCompanyDetails({
                        companyTicker: ticker,
                        exchange: EXCHANGE_NASDAQ,
                    })
                }

                if (serpCompanyDetails && serpCompanyDetails.data && serpCompanyDetails.data.companySummary) {
                    const exchangeFound =
                        serpCompanyDetails.data.companySummary.exchange ||
                        (serpCompanyDetails.data.companySummary.exchange === EXCHANGE_DOW ? EXCHANGE_DOW : EXCHANGE_NASDAQ)
                    setCompanyExchange(exchangeFound)
                    setCompanyDetails({
                        ...serpCompanyDetails.data.companySummary,
                        ...serpCompanyDetails.data.companyKnowledgeGraph,
                        ...serpCompanyDetails.data.newsResults,
                        ...serpCompanyDetails.data.companyFinancials,
                        ...serpCompanyDetails.data.companyDiscoverMore,
                        companyTicker: ticker,
                    })

                    console.log(exchangeFound)
                    console.log("companySummary : ", serpCompanyDetails.data.companySummary)
                    console.log("companyKnowledgeGraph :", serpCompanyDetails.data.companyKnowledgeGraph)
                    console.log("newsResults :", serpCompanyDetails.data.newsResults)
                    console.log("companyFinancials :", serpCompanyDetails.data.companyFinancials)
                    console.log("companyDiscoverMore :", serpCompanyDetails.data.companyDiscoverMore)

                    setCompanyName(serpCompanyDetails.data.companySummary.name)
                } else {
                    setCompanyDetails(null)
                    setError("No company found for the provided ticker")
                    toast.error("No company found for the provided ticker")
                }
            } catch (error) {
                console.error("Error fetching company details:", error)
                setCompanyDetails(null)
                setError("Error fetching company details. Please try again.")
                toast.error("Error fetching company details. Please try again.")
            } finally {
                setIsLoading(false)
            }
        },
        [serpApi],
    )

    const debouncedCompanyTicker = useMemo(() => {
        return companyTicker
    }, [companyTicker])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (debouncedCompanyTicker.length >= 2 && debouncedCompanyTicker !== companyDetails?.companyTicker) {
                fetchCompanyDetails(debouncedCompanyTicker)
            }
        }, 750)

        return () => clearTimeout(timer)
    }, [debouncedCompanyTicker, fetchCompanyDetails, companyDetails])

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        if (!companyDetails) {
            setError("Please enter a valid company ticker")
            return
        }
        try {
            await signUp(email, password, companyName, companyTicker, companyDetails)
            toast.success("Account created successfully!")
            router.push("/dashboard")
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
                toast.error(error.message)
            } else {
                setError("An unexpected error occurred. Please try again later.")
                toast.error("An unexpected error occurred. Please try again later.")
            }
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <ToastContainer position="top-right" autoClose={5000} />
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>Create a new account to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleEmailSignUp} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="companyTicker">Company Stock Ticker</Label>
                            <Input
                                id="companyTicker"
                                value={companyTicker}
                                onChange={(e) => setCompanyTicker(e.target.value.toUpperCase())}
                                onBlur={() => {
                                    if (companyTicker.length >= 2 && companyTicker !== companyDetails?.companyTicker) {
                                        fetchCompanyDetails(companyTicker)
                                    }
                                }}
                                placeholder="Enter your Company Stock Ticker"
                                required
                            />
                        </div>
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <span className="ml-2">Fetching company details...</span>
                            </div>
                        ) : companyDetails ? (
                            <div className="text-sm bg-gray-50 p-3 rounded-md">
                                <p>
                                    <strong>Name:</strong> {companyDetails.name}
                                </p>
                                <p>
                                    <strong>CEO:</strong> {companyDetails.ceoName}
                                </p>
                                <p>
                                    <strong>Founded:</strong> {companyDetails.foundedYear}
                                </p>
                                <p>
                                    <strong>Exchange:</strong> {companyDetails.exchange}
                                </p>
                            </div>
                        ) : error ? (
                            <p className="text-red-500 text-sm">{error}</p>
                        ) : null}
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
                        <Button
                            type="submit"
                            className="w-full bg-[#cdf683] text-black hover:bg-[#b8e15e]"
                            disabled={isLoading || !companyDetails}
                        >
                            Sign Up
                        </Button>
                    </form>
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

