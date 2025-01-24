import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, MessageSquare } from "lucide-react"

interface ChatSession {
  id: string
  title: string
  date: string
  preview: string
}

export const PastChatSessions = () => {
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

  return (
    <Card className="h-[600px] md:h-[calc(100vh-12rem)] flex flex-col">
      <CardHeader>
        <CardTitle>Past Chat Sessions</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className={`mb-4 cursor-pointer transition-colors ${selectedSession === session.id ? "bg-muted" : ""}`}
              onClick={() => setSelectedSession(session.id)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{session.title}</h3>
                  <span className="text-sm text-muted-foreground">{session.date}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{session.preview}</p>
                <div className="flex justify-between items-center">
                  <Button variant="ghost" size="sm" className="px-0">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Chat
                  </Button>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

