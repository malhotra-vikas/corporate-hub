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
import VaultApi from "@/lib/api/vault.api"
import axios from 'axios';


const EXCHANGE_OTC = "OTCMKTS"
const EXCHANGE_NASDAQ = "NASDAQ"
const EXCHANGE_NYSE = "NYSE"
const EXCHANGE_NYSE_AMERICAN = "NYSEAMERICAN"

interface CompanyDetails {
    name: string
    foundedYear: string
    ceoName: string
    companyTicker: string
    exchange: string
    industry: string
    description: string
    cik: string
    logo: string
}

export default function SignUp() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [companyTicker, setCompanyTicker] = useState("")
    const [companyExchange, setCompanyExchange] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [companyLogo, setCompanyLogo] = useState("")

    let [companyCEOName, setCompanyCEOName] = useState("")
    let [companyFounded, setCompanyFounded] = useState("")
    const [retryCount, setRetryCount] = useState(0); // Track the number of retries
    const maxRetries = 3; // Max number of retries

    const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null)

    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { signUp } = useAuth()
    const serpApi = new SerpApi()
    const vaultApi = new VaultApi()

    /*    
        const fetchCompanyPastDocuments = async (ticker: string) => {
            if (ticker.length < 2) {
                setPast10KDocuments("")
                setPast10QDocuments("")
                setPast8KDocuments("")
                setPastS1Documents("")
                return
            }
    
            setIsLoading(true)
            setError(null)
    
            try {
    
                const duration = getLastTwoYearsRange()
                const past10KDocs = await vaultApi.fetchCompanyPastDocuments({ ticker: ticker, fileType: DOCUMENT_10_K, duration })
                const past10QDocs = await vaultApi.fetchCompanyPastDocuments({ ticker: ticker, fileType: DOCUMENT_10_Q, duration })
                const past8KDocs = await vaultApi.fetchCompanyPastDocuments({ ticker: ticker, fileType: DOCUMENT_8_K, duration })
                const pastS1Docs = await vaultApi.fetchCompanyPastDocuments({ ticker: ticker, fileType: DOCUMENT_S1, duration })
    
    
                past10KDocuments = past10KDocs?.data.filings || null,
                    past8KDocuments = past8KDocs?.data.filings || null,
                    pastS1Documents = pastS1Docs?.data.filings || null,
                    past10QDocuments = past10QDocs?.data.filings || null
    
                console.log(" duration is ", duration)
                console.log(" past10KDocs is ", past10KDocuments)
                console.log(" past10QDocs is ", past10QDocuments)
                console.log(" past8KDocs is ", past8KDocuments)
                console.log(" pastS1Docs is ", pastS1Documents)
    
                setPast10KDocuments(past10KDocuments)
                setPast10QDocuments(past10QDocuments)
                setPast8KDocuments(past8KDocuments)
                setPastS1Documents(pastS1Documents)
    
                return {
                    past10KDocuments: past10KDocuments,
                    past8KDocuments: past8KDocuments,
                    pastS1Documents: pastS1Documents,
                    past10QDocuments: past10QDocuments
                }
    
            } catch (error) {
                console.error("Error fetching company details:", error)
                setPast10KDocuments("")
                setPast10QDocuments("")
                setPast8KDocuments("")
                setPastS1Documents("")
                setError("Error fetching company details. Please try again.")
                toast.error("Error fetching company details. Please try again.")
            } finally {
                setIsLoading(false)
            }
        }
    */

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

                const companyFMP = await serpApi.getCompanyDataViaFinancialModeling(ticker)

                console.log("companyFMP is ", companyFMP)
                console.log("companyFMP DATA is ", companyFMP.data)

                if (companyFMP && companyFMP.data && companyFMP.data && companyFMP.data.length > 0) {
                    const exchangeFound =
                        companyFMP.data[0].exchangeShortName
                    setCompanyExchange(exchangeFound)

                    console.log("companyFMP.data[0].exchangeShortName ", companyFMP.data[0].exchangeShortName)

                    console.log(exchangeFound)

                    setCompanyName(companyFMP.data[0].companyName)
                    setCompanyCEOName(companyFMP.data[0].ceo)


                    setCompanyDetails({
                        ...companyFMP.data[0],
                        companyTicker: ticker,
                        ceoName: companyCEOName,
                        exchange: exchangeFound,
                        industry: companyFMP.data[0].industry,
                        cik: companyFMP.data[0].cik,
                        description: companyFMP.data[0].description,
                        logo: companyFMP.data[0].image
                    })

                } else {
                    setCompanyDetails(null)
                    setError("No company found for the provided ticker")
                    setRetryCount(prev => prev + 1); // Increment retry count on failure

                    toast.error(`Company with ticker ${ticker} not found in any of the exchanges ${EXCHANGE_NASDAQ}, ${EXCHANGE_NYSE} or ${EXCHANGE_OTC}.`);
                }
            } catch (error) {
                console.error("Error fetching company details:", error)
                setCompanyDetails(null)
                setRetryCount(prev => prev + 1); // Increment retry count on failure

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
                if (retryCount < maxRetries) {
                    fetchCompanyDetails(debouncedCompanyTicker)
                }
            }
        }, 750)

        return () => clearTimeout(timer)
    }, [debouncedCompanyTicker, fetchCompanyDetails, companyDetails, retryCount])

    /*
    useEffect(() => {
        const timer = setTimeout(() => {
            if (debouncedCompanyTicker.length >= 2 && debouncedCompanyTicker !== companyDetails?.companyTicker) {
                fetchCompanyPastDocuments(debouncedCompanyTicker)
            }
        }, 750)

        return () => clearTimeout(timer)
    }, [debouncedCompanyTicker, fetchCompanyDetails, companyDetails])
    */


    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        if (!companyDetails) {
            setError("Please enter a valid company ticker")
            return
        }
        try {
            await signUp(email.toLowerCase(), password, companyName, companyTicker, companyDetails)
            toast.success("Account created successfully!")

            // New Account Created. Send a message to the queue for processing the fetch data
            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/queueprocessor/post-message`;
            const data = {
                message: email.toLowerCase()
            };

            // Send POST request
            const response = await axios.post(url, data, {
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                }
            });

            // Log the response from the server
            console.log('Response:', response.data);


            router.push("/hub")
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

    function getLastTwoYearsRange() {
        // Get the current year
        const currentYear = new Date().getFullYear();

        // Get the current date
        const currentDate = new Date();

        // Start date: January 1st, two years ago
        const startDate = new Date(currentDate.getFullYear() - 2, 0, 1); // January 1st of two years ago

        // End date: Today
        const endDate = currentDate;

        // Format the dates to "YYYY-MM-DD"
        const formatDate = (date) => date.toISOString().split('T')[0];

        // Return the formatted string
        return `[${formatDate(startDate)} TO ${formatDate(endDate)}]`;
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
                <CardFooter>

                    <p className="text-sm text-center w-full">
                        Forgot password?{" "}
                        <Link href="/reset-password" className="text-blue-500 hover:underline">
                            Reset Here
                        </Link>
                    </p>
                </CardFooter>

            </Card>
        </div>
    )
}

