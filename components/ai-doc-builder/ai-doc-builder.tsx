"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Upload, FileText, ChevronLeft, ChevronRight } from "lucide-react"
import { AIExtractedDetails } from "./ai-extracted-details"
import { ChatInterface } from "./chat-interface"
import { PastChatSessions } from "./past-chat-sessions"
import { getFiles, type File } from "@/app/actions/upload-file"

type DocumentType = "press_release" | "earnings_statement" | "shareholder_letter" | "other"

interface UploadedDocument {
  file: File
  type: DocumentType
}

const AIDocBuilder = () => {
  const [selectedDocuments, setSelectedDocuments] = useState<UploadedDocument[]>([])
  const [extractedData, setExtractedData] = useState<{
    [key: string]: {
      name: string
      headline: string
      subHeadline: string
      summary: string
      keyHighlights: string
      ceoQuote: string
    }
  }>({})
  const [isDocumentSelected, setIsDocumentSelected] = useState(false)
  const [vaultFiles, setVaultFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isPastSessionsCollapsed, setIsPastSessionsCollapsed] = useState(false)

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
    setIsLoading(true)
    try {
      const files = await getFiles()
      setVaultFiles(files)
    } catch (error) {
      console.error("Error fetching vault files:", error)
    } finally {
      setIsLoading(false)
    }
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
      // Generate placeholder extracted data
      const newExtractedData = selectedDocuments.reduce(
        (acc, doc) => {
          acc[doc.file.name] = {
            name: "AI-Generated Name for " + doc.file.name,
            headline: "AI-Generated Headline for " + doc.file.name,
            subHeadline: "AI-Generated Sub Headline for " + doc.file.name,
            summary: "AI-Generated Summary for " + doc.file.name,
            keyHighlights:
              "- AI-Generated Key Highlight 1\n- AI-Generated Key Highlight 2\n- AI-Generated Key Highlight 3",
            ceoQuote: "AI-Generated CEO Quote for " + doc.file.name,
          }
          return acc
        },
        {} as typeof extractedData,
      )
      setExtractedData(newExtractedData)
    }
  }

  const togglePastSessions = () => {
    setIsPastSessionsCollapsed(!isPastSessionsCollapsed)
  }

  const handleUpdateExtractedData = (fileName: string, field: string, value: string) => {
    setExtractedData((prev) => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        [field]: value,
      },
    }))
  }

  if (!isDocumentSelected) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">AI Document Builder</CardTitle>
            <CardDescription>Select documents to analyze and build with AI assistance</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload Documents</TabsTrigger>
                <TabsTrigger value="vault">Select from Vault</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="file-upload">Upload source documents</Label>
                  <Input id="file-upload" type="file" multiple onChange={handleFileUpload} />
                </div>
                {selectedDocuments.length > 0 && (
                  <div className="space-y-4">
                    {selectedDocuments.map((doc, index) => (
                      <Card key={index} className="bg-gray-50">
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-4">
                            <FileText className="h-6 w-6 text-primary" />
                            <span>{doc.file.name}</span>
                          </div>
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
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="vault" className="space-y-4">
                <Button onClick={handleVaultSelection} disabled={isLoading} className="bg-primary text-white">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading Vault Documents
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Load Vault Documents
                    </>
                  )}
                </Button>
                {vaultFiles.length > 0 && (
                  <div className="space-y-2">
                    {vaultFiles.map((file) => (
                      <Card key={file.id} className="bg-gray-50">
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-4">
                            <Checkbox
                              id={file.id}
                              onCheckedChange={(checked) => handleVaultFileSelection(file, checked as boolean)}
                            />
                            <Label
                              htmlFor={file.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {file.name}
                            </Label>
                          </div>
                          <span className="text-sm text-muted-foreground">{file.category}</span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        {selectedDocuments.length > 0 && (
          <Button onClick={handleContinue} className="w-full bg-primary text-white">
            Continue with {selectedDocuments.length} selected document{selectedDocuments.length > 1 ? "s" : ""}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="h-[calc(100vh-2rem)] bg-white shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl text-primary">AI Document Analysis</CardTitle>
          <CardDescription>Review AI-extracted details and refine with chat assistance</CardDescription>
        </CardHeader>
        <CardContent className="h-[calc(100%-4rem)] p-0">
          <div className="flex h-full">
            <div
              className={`transition-all duration-300 ease-in-out ${isPastSessionsCollapsed ? "w-10" : "w-1/4"
                } border-r border-gray-200`}
            >
              <div className="flex items-center justify-between p-2 bg-gray-50">
                <h3 className={`text-lg font-semibold text-primary ${isPastSessionsCollapsed ? "hidden" : "block"}`}>
                  Past Sessions
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePastSessions}
                  className="h-8 w-8 text-primary"
                  aria-label={isPastSessionsCollapsed ? "Expand past sessions" : "Collapse past sessions"}
                >
                  {isPastSessionsCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
              </div>
              <div className={isPastSessionsCollapsed ? "hidden" : "block h-[calc(100%-3rem)] overflow-hidden"}>
                <PastChatSessions />
              </div>
            </div>
            <div
              className={`transition-all duration-300 ease-in-out ${isPastSessionsCollapsed ? "w-[calc(100%-2.5rem)]" : "w-3/4"
                } flex`}
            >
              <div className="w-1/2 border-r border-gray-200 p-4 overflow-hidden">
                <h3 className="text-lg font-semibold mb-2 text-primary">AI Extracted Details</h3>
                <AIExtractedDetails
                  documents={selectedDocuments}
                  extractedData={extractedData}
                  onUpdateExtractedData={handleUpdateExtractedData}
                />
              </div>
              <div className="w-1/2 p-4 overflow-hidden bg-gray-50">
                <h3 className="text-lg font-semibold mb-2 text-primary">Chat Assistance</h3>
                <ChatInterface />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AIDocBuilder

