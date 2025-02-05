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

const EXCHANGE_OTC = "OTCMKTS"
const EXCHANGE_NASDAQ = "NASDAQ"
const EXCHANGE_NYSE = "NYSE"

const DOCUMENT_8_K = "8-K"
const DOCUMENT_10_Q = "10-Q"
const DOCUMENT_10_K = "10-K"
const DOCUMENT_S1 = "S1"


interface CompanyDetails {
    name: string
    foundedYear: string
    ceoName: string
    companyTicker: string
    exchange: string
}


export default function SignUp() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [companyTicker, setCompanyTicker] = useState("")
    const [companyExchange, setCompanyExchange] = useState("")
    const [companyName, setCompanyName] = useState("")
    let [companyCEOName, setCompanyCEOName] = useState("")
    let [companyFounded, setCompanyFounded] = useState("")

    let [past8KDocuments, setPast8KDocuments] = useState("")
    let [past10KDocuments, setPast10KDocuments] = useState("")
    let [past10QDocuments, setPast10QDocuments] = useState("")
    let [pastS1Documents, setPastS1Documents] = useState("")

    const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null)

    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { signUp } = useAuth()
    const serpApi = new SerpApi()
    const vaultApi = new VaultApi()

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

                // Try fetching company details from EXCHANGE_OTC
                serpCompanyDetails = await serpApi.getCompanyDetails({
                    companyTicker: ticker,
                    exchange: EXCHANGE_OTC,
                })

                // If company not found in EXCHANGE_OTC, try EXCHANGE_NASDAQ
                if (!serpCompanyDetails || !serpCompanyDetails.data || !serpCompanyDetails.data.companySummary) {
                    serpCompanyDetails = await serpApi.getCompanyDetails({
                        companyTicker: ticker,
                        exchange: EXCHANGE_NASDAQ,
                    })
                }

                // If company not found in EXCHANGE_NASDAQ, try EXCHANGE_NYSE
                if (!serpCompanyDetails || !serpCompanyDetails.data || !serpCompanyDetails.data.companySummary) {
                    serpCompanyDetails = await serpApi.getCompanyDetails({
                        companyTicker: ticker,
                        exchange: EXCHANGE_NYSE,
                    })
                }

                if (serpCompanyDetails && serpCompanyDetails.data && serpCompanyDetails.data.companySummary) {
                    const exchangeFound =
                        serpCompanyDetails.data.companySummary.exchange
                    setCompanyExchange(exchangeFound)


                    console.log(exchangeFound)
                    console.log("companySummary : ", serpCompanyDetails.data.companySummary)
                    console.log("companyKnowledgeGraph :", serpCompanyDetails.data.companyKnowledgeGraph)
                    console.log("newsResults :", serpCompanyDetails.data.newsResults)
                    console.log("companyFinancials :", serpCompanyDetails.data.companyFinancials)
                    console.log("companyDiscoverMore :", serpCompanyDetails.data.companyDiscoverMore)
                    console.log(serpCompanyDetails.data.companySummary.title)

                    setCompanyName(serpCompanyDetails.data.companySummary.title)

                    const ceoInfo = serpCompanyDetails.data.companyKnowledgeGraph.about[0]?.info.find((item: { label: string }) => item.label === "CEO");
                    console.log("ceoInfo ", ceoInfo)

                    if (ceoInfo) {
                        const nameParts = ceoInfo.value.trim().split(" "); // Split by space
                        // If the first and second part are the same, remove the duplicate
                        companyCEOName = nameParts[0] === nameParts[1] ? nameParts[0] : ceoInfo.value.trim();
                    } else {
                        companyCEOName = "CEO not found"
                    }

                    console.log("CEO Name: ", companyCEOName);

                    setCompanyCEOName(companyCEOName)

                    const foundedInfo = serpCompanyDetails.data.companyKnowledgeGraph.about[0]?.info.find((item: { label: string }) => item.label === "Founded");
                    console.log("foundedInfo ", foundedInfo)

                    if (foundedInfo) {
                        companyFounded = foundedInfo.value.trim();
                    } else {
                        companyFounded = "Data not found"
                    }
                    setCompanyFounded(companyFounded)
                    console.log("companyFounded: ", companyFounded);

                    setCompanyDetails({
                        ...serpCompanyDetails.data.companySummary,
                        ...serpCompanyDetails.data.companyKnowledgeGraph,
                        ...serpCompanyDetails.data.newsResults,
                        ...serpCompanyDetails.data.companyFinancials,
                        ...serpCompanyDetails.data.companyDiscoverMore,
                        companyTicker: ticker,
                        ceoName: companyCEOName,
                        exchange: exchangeFound,
                        foundedYear: companyFounded
                    })

                } else {
                    setCompanyDetails(null)
                    setError("No company found for the provided ticker")
                    toast.error(`Company with ticker ${ticker} not found in any of the exchanges ${EXCHANGE_NASDAQ}, ${EXCHANGE_NYSE} or ${EXCHANGE_OTC}.`);
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

    useEffect(() => {
        const timer = setTimeout(() => {
            if (debouncedCompanyTicker.length >= 2 && debouncedCompanyTicker !== companyDetails?.companyTicker) {
                fetchCompanyPastDocuments(debouncedCompanyTicker)
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
            await signUp(email.toLowerCase(), password, companyName, companyTicker, companyDetails)
            toast.success("Account created successfully!")          
            
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
            </Card>
        </div>
    )
}

