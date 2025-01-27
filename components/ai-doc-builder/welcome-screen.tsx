"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Mic, MessageSquare } from "lucide-react"

export function WelcomeScreen() {
    const router = useRouter()

    const options = [
        {
            icon: <FileText className="h-8 w-8 text-primary" />,
            title: "Generate Press Release",
            description: "Craft a Professional Announcement Instantly",
            action: "press-release",
        },
        {
            icon: <Mic className="h-8 w-8 text-primary" />,
            title: "Generate Earnings Call Script",
            description: "Prepare Clear Communication for Investors",
            action: "earnings-call",
        },
        {
            icon: <MessageSquare className="h-8 w-8 text-primary" />,
            title: "General Chat",
            description: "Ask Questions from your Bot",
            action: "chat",
        },
    ]

    const handleOptionClick = (action: string) => {
        router.push(`/ai-doc-builder/${action}`)
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center text-primary mb-12">Welcome!</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {options.map((option) => (
                    <Card
                        key={option.action}
                        className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        onClick={() => handleOptionClick(option.action)}
                    >
                        <CardContent className="p-6 flex flex-col items-center text-center min-h-[200px] justify-center space-y-4">
                            <div className="rounded-full bg-primary/5 p-4">{option.icon}</div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg text-primary">{option.title}</h3>
                                <p className="text-sm text-muted-foreground">{option.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

