"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIExtractedDetails } from "./ai-extracted-details"
import { ChatInterface } from "./chat-interface"

const AIDocBuilder = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [isDocumentSelected, setIsDocumentSelected] = useState(false)

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(Array.from(event.target.files))
            setIsDocumentSelected(true)
        }
    }

    const handleVaultSelection = () => {
        // Simulating vault selection
        setIsDocumentSelected(true)
    }

    if (!isDocumentSelected) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">AI Doc Builder</h1>
                <Tabs defaultValue="upload">
                    <TabsList>
                        <TabsTrigger value="upload">Upload Documents</TabsTrigger>
                        <TabsTrigger value="vault">Select from Vault</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload">
                        <div className="space-y-4">
                            <Label htmlFor="file-upload">Upload source documents</Label>
                            <Input id="file-upload" type="file" multiple onChange={handleFileUpload} />
                            <div>
                                {selectedFiles.map((file, index) => (
                                    <p key={index}>{file.name}</p>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="vault">
                        <div className="space-y-4">
                            <p>Select documents from your vault</p>
                            <Button onClick={handleVaultSelection}>Open Vault</Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            <div className="w-1/2 border-r p-4 overflow-auto">
                <AIExtractedDetails />
            </div>
            <div className="w-1/2 p-4">
                <ChatInterface />
            </div>
        </div>
    )
}

export default AIDocBuilder

