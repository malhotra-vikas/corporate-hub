"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Loader2, Send } from "lucide-react"
import type React from "react" // Added import for React

type Message = {
    role: "user" | "assistant"
    content: string
}

interface ChatInterfaceProps {
    onSendMessage: (message: string) => Promise<string>
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onSendMessage }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! How can I help you refine the document?" },
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSend = async () => {
        if (input.trim()) {
            setIsLoading(true)
            const userMessage: Message = { role: "user", content: input }
            setMessages((prevMessages) => [...prevMessages, userMessage])
            setInput("")

            try {
                const response = await onSendMessage(input)
                const assistantMessage: Message = { role: "assistant", content: response }
                setMessages((prevMessages) => [...prevMessages, assistantMessage])
            } catch (error) {
                console.error("Error sending message:", error)
                // Handle error (e.g., show an error message to the user)
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)]">
            <ScrollArea className="flex-grow mb-4 pr-4">
                {messages.map((message, index) => (
                    <div key={index} className={`mb-2 ${message.role === "user" ? "text-right" : "text-left"}`}>
                        <Card
                            className={`inline-block p-2 rounded-lg text-sm ${message.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-secondary-foreground"
                                }`}
                        >
                            {message.content}
                        </Card>
                    </div>
                ))}
            </ScrollArea>
            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    className="flex-grow"
                />
                <Button onClick={handleSend} disabled={isLoading} className="bg-primary text-white">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    )
}

