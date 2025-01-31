"use client"

import { useAuth } from "@/lib/auth-context"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import { useEffect, useState } from "react"
import HubApi from "@/lib/api/hub"
import UserApi from "@/lib/api/user.api"

import { CustomBadge } from "@/components/ui/custom-badge"
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

export default function HubPage() {
    const { user, loading } = useAuth()

    const [hubData, setHubData] = useState<HubData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    let [companyTicker, setCompanyTicker] = useState("")
    let [companyExchange, setCompanyExchange] = useState("")
    let [companyName, setCompanyName] = useState("")

    const userApi = new UserApi()

    async function loadHubData() {
        const companyUser = await userApi.getClientByEmail(user?.email || "")
        console.log("companyUser is ", companyUser)

        const companyTicker = companyUser?.companyTicker || ""
        const companyExchange = companyUser?.companyExchange  || ""
        const companyName = companyUser?.companyName  || ""
        //const userFName = user?.firstName
        //const userLName = user?.lastName

        setCompanyExchange(companyExchange)
        setCompanyName(companyName)
        setCompanyTicker(companyTicker)

        console.log("companyTicker is ", companyTicker)
        console.log("companyExchange is ", companyExchange)

        if (!companyTicker || !companyExchange) {
            setError("Company ticker or exchange is missing.");
            setIsLoading(false);
            return; // Exit if any required value is missing
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
    }, [])

    if (isLoading) {
        return <div className="container mx-auto p-6">Loading...</div>
    }

    if (error) {
        return <div className="container mx-auto p-6 text-red-500">{error}</div>
    }

    if (!hubData) {
        return <div className="container mx-auto p-6">No data available</div>
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-blue-900">Welcome {companyName}</h1>
                <p className="text-sm text-gray-500">Powered by AiirHub</p>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Competitors Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Competitors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Symbol</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Change</TableHead>
                                    <TableHead>% Change</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {hubData.competitors.map((comp) => (
                                    <TableRow key={comp.symbol}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <CustomBadge variant="secondary">{comp.symbol}</CustomBadge>
                                                <span className="text-sm">{comp.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>${comp.price.toFixed(2)}</TableCell>
                                        <TableCell className={comp.change >= 0 ? "text-green-600" : "text-red-600"}>
                                            {comp.change >= 0 ? "+" : ""}
                                            {comp.change.toFixed(2)}
                                        </TableCell>
                                        <TableCell className={comp.percentChange >= 0 ? "text-green-600" : "text-red-600"}>
                                            {comp.percentChange >= 0 ? (
                                                <ArrowUpIcon className="inline w-4 h-4 mr-1" />
                                            ) : (
                                                <ArrowDownIcon className="inline w-4 h-4 mr-1" />
                                            )}
                                            {Math.abs(comp.percentChange).toFixed(2)}%
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Earnings Hub Section */}
                <Card>
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
                <Card className="md:col-span-2">
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
                                        <div className="font-medium">{item.title}</div>
                                    </div>
                                    <div className="w-16 h-16 bg-gray-100 rounded">
                                        <img
                                            src={item.image || "/placeholder.svg"}
                                            alt={item.title}
                                            className="w-full h-full object-cover rounded"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Social Hub Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>SOCIAL HUB</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2 mb-4">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Industry</span>
                            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Investors</span>
                        </div>
                        <div className="space-y-4">
                            {/* Social media posts would go here */}
                            <div className="border rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                    <div>
                                        <div className="font-medium">@investor</div>
                                        <div className="text-sm text-gray-500">2h ago</div>
                                    </div>
                                </div>
                                <p className="text-sm">Market analysis shows strong potential for growth in the tech sector...</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Estimates Hub Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>ESTIMATES HUB</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Est. Date</TableHead>
                                    <TableHead>EPS</TableHead>
                                    <TableHead>Change</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>AAPL</TableCell>
                                    <TableCell>Jan 24</TableCell>
                                    <TableCell>2.11</TableCell>
                                    <TableCell className="text-green-600">+0.05</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>MSFT</TableCell>
                                    <TableCell>Jan 25</TableCell>
                                    <TableCell>1.89</TableCell>
                                    <TableCell className="text-red-600">-0.02</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

