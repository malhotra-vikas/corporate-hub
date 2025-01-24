"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AIExtractedDetails } from "./ai-extracted-details"
import { ChatInterface } from "./chat-interface"

type DocumentType = "press_release" | "earnings_statement" | "shareholder_letter" | "other"

interface UploadedDocument {
  file: File
  type: DocumentType
}

const AIDocBuilder = () => {
  const [selectedDocuments, setSelectedDocuments] = useState<UploadedDocument[]>([])
  const [isDocumentSelected, setIsDocumentSelected] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newDocuments = Array.from(event.target.files).map((file) => ({
        file,
        type: "other" as DocumentType,
      }))
      setSelectedDocuments([...selectedDocuments, ...newDocuments])
    }
  }

  const handleDocumentTypeChange = (index: number, type: DocumentType) => {
    const updatedDocuments = [...selectedDocuments]
    updatedDocuments[index].type = type
    setSelectedDocuments(updatedDocuments)
  }

  const handleVaultSelection = () => {
    // Simulating vault selection
    setIsDocumentSelected(true)
  }

  const handleContinue = () => {
    if (selectedDocuments.length > 0) {
      setIsDocumentSelected(true)
    }
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
              {selectedDocuments.length > 0 && (
                <div className="space-y-4">
                  {selectedDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <p className="flex-grow">{doc.file.name}</p>
                      <Select
                        value={doc.type}
                        onValueChange={(value: DocumentType) => handleDocumentTypeChange(index, value)}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="press_release">Press Release</SelectItem>
                          <SelectItem value="earnings_statement">Earnings Statement</SelectItem>
                          <SelectItem value="shareholder_letter">Shareholder Letter</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                  <Button onClick={handleContinue}>Continue</Button>
                </div>
              )}
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

