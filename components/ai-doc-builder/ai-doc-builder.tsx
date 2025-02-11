"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Upload, FileText, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { AIExtractedDetails } from "./ai-extracted-details"
import { ChatInterface } from "./chat-interface"
import { PastChatSessions } from "./past-chat-sessions"

import { type File } from "@/app/actions/upload-file"
import { useAuth } from "@/lib/auth-context"
import UserApi from "@/lib/api/user.api"
import VaultApi from "@/lib/api/vault.api"
import { toast } from "react-toastify"
import { VaultFile } from "@/lib/types"
import { useRouter } from "next/router"



type DocumentType = "press_release" | "earnings_statement" | "shareholder_letter" | "other"

interface UploadedDocument {
  file: File
  type: DocumentType
  file_id?: string
}

interface AIDocBuilderProps {
  defaultType?: "press_release" | "earnings_statement" | "other"
}

const AIDocBuilder = ({ defaultType = "other" }: AIDocBuilderProps) => {
  const [selectedDocuments, setSelectedDocuments] = useState<UploadedDocument[]>([])
  const [activeTab, setActiveTab] = useState<'upload' | 'vault' | 'paste'>('upload') // Track active tab
  const [documentContent, setDocumentContent] = useState<string>('') // Store pasted content
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
  let [vaultFiles, setVaultFiles] = useState<VaultFile[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [isPastSessionsCollapsed, setIsPastSessionsCollapsed] = useState(true)
  const [isExtractingData, setIsExtractingData] = useState(false)
  let [companyUser, setCompanyUser] = useState()

  const { user, loading } = useAuth()

  if (!user) return;


  const userApi = new UserApi()
  const vaultApi = new VaultApi()

  function getQuarter(date: Date): string {
    const month = date.getMonth()
    const year = date.getFullYear()
    const quarter = Math.floor(month / 3) + 1
    return `${year}-Q${quarter}`
  }

  // Define the function to fetch files
  async function getFiles(): Promise<{ files: VaultFile[] }> {
    // Check if the user is defined
    if (!user) {
      throw new Error("User is not authenticated");
    }

    try {
      // Fetch the company user using the user's email
      const companyUser = await userApi.getClientByEmail(user?.email || "");

      console.log("User is ", user)


      // If companyUser is not found or doesn't have an ID, throw an error
      if (!companyUser?._id) {
        throw new Error("Company user not found");
      }

      // Fetch the files for the specific company user based on their _id
      const userFiles = await vaultApi.getSpecificFiles({ user_id: companyUser._id });

      console.log("userFiles  is ", userFiles.data)

      // Optionally filter the files if you need, right now we return them as is
      const filteredFiles = userFiles.data; // Modify filtering logic if necessary

      // Return the files
      return {
        files: filteredFiles,
      };
    } catch (error) {
      console.error("Error fetching files:", error);
      throw new Error("Failed to fetch files");
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      companyUser = await userApi.getClientByEmail(user?.email || "")
    }

    if (event.target.files) {
      const files = Array.from(event.target.files)
      for (const file of files) {
        try {
          const formData = new FormData()
          formData.append("originalName", file.name)
          formData.append("serverFileName", file.name)
          formData.append("files", file)

          // Assuming you have a way to select or determine the category
          const category: string = "news" // This should be dynamically set based on user input or file type
          formData.append("category", category)

          if (companyUser && companyUser._id) {
            formData.append("user_id", companyUser._id)
          } else {
            throw new Error("User not authenticated")
          }

          const tagsData = [
            {
              [file.name]: {
                docType: category,
                useFull: "Both",
              },
            },
          ]
          formData.append("tags", JSON.stringify(tagsData))

          console.log("Starting file upload process...")
          console.log("tagsData is ", tagsData)

          // Log the FormData entries
          for (const [key, value] of formData.entries()) {
            console.log(key, value)
          }

          const response = await vaultApi.uploadDocuments(formData)
          console.log("File uploaded successfully:", response)

          const newDocument: UploadedDocument = {
            file: file,
            type: category,
          }
          //setSelectedDocuments((prev) => [...prev, newDocument])
          setActiveTab('vault') // Switch to "Select from Vault" tab after document upload
          toast.success(`File ${file.name} uploaded successfully`)
        } catch (error) {
          console.error("Error uploading file:", error)
          toast.error(`Failed to upload file ${file.name}`)
        }
      }
    }
  }

  // Triggered when user submits (done typing)
  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleFileUploadFromPaste(documentContent) // Submit the document content
    // You can add additional logic after submitting, like clearing the text area or moving to the next step
  }

  const handleFileUploadFromPaste = async (content: string) => {
    setDocumentContent(content)

    if (user) {
      companyUser = await userApi.getClientByEmail(user?.email || "")
    }

    const response = await vaultApi.createFileFromText({ fileName: "UserText Input for PR", fileContent: content, user_id: companyUser._id })

    //setSelectedDocuments((prev) => [...prev, newDocument])
    setActiveTab('vault') // Switch to "Select from Vault" tab after document upload
    toast.success(`File uploaded successfully`)
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
      console.log("files  are befoere setVaultFiles ", files)
      vaultFiles = files.files

      setVaultFiles(files.files)
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

  const uploadFile = async (userId: string, file: File, category: string) => {
    const formData = new FormData()
    formData.append("originalName", file.name)
    formData.append("serverFileName", file.name)
    formData.append("files", file as Blob)
    formData.append("category", category)
    formData.append("user_id", userId)

    const filesTag: any = []
    const tempObj = {
      [file.name]: {
        docType: category,
        useFull: "Both",
      },
    }
    filesTag?.push(tempObj)

    formData.append("tags", JSON.stringify(filesTag))

    try {
      const response = await vaultApi.uploadDocuments(formData)
      return response
    } catch (error) {
      console.error("Error Response:", error.response.data)
      throw error
    }
  }

  const handleContinue = async () => {
    console.log("in handle continue")

    // Fetch the company user using the user's email
    const companyUser = await userApi.getClientByEmail(user?.email || "");

    console.log("companyUser is ", companyUser)

    setCompanyUser(companyUser)
    
    if (selectedDocuments.length > 0) {

      console.log("selectedDocuments is ", selectedDocuments)
      setIsDocumentSelected(true)

      if (!companyUser) {
        console.error("User not authenticated")
        toast.error("Please log in to upload documents")
        return
      }

      let extractedTextForSelectedDocuments = ''

      for (const doc of selectedDocuments) {
        try {
          const file = doc.file as File

          if (file && file._id) { // File is fetched from the Vault
            const extractedText = file.extractedText
            extractedTextForSelectedDocuments = extractedText + extractedTextForSelectedDocuments
          }

          if (file && !file._id) { // File is new. Read the doc from the Vault
            console.log("New file is ", file)

            const extractedText = file.extractedText
            extractedTextForSelectedDocuments = extractedText + extractedTextForSelectedDocuments
          }

          console.log("extractedTextForSelectedDocuments = ", extractedTextForSelectedDocuments)

        } catch (error) {
          console.error("Error with file:", error)
        }
      }

      setIsExtractingData(true)

      
/*
      // Generate default extracted data
      const newExtractedData = selectedDocuments.reduce(
        (acc, doc) => {
          acc[doc.file.name] = {
            name: doc.file.name,
            headline:
              "Tetete  Joint Venture with Lockwood Development and Bright Hospitality, Projecting $130 Million Revenue Potential and Enhanced Market Presence in NYC",
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
      */
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

  const handleRemoveDocument = (index: number) => {
    const updatedDocuments = selectedDocuments.filter((_, i) => i !== index)
    setSelectedDocuments(updatedDocuments)
  }

  if (!isDocumentSelected) {

    return (
      <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">AI Document Builder</CardTitle>
        <CardDescription>Upload, select, or paste your documents for analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "upload" | "vault" | "paste")}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Documents</TabsTrigger>
            <TabsTrigger value="vault">Select from Vault</TabsTrigger>
            <TabsTrigger value="paste">Paste Document</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="file-upload" className="text-lg font-semibold">
                Upload source documents
              </Label>
              <Input id="file-upload" type="file" multiple onChange={handleFileUpload} className="cursor-pointer" />
            </div>
          </TabsContent>

          <TabsContent value="paste" className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="paste-doc" className="text-lg font-semibold">
                Paste source documents
              </Label>
              <textarea
                id="paste-doc"
                rows={8}
                className="w-full p-2 border border-gray-300 rounded-md resize-vertical"
                placeholder="Paste your document content here..."
                value={documentContent}
                onChange={(e) => setDocumentContent(e.target.value)}
              />
              <Button onClick={handlePasteSubmit} className="mt-2 bg-primary">
                Submit Document
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="vault" className="space-y-4">
            <Button onClick={handleVaultSelection} disabled={isLoading} className="w-full bg-primary text-white">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading Vault Documents
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Reload Vault Documents
                </>
              )}
            </Button>
            {vaultFiles.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {vaultFiles.map((file) => (
                  <Card key={file._id} className="bg-gray-50">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          id={file._id}
                          onCheckedChange={(checked) => handleVaultFileSelection(file, checked as boolean)}
                        />
                        <Label
                          htmlFor={file._id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {file.originalName}
                        </Label>
                      </div>
                      <span className="text-sm text-muted-foreground">{file.uploadedDate}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {selectedDocuments.length > 0 && (
          <Button onClick={handleContinue} className="mt-4 w-full bg-primary text-white">
            Continue with {selectedDocuments.length} selected document{selectedDocuments.length > 1 ? "s" : ""}
          </Button>
        )}
      </CardContent>
    </Card>
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
                  //extractedData={extractedData}
                  onUpdateExtractedData={handleUpdateExtractedData}
                  isLoading={true}
                  company={companyUser}
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



