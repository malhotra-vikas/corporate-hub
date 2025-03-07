"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    CalendarIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    Plus,
    X,
    TrendingUpIcon,
    TrendingDownIcon,
    Newspaper,
    Twitter,
    Linkedin,
} from "lucide-react"
import { useEffect, useState } from "react"
import HubApi from "@/lib/api/hub"
import UserApi from "@/lib/api/user.api"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { EarningsEvent, HubData } from "@/lib/types"

import type { CreateUserDto } from "@/dto/createUser.dto"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EarningsApi from "@/lib/api/earnings.api"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { NewsSection } from "@/components/news-section"
import { EarningsCalendar } from "@/components/earnings-calendar"
import TwitterApi from "@/lib/api/twitter.api"
import { TwitterDto } from "@/dto/twitter.dto"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"

async function fetchHubData(companyTicker: string, companyExchange: string, companyUser: any): Promise<HubData> {
    const hubApi = new HubApi()
    try {
        const hubDetails = await hubApi.getCompanyHubDetails(companyTicker, companyExchange, companyUser)
        console.log("hubDetails is here as ", hubDetails)

        return hubDetails
    } catch (error) {
        console.error("Error fetching hub data:", error)
        throw error
    }
}

const tickerColors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-yellow-100 text-yellow-800",
    "bg-red-100 text-red-800",
    "bg-indigo-100 text-indigo-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
]

