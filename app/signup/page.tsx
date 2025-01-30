"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import SerpApi from "@/lib/api/serp.api"
import { toast } from "react-toastify"

interface CompanyDetails {
    name: string
    industry: string
    foundedYear: number
    ceoName: string
    companyTicker: string
    // Add other relevant fields
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


    useEffect(() => {
        const fetchCompanyDetails = async () => {
            if (companyTicker.length > 2) {
                setIsLoading(true)
                try {
                    let serpCompanyDetails = null;

                    // Try fetching company details from EXCHANGE_DOW
                    serpCompanyDetails = await serpApi.getCompanyDetails({
                        companyTicker: companyTicker,
                        exchange: EXCHANGE_DOW,
                    });

                    // If company not found in EXCHANGE_DOW, try EXCHANGE_NASDAQ
                    if (!serpCompanyDetails || !serpCompanyDetails.data || !serpCompanyDetails.data.companySummary) {
                        serpCompanyDetails = await serpApi.getCompanyDetails({
                            companyTicker: companyTicker,
                            exchange: EXCHANGE_NASDAQ,
                        });
                    }

                    let exchangeFound = null
                    if (serpCompanyDetails && serpCompanyDetails.data && serpCompanyDetails.data.companySummary) {
                        // Set company exchange based on successful response
                        exchangeFound = serpCompanyDetails.data.companySummary.exchange || (serpCompanyDetails.data.companySummary.exchange === EXCHANGE_DOW ? EXCHANGE_DOW : EXCHANGE_NASDAQ);
                        setCompanyExchange(exchangeFound);

                        // Optionally, set the company details in state
                        setCompanyDetails(serpCompanyDetails.data);
                    } else {
                        toast.error("No company found for Ticker");
                        setCompanyDetails(null); // Clear company details
                        setCompanyExchange("");
                    }

                    console.log("Company Exchange:", exchangeFound);
                    console.log("Company Details:", serpCompanyDetails);

                    //if (serpCompanyDetails.data.summary)



                    //setCompanyDetails(serpCompanyDetails)
                } catch (error) {
                    console.error("Error fetching company details:", error)
                    setCompanyDetails(null)
                } finally {
                    setIsLoading(false)
                }
            } else {
                setCompanyDetails(null)
            }
        }

        const debounceTimer = setTimeout(fetchCompanyDetails, 500)
        return () => clearTimeout(debounceTimer)
    }, [companyTicker, serpApi.getCompanyDetails]) // Added userApi.getCompanyDetails to dependencies

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        try {
            //await signUp(email, password, name, companyDetails)
            await signUp(email, password, companyName, companyTicker, companyDetails)
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
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>Create a new account to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleEmailSignUp} className="space-y-4">
                        <div className="space-y-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Company Stock Ticker</Label>
                                <Input
                                    id="companyTicker"
                                    value={companyTicker}
                                    onChange={(e) => setCompanyTicker(e.target.value)}
                                    placeholder="Enter your Company Stock Ticker"
                                    required
                                />
                            </div>
                            {isLoading && <p className="text-sm text-gray-500">Fetching company details...</p>}
                            {companyDetails && (
                                <div className="text-sm">
                                    <p>
                                        <strong>Name:</strong> {companyDetails.name}
                                    </p>
                                    <p>
                                        <strong>Industry:</strong> {companyDetails.industry}
                                    </p>
                                    <p>
                                        <strong>CEO:</strong> {companyDetails.ceoName}
                                    </p>
                                    <p>
                                        <strong>Founded:</strong> {companyDetails.foundedYear}
                                    </p>
                                    {/* Add other company details here */}
                                </div>
                            )}
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

