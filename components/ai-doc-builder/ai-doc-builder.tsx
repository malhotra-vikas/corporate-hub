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

interface AIDocBuilderProps {
  defaultType?: "press_release" | "earnings_statement" | "other"
}

const AIDocBuilder = ({ defaultType = "other" }: AIDocBuilderProps) => {
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
    updatedDocuments[index].type = type || defaultType
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
      // Generate default extracted data
      const newExtractedData = selectedDocuments.reduce(
        (acc, doc) => {
          acc[doc.file.name] = {
            name: doc.file.name,
            headline:
              "LuxUrban Hotels Announces Strategic Joint Venture with Lockwood Development and Bright Hospitality, Projecting $130 Million Revenue Potential and Enhanced Market Presence in NYC",
            subHeadline:
              "LuxUrban Hotels, in partnership with Lockwood and Bright, aims to launch a joint venture expected to generate $36.7 million in annual revenue from two pilot hotels. Projected total revenue could reach $130 million across nine Lux properties, enhancing shareholder value and bolstering financial stability through strategic partnerships and advanced technology.",
            summary:
              "LuxUrban Hotels Inc. (Nasdaq: LUXH), a hospitality company that leases entire hotels on a long-term basis, manages these hotels, and rents out rooms to guests in the properties it leases, has initiated a strategic joint venture (JV) with Lockwood Development Partners LLC and The Bright Hospitality Management, LLC. This collaboration aims to enhance operational efficiencies and profitability through the integration of advanced hotel management technology and the introduction of Lockwood's Vitality brand into the New York City market. The Pilot JV will initially focus on two Lux hotels—Herald Hotel and Tuscany Hotel—laying the groundwork for potentially expanding the partnership to encompass Lux's full portfolio of nine hotels, contingent upon favorable evaluations and necessary approvals. The joint venture represents a critical step in Lux's broader strategy to address existing financial challenges, including substantial arrears with landlords and unions. With an initial investment of $2 million from Lockwood, the parties project a top-line revenue of approximately $36.7 million for the two pilot hotels, and an estimated $130 million for the entire Lux portfolio once fully integrated into the JV framework. The collaboration with Bright is expected to leverage its proprietary technology platform to enhance revenue management and operational efficiencies, potentially increasing overall profits by $42 million for the full portfolio. However, the successful realization of these forecasts will depend on securing requisite consents from stakeholders, including landlords and noteholders. While the proposed JV provides a promising opportunity for LuxUrban Hotels to revitalize its operations and financial standing, it also acknowledges inherent challenges, particularly in obtaining necessary approvals and addressing existing arrears. The cautious optimism surrounding this venture underscores the company's commitment to sustainable growth and stakeholder value enhancement. As Lux moves forward with these initiatives, effective management of stakeholder expectations and clear communication of progress will be vital for fostering confidence among shareholders, investors, and potential partners.",
            keyHighlights:
              "1. Joint Venture Launch: LuxUrban Hotels Inc. is poised to establish a strategic joint venture with Lockwood Development Partners and Bright Hospitality Management, targeting the launch of two pilot hotels in New York City, aligning with Lux's growth strategy in a lucrative market.\n2. Revenue Potential: Projected annual revenue for the two pilot hotels is estimated at $36.7 million, with potential growth to $130 million across all nine Lux properties once fully integrated into the joint venture framework.\n3. Financial Backing: Lockwood's initial investment of $2 million will address current arrears for the pilot hotels, with a total investment expectation of $35 to $42 million, indicating strong financial commitment and confidence in the venture's success.\n4. Operational Innovation: Utilization of Bright's proprietary technology platform aims to enhance operational efficiency and guest experience, positioning Lux for improved profitability with anticipated bottom-line gains of $8.7 million for pilot hotels and $42 million for the full portfolio.\n5. Expansion and Compliance: The joint venture includes a clear roadmap for potential expansion to all Lux hotels, contingent upon necessary consents from stakeholders, emphasizing a cautious yet optimistic approach to growth amid existing challenges.",
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

