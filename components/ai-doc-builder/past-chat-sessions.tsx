import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, MessageSquare } from "lucide-react"

interface ChatSession {
    id: string
    title: string
    date: string
    preview: string
}

interface PastChatSessionsProps {
    onSelectSession: (sessionId: string) => void
}

export const PastChatSessions: React.FC<PastChatSessionsProps> = ({ onSelectSession }) => {
    // This would typically come from a database or API
    const [sessions, setSessions] = useState<ChatSession[]>([
        {
            id: "1",
            title: "Q4 Earnings Report Analysis",
            date: "2025-01-20",
            preview: "Discussed key financial metrics and market trends...",
        },
        {
            id: "2",
            title: "Annual Shareholder Letter Draft",
            date: "2025-01-18",
            preview: "Reviewed company achievements and future outlook...",
        },
        {
            id: "3",
            title: "Press Release: New Product Launch",
            date: "2025-01-15",
            preview: "Refined messaging for upcoming product announcement...",
        },
    ])

    const [selectedSession, setSelectedSession] = useState<string | null>(null)

    const handleSelectSession = (sessionId: string) => {
        setSelectedSession(sessionId)
        onSelectSession(sessionId)
    }

    return (
        <ScrollArea className="h-[calc(100vh-16rem)]">
            {sessions.map((session) => (
                <Card
                    key={session.id}
                    className={`mb-4 cursor-pointer transition-colors ${selectedSession === session.id ? "bg-secondary" : "bg-white"
                        }`}
                    onClick={() => handleSelectSession(session.id)}
                >
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-[#1B2559]">{session.title}</h3>
                            <span className="text-sm text-muted-foreground">{session.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{session.preview}</p>
                        <div className="flex justify-between items-center">
                            <Button variant="ghost" size="sm" className="px-0 text-[#1B2559]">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                View Chat
                            </Button>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </ScrollArea>
    )
}

