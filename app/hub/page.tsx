import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react"

export const metadata: Metadata = {
    title: "IR Hub | CorporateHub",
    description: "Investor Relations Hub - Powered by FactSet",
}

// Mock data for competitors
const competitors = [
    { symbol: "INTC", name: "Intel Corp", price: 21.49, change: 1.82, percentChange: 9.25 },
    { symbol: "PYPL", name: "PayPal Holdings Inc", price: 91.81, change: 2.89, percentChange: 3.25 },
    { symbol: "BIDU", name: "Baidu Inc", price: 82.92, change: 2.19, percentChange: 2.71 },
    { symbol: "QCOM", name: "Qualcomm Inc", price: 164.56, change: 3.13, percentChange: 1.94 },
    { symbol: "GM", name: "General Motors Co", price: 50.97, change: -0.86, percentChange: -1.66 },
    { symbol: "GOOGL", name: "Alphabet Inc Class A", price: 196.0, change: 3.09, percentChange: 1.6 },
]

// Mock data for earnings calendar
const earningsCalendar = [
    { date: "JAN 21", company: "Netflix", time: "Jan 21, 2025, 4:00 PM" },
    { date: "JAN 22", company: "Johnson & Johnson", time: "Jan 22, 2025, 6:45 AM" },
    { date: "JAN 22", company: "Procter & Gamble", time: "Jan 22, 2025" },
    { date: "JAN 22", company: "GE Vernova", time: "Jan 22, 2025, 9:30 AM" },
    { date: "JAN 23", company: "Intuitive", time: "Jan 23, 2025" },
    { date: "JAN 23", company: "Texas Instruments", time: "Jan 23, 2025" },
]

// Mock data for news
const news = [
    {
        source: "Forbes",
        time: "5 hours ago",
        title: "Donald Trump Launches $TRUMP Meme Coin—Token Exceeds $12 Billion Market Cap",
        image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AIIRHUB%20-%20IR%20Hub%20Page%20Mockup-M7FEQO7G1Bk4Y0c7rXesd8x9qcd4Y2.png",
    },
    {
        source: "Forbes",
        time: "3 hours ago",
        title: "TikTok Ban: Apple Issues 'Unprecedented' Response For iPhone Users",
        image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AIIRHUB%20-%20IR%20Hub%20Page%20Mockup-M7FEQO7G1Bk4Y0c7rXesd8x9qcd4Y2.png",
    },
    {
        source: "Axios",
        time: "9 hours ago",
        title: "Behind the Curtain: Ph.D.-level AI breakthrough expected very soon",
        image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AIIRHUB%20-%20IR%20Hub%20Page%20Mockup-M7FEQO7G1Bk4Y0c7rXesd8x9qcd4Y2.png",
    },
]

export default function HubPage() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-blue-900">IR HUB</h1>
                <p className="text-sm text-gray-500">Powered by FACTSET</p>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Competitors Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>COMPETITORS</CardTitle>
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
                                {competitors.map((comp) => (
                                    <TableRow key={comp.symbol}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <span className="w-16 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{comp.symbol}</span>
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
                            {earningsCalendar.map((event, index) => (
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
                            {news.map((item, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <div className="text-sm text-gray-500">
                                            {item.source} • {item.time}
                                        </div>
                                        <div className="font-medium">{item.title}</div>
                                    </div>
                                    <div className="w-16 h-16 bg-gray-100 rounded"></div>
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

