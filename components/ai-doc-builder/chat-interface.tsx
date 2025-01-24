"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
    role: "user" | "assistant"
    content: string
}

export const ChatInterface = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! How can I help you refine the document?" },
    ])
    const [input, setInput] = useState("")

    const handleSend = () => {
        if (input.trim()) {
            setMessages([...messages, { role: "user", content: input }])
            // Simulating AI response
            setTimeout(() => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        role: "assistant",
                        content: "I've noted your input. How else can I assist you with the document?",
                    },
                ])
            }, 1000)
            setInput("")
        }
    }

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-4">Chat with AI Assistant</h2>
            <ScrollArea className="flex-grow mb-4 border rounded-md p-4">
                {messages.map((message, index) => (
                    <div key={index} className={`mb-2 ${message.role === "user" ? "text-right" : "text-left"}`}>
                        <span
                            className={`inline-block p-2 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                                }`}
                        >
                            {message.content}
                        </span>
                    </div>
                ))}
            </ScrollArea>
            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                />
                <Button onClick={handleSend}>Send</Button>
            </div>
        </div>
    )
}