export default function HubPage() {
    const { user, loading } = useAuth()
    const [hubData, setHubData] = useState<HubData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [companyTicker, setCompanyTicker] = useState("")
    const [companyExchange, setCompanyExchange] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [newTickerSymbol, setNewTickerSymbol] = useState("")
    const [isAddingTicker, setIsAddingTicker] = useState(false)
    const [currentTickers, setCurrentTickers] = useState<string[]>([])
    const [isTwitterConnected, setIsTwitterConnected] = useState(false)
    const [isLinkedInConnected, setIsLinkedInConnected] = useState(false)

    const [refresh, setRefresh] = useState(0);

    const userApi = new UserApi()
    const earningsApi = new EarningsApi()

    const hubApi = new HubApi()

    const twitterApi = new TwitterApi()
    const router = useRouter()

    const handleAddTicker = async () => {
        if (!newTickerSymbol) return
        try {
            const newCompetitorData = await hubApi.addCompetitor(newTickerSymbol)
            const updatedTickers = [...currentTickers, newTickerSymbol]
            setHubData((prev) => ({
                ...prev!,
                competitors: [...prev!.competitors, newCompetitorData],
            }))
            setCurrentTickers(updatedTickers)

            if (!user?.email) {
                throw "no user found"
            }

            const updateUser: CreateUserDto = {
                email: user?.email,
                interestTickers: updatedTickers,
            }
            await userApi.updateUserByEmail(updateUser)

            earningsApi.addNewEarningsTicker(newTickerSymbol)

            setNewTickerSymbol("")
            setIsAddingTicker(false)
            toast.success(`Added ${newTickerSymbol} to competitors`)
        } catch (error) {
            toast.error("Failed to add competitor")
        }
    }
    const handleConnect = async () => {

        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/twitter/auth?token=${user?._id}`;

        window.location.href = url;
    }

    const handleLinkedInConnect = async () => {
        //window.location.href = `http://localhost:5020/api/twitter/auth?token=${user?._id}`;
        toast.error("Not Yet Implemented")
    }

    const handleDeleteTicker = async (symbol: string) => {
        try {
            const updatedTickers = currentTickers.filter((ticker) => ticker !== symbol)
            setHubData((prev) => ({
                ...prev!,
                competitors: prev!.competitors.filter((comp) => comp.symbol !== symbol),
            }))
            setCurrentTickers(updatedTickers)

            if (!user?.email) {
                throw "no user found"
            }

            const updateUser: CreateUserDto = {
                email: user?.email,
                interestTickers: updatedTickers,
            }
            await userApi.updateUserByEmail(updateUser)
            toast.success(`Removed ${symbol} from competitors`)
        } catch (error) {
            toast.error("Failed to remove competitor")
        }
    }


    // Function to check if user is connected to Twitter
    const checkTwitterConnection = async () => {
        if (!user?._id) return;

        console.log("🔍 Checking Twitter connection for user:", user._id);

        try {
            const response = await twitterApi.getTwitterAccountByUserId(user._id);
            console.log("✅ Twitter API response:", response);

            if (response?.connected && response?.account?.username) {
                console.log("✅ Twitter is connected");
                setIsTwitterConnected(true);
            } else {
                console.log("❌ Twitter is NOT connected");
                setIsTwitterConnected(false);
            }
        } catch (error) {
            console.error("❌ Error checking Twitter connection:", error);
            setIsTwitterConnected(false);
        }
    };


    const loadHubData = async () => {
        const companyUser = await userApi.getClientByEmail(user?.email || "")
        console.log("companyUser is ", companyUser)

        const companyTicker = companyUser?.companyTicker || ""
        const companyExchange = companyUser?.companyExchange || ""
        const companyName = companyUser?.companyName || ""
        const interestTickers = companyUser?.interestTickers || []

        setCompanyExchange(companyExchange)
        setCompanyName(companyName)
        setCompanyTicker(companyTicker)

        if (!companyTicker || !companyExchange) {
            setError("Company ticker or exchange is missing.")
            setIsLoading(false)
            return
        }

        try {
            const data = await fetchHubData(companyTicker, companyExchange, companyUser)

            if (!user?.email) {
                throw "User not found"
            }
            if (interestTickers && interestTickers.length > 0) {
                // Filter competitors based on interest tickers
                const filteredCompetitors = data.competitors.filter((comp) => interestTickers.includes(comp.symbol))
                setHubData({
                    ...data,
                    competitors: filteredCompetitors,
                })

                setCurrentTickers(interestTickers)
            } else {
                setHubData(data)
                setCurrentTickers(data.competitors.map((comp) => comp.symbol))
            }
        } catch (err) {
            setError("Failed to load hub data. Please try again later.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        console.log("🔄 Refresh triggered, isTwitterConnected:", isTwitterConnected);
    }, [refresh]);

    useEffect(() => {
        if (user) {
            loadHubData()
        }
    }, [user]) // Added loadHubData to dependencies

    useEffect(() => {
        console.log("🔥 isTwitterConnected updated to:", isTwitterConnected);
    }, [isTwitterConnected]); // ✅ Logs when `isTwitterConnected` changes

    useEffect(() => {
        if (user && user._id) {
            console.log("🟢 Running checkTwitterConnection...");
            checkTwitterConnection()
        }
    }, [user]) // Added loadHubData to dependencies

    if (loading || isLoading) {
        return <div className="container mx-auto p-6">Loading...</div>
    }

    if (error) {
        return <div className="container mx-auto p-6 text-red-500">{error}</div>
    }

    if (!hubData) {
        return <div className="container mx-auto p-6">No data available</div>
    }

    const isVerified = user?.is_verified || false

    interface EarningsHubProps {
        earningsCalendar: EarningsEvent[]
    }

    const groupedEarnings = hubData.earningsCalendar.reduce(
        (acc, event) => {
            if (!acc[event.symbol]) {
                acc[event.symbol] = []
            }
            acc[event.symbol].push(event)
            return acc
        },
        {} as Record<string, EarningsEvent[]>,
    )

    function formatDate(dateStr: string) {
        const date = new Date(dateStr)
        const month = date.toLocaleString("default", { month: "short" }).toUpperCase()
        const day = date.getDate()
        // Get the year as a 2-digit string (e.g., 21 for 2021)
        const year = date.getFullYear().toString().slice(-2) // Gets last 2 digits of the year

        return {
            month,
            day: day.toString(),
            year,
        }
    }

    function formatEps(eps: string) {
        if (!eps) return "-"
        const epsNumber = Number.parseFloat(eps)
        if (isNaN(epsNumber)) return "-" // Return "-" if it's not a valid number

        return epsNumber
    }

    function formatRevenue(revenue: string) {
        if (!revenue) return "-"
        const revenueNumber = Number.parseFloat(revenue)
        if (isNaN(revenueNumber)) return "-" // Return "-" if it's not a valid number

        const revenueInMillions = revenueNumber / 1000000 // Convert revenue to millions
        return revenueInMillions.toFixed(2) + "M" // Round to 2 decimal places and append "M"
    }

    function EarningsEventCard({ event }: { event: EarningsEvent }) {
        const { month, day, year } = formatDate(event.fiscalDateEnding)
        const actualEps = formatEps(event.eps)
        const estimatedEps = formatEps(event.epsEstimated)
        const epsDifference = actualEps !== "-" && estimatedEps !== "-" ? Number(actualEps) - Number(estimatedEps) : null

        return (
            <div className="bg-card rounded-lg p-4 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-primary">
                            {month} {day}, {year}
                        </span>
                    </div>
                    {epsDifference !== null && (
                        <Badge variant={epsDifference >= 0 ? "beat" : "missed"} className="flex items-center gap-1">
                            {epsDifference >= 0 ? (
                                <>
                                    <TrendingUpIcon className="w-3 h-3" />
                                    Beat
                                </>
                            ) : (
                                <>
                                    <TrendingDownIcon className="w-3 h-3" />
                                    Missed
                                </>
                            )}
                        </Badge>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <EarningsMetric label="EPS" actual={actualEps} estimated={estimatedEps} />
                    <EarningsMetric
                        label="Revenue"
                        actual={formatRevenue(event.revenue)}
                        estimated={formatRevenue(event.revenueEstimated)}
                    />
                </div>
            </div>
        )
    }

    function EarningsMetric({ label, actual, estimated }: { label: string; actual: string; estimated: string }) {
        return (
            <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
                <div className="flex justify-between items-baseline">
                    <span className="text-lg font-semibold">{actual}</span>
                    <span className="text-sm text-muted-foreground">Est: {estimated}</span>
                </div>
            </div>
        )
    }

    function EarningsHubSkeleton() {
        return (
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-6 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className={`container mx-auto p-6 space-y-6`}>
            {!isVerified && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 pointer-events-auto">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Account Not Verified</h2>
                        <p>
                            Your account is not verified. Please check your email for instructions or Aiirhub contact support to gain
                            full access.
                        </p>
                    </div>
                </div>
            )}

            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[#1B2559]">Welcome {companyName}</h1>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Competitors Section */}
                <Card className="border-[#1B2559] border">
                    <CardHeader className="flex flex-row items-center justify-between text-[#1B2559]">
                        <CardTitle>Comps and Peers</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="rounded-md border border-input">
                            {hubData.competitors.map((comp, index) => (
                                <div key={comp.symbol} className="flex items-center justify-between p-3 border-b last:border-b-0">
                                    <div className="grid grid-cols-5 gap-4 items-center flex-1">
                                        <div className={`col-span-2 flex items-center gap-2`}>
                                            <div
                                                className={`${tickerColors[index % tickerColors.length]} text-xs font-medium px-2.5 py-1.5 rounded-full`}
                                            >
                                                {comp.symbol}
                                            </div>
                                            <span className="text-sm font-medium">{comp.name}</span>
                                        </div>
                                        <span className="text-sm font-medium">
                                            {comp.price ? `$${comp.price.toFixed(2)}` : "Price not available"}
                                        </span>
                                        <span className={`text-sm font-medium ${comp.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                                            {comp.change >= 0 ? "+" : ""}${Math.abs(comp.change).toFixed(2)}
                                        </span>
                                        <div
                                            className={`flex items-center ${comp.changesPercentage >= 0 ? "text-green-600" : "text-red-600"}`}
                                        >
                                            {comp.changesPercentage >= 0 ? (
                                                <ArrowUpIcon className="h-4 w-4 mr-1" />
                                            ) : (
                                                <ArrowDownIcon className="h-4 w-4 mr-1" />
                                            )}
                                            <span className="text-sm font-medium">{Math.abs(comp.changesPercentage).toFixed(2)}%</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-gray-400 hover:text-gray-500"
                                        onClick={() => handleDeleteTicker(comp.symbol)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Dialog open={isAddingTicker} onOpenChange={setIsAddingTicker}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="w-full flex items-center justify-center gap-2 p-3 text-primary hover:text-primary-dark"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Comp/Peer
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New Competitor</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="ticker">Ticker Symbol</Label>
                                            <Input
                                                id="ticker"
                                                value={newTickerSymbol}
                                                onChange={(e) => setNewTickerSymbol(e.target.value.toUpperCase())}
                                                placeholder="Enter ticker symbol (e.g., AAPL)"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button onClick={handleAddTicker}>Add Ticker</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>

                {/* Earnings Hub Section */}
                <Card className="border-[#1B2559] border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-[#1B2559]">
                            Earnings Hub
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EarningsCalendar events={hubData.earningsCalendar} isLoading={isLoading} />
                    </CardContent>
                </Card>

                {/* News Hub Section */}
                <Card className="border-[#1B2559] border md:col-span-2">
                    <CardHeader className="border-b pb-4">
                        <CardTitle className="flex items-center gap-2 text-[#1B2559]">
                            News Hub
                            {isTwitterConnected ? (
                                <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Twitter Connected</span>
                                </div>
                            ) : (
                                <Button
                                    onClick={handleConnect}
                                    disabled={loading}
                                    className="flex items-center space-x-2"
                                >
                                    <Twitter className="w-5 h-5" />
                                    <span>{loading ? "Connecting..." : "Connect Twitter"}</span>
                                </Button>
                            )}
                            {isLinkedInConnected ? (
                                <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>LinkedIn Connected</span>
                                </div>
                            ) : (
                                <Button
                                    onClick={handleLinkedInConnect}
                                    disabled={loading}
                                    className="flex items-center space-x-2"
                                >
                                    <Linkedin className="w-5 h-5" />
                                    <span>{loading ? "Connecting..." : "Connect LinkedIn"}</span>
                                </Button>
                            )}                            
                        </CardTitle>

                    </CardHeader>
                    <CardContent className="p-4">
                        <Tabs defaultValue="comp-news" className="w-full">
                            <TabsList className="flex h-auto flex-wrap gap-2 border-b pb-2 items-center justify-center">
                                <TabsTrigger value="comp-news">Comp News</TabsTrigger>
                                <TabsTrigger value="company-news">{companyTicker} News</TabsTrigger>
                                <TabsTrigger value="trending-news">Trending News</TabsTrigger>
                                <TabsTrigger value="industry-news">Industry News</TabsTrigger>
                            </TabsList>

                            {[
                                { key: "comp-news", data: hubData.compititionNews },
                                { key: "company-news", data: hubData.companyNews },
                                { key: "trending-news", data: hubData.trendingNews },
                                { key: "industry-news", data: hubData.industryNews },
                            ].map(({ key, data }) => (
                                <TabsContent key={key} value={key} className="pt-4">
                                    <NewsSection data={data} isLoading={isLoading} isTwitterConnected={isTwitterConnected} isLinkedConnected={isLinkedInConnected}/>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function setToastError(message: string) {
    toast.error(message)
}


