"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AIExtractedDetails } from "./ai-extracted-details"
import { ChatInterface } from "./chat-interface"
import { getFiles, type File } from "@/app/actions/upload-file"

type DocumentType = "press_release" | "earnings_statement" | "shareholder_letter" | "other"

interface UploadedDocument {
  file: File
  type: DocumentType
}

const AIDocBuilder = () => {
  const [selectedDocuments, setSelectedDocuments] = useState<UploadedDocument[]>([])
  const [isDocumentSelected, setIsDocumentSelected] = useState(false)
  const [vaultFiles, setVaultFiles] = useState<File[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newDocuments = Array.from(event.target.files).map((file) => ({
        file: {
          id: Math.random().toString(),
          name: file.name,
          type: file.type,
          size: file.size,
          uploadDate: new Date(),
          category: "other",
        },
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

  const handleVaultSelection = async () => {
    const files = await getFiles()
    setVaultFiles(files)
  }

  const handleVaultFileSelection = (file: File, isSelected: boolean) => {
    if (isSelected) {
      setSelectedDocuments([...selectedDocuments, { file, type: file.category as DocumentType }])
    } else {
      setSelectedDocuments(selectedDocuments.filter((doc) => doc.file.id !== file.id))
    }
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
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="vault">
            <div className="space-y-4">
              <Button onClick={handleVaultSelection}>Load Vault Documents</Button>
              {vaultFiles.length > 0 && (
                <div className="space-y-2">
                  {vaultFiles.map((file) => (
                    <div key={file.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={file.id}
                        onCheckedChange={(checked) => handleVaultFileSelection(file, checked as boolean)}
                      />
                      <Label htmlFor={file.id}>
                        {file.name} ({file.category})
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        {selectedDocuments.length > 0 && (
          <Button onClick={handleContinue} className="mt-4">
            Continue
          </Button>
        )}
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

