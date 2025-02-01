"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, ArrowUpIcon, ArrowDownIcon, Plus, X } from "lucide-react"
import { useEffect, useState } from "react"
import HubApi from "@/lib/api/hub"
import UserApi from "@/lib/api/user.api"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HubData } from "@/lib/types"

async function fetchHubData(companyTicker: string, companyExchange: string): Promise<HubData> {
    const hubApi = new HubApi()
    try {
        const hubDetails = await hubApi.getCompanyHubDetails(companyTicker, companyExchange)
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

    const userApi = new UserApi()
    const hubApi = new HubApi()

    const handleAddTicker = async () => {
        if (!newTickerSymbol) return
        try {
            // In a real app, this would call your API to add the competitor
            const newCompetitorData = await hubApi.addCompetitor(newTickerSymbol)
            setHubData((prev) => ({
                ...prev!,
                competitors: [...prev!.competitors, newCompetitorData],
            }))
            setNewTickerSymbol("")
            setIsAddingTicker(false)
            toast.success(`Added ${newTickerSymbol} to competitors`)
        } catch (error) {
            toast.error("Failed to add competitor")
        }
    }

    const handleDeleteTicker = async (symbol: string) => {
        try {
            // In a real app, this would call your API to remove the competitor
            await hubApi.removeCompetitor(symbol)
            setHubData((prev) => ({
                ...prev!,
                competitors: prev!.competitors.filter((comp) => comp.symbol !== symbol),
            }))
            toast.success(`Removed ${symbol} from competitors`)
        } catch (error) {
            toast.error("Failed to remove competitor")
        }
    }

    async function loadHubData() {

/*  TODO - Add checks for is logged in
        if (!user) {
            setError("You need to be logged in.");
            setIsLoading(false);

            setToastError("You need to be logged in.");

            return
        }
*/            
        const companyUser = await userApi.getClientByEmail(user?.email || "")
        console.log("companyUser is ", companyUser)

        const companyTicker = companyUser?.companyTicker || ""
        const companyExchange = companyUser?.companyExchange || ""
        const companyName = companyUser?.companyName || ""

        setCompanyExchange(companyExchange)
        setCompanyName(companyName)
        setCompanyTicker(companyTicker)

        if (!companyTicker || !companyExchange) {
            setError("Company ticker or exchange is missing.")
            setIsLoading(false)
            return
        }

        try {
            const data = await fetchHubData(companyTicker, companyExchange)
            setHubData(data)
        } catch (err) {
            setError("Failed to load hub data. Please try again later.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadHubData()
    }, []) // Added loadHubData to dependencies

    if (isLoading) {
        return <div className="container mx-auto p-6">Loading...</div>
    }

    if (error) {
        return <div className="container mx-auto p-6 text-red-500">{error}</div>
    }

    if (!hubData) {
        return <div className="container mx-auto p-6">No data available</div>
    }

    const isVerified = user?.is_verified || false

    console.log("Fetch and read isVerified from user ", user)

    return (
        <div className={`container mx-auto p-6 space-y-6`}>
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-blue-900">Welcome {companyName}</h1>
                <p className="text-sm text-gray-500">Powered by AiirHub</p>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Competitors Section */}
                <Card className="border-primary border">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>COMPS / PEERS</CardTitle>
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
                                        <span className="text-sm font-medium">${comp.price.toFixed(2)}</span>
                                        <span className={`text-sm font-medium ${comp.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                                            {comp.change >= 0 ? "+" : ""}${Math.abs(comp.change).toFixed(2)}
                                        </span>
                                        <div className={`flex items-center ${comp.percentChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                                            {comp.percentChange >= 0 ? (
                                                <ArrowUpIcon className="h-4 w-4 mr-1" />
                                            ) : (
                                                <ArrowDownIcon className="h-4 w-4 mr-1" />
                                            )}
                                            <span className="text-sm font-medium">{Math.abs(comp.percentChange).toFixed(2)}%</span>
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
                <Card className="border-primary border">
                    <CardHeader>
                        <CardTitle>EARNINGS HUB</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-gray-500 mb-4">Based on popular stocks</div>
                        <div className="space-y-4">
                            {hubData.earningsCalendar.map((event, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="text-blue-600 w-12">
                                            {event.date.split(" ")[0]}
                                            <br />
                                            {event.date.split(" ")[1]}
                                        </div>
                                        <div>
                                            <div className="font-medium">{event.company}</div>
                                            <div className="text-sm text-gray-500">{event.time}</div>
                                        </div>
                                    </div>
                                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* News Hub Section */}
                <Card className="md:col-span-2 border-primary border">
                    <CardHeader>
                        <CardTitle>NEWS HUB (Industry-specific)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {hubData.news.map((item, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <div className="text-sm text-gray-500">
                                            {item.source} • {item.time}
                                        </div>
                                        <div className="font-medium">
                                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                                                {item.title}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function setToastError(message: string) {
    toast.error(message)
}

