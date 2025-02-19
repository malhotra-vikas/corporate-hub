"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Upload, ChevronLeft, ChevronRight, Loader, FileText, UploadIcon } from "lucide-react"
import { AIExtractedDetails } from "./ai-extracted-details"
import type { ExtractedData } from "./ai-extracted-details"

import { ChatInterface } from "./chat-interface"
import { PastChatSessions } from "./past-chat-sessions"

import type { File } from "@/app/actions/upload-file"
import { useAuth } from "@/lib/auth-context"
import UserApi from "@/lib/api/user.api"
import VaultApi from "@/lib/api/vault.api"
import { toast } from "react-toastify"
import type { VaultFile } from "@/lib/types"
import PressReleasePDF from "./PressReleasePDF"

import { pdf } from "@react-pdf/renderer"
import OpenAiApi from "@/lib/api/openApi.api"

type DocumentType = "press_release" | "earnings_statement" | "shareholder_letter" | "other"

const openAiApi = new OpenAiApi();

interface UploadedDocument {
  file: File
  type: DocumentType
  file_id?: string
}

interface AIDocBuilderProps {
  defaultType?: "press_release" | "earnings_statement" | "other"
}

interface Message {
  role: string
  content: string
}

interface ChatData {
  messages: Message[]
  chatId: string
}

const AIDocBuilder = ({ defaultType = "other" }: AIDocBuilderProps) => {
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [chatData, setChatData] = useState<ChatData>({ messages: [], chatId: "" })

  const [selectedDocuments, setSelectedDocuments] = useState<UploadedDocument[]>([])
  const [activeTab, setActiveTab] = useState<"upload" | "vault" | "paste">("upload") // Track active tab
  const [documentContent, setDocumentContent] = useState<string>("") // Store pasted content
  const [documentName, setDocumentName] = useState<string>("") // Store pasted content
  let [selectedSessionId, setSelectedSessionId] = useState<string>("") // Store pasted content

  const [extractedData, setExtractedData] = useState<{
    [key: string]: {
      name: string
      headline: string
      subHeadline: string
      summary: string
      keyHighlights: string
      ceoQuote: string
      extractedText: string
    }
  }>({})

  const [isDocumentSelected, setIsDocumentSelected] = useState(false)
  let [vaultFiles, setVaultFiles] = useState<VaultFile[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [isPastSessionsCollapsed, setIsPastSessionsCollapsed] = useState(false)
  const [isChatInterfaceCollapsed, setIsChatInterfaceCollapsed] = useState(false)

  const [isExtractingData, setIsExtractingData] = useState(false)
  let [companyUser, setCompanyUser] = useState()
  const [isDataFetched, setIsDataFetched] = useState(false) // Added state variable

  const { user, loading } = useAuth()

  const [panelWidth, setPanelWidth] = useState(60); // Default: 60% AI Details, 40% Chat
  const isResizing = useRef(false);

  const handleVaultSelection = async () => {
    setIsLoading(true)
    try {
      const files = await getFiles()
      console.log("files  are befoere setVaultFiles ", files)
      vaultFiles = files.files

      // Filter files that are either .docx or .pdf
      const filteredFiles = files.files.filter(
        (file) => file.originalName.endsWith(".docx") || file.originalName.endsWith(".pdf") || file.docType === "8-K",
      )

      console.log("filteredFiles are ", filteredFiles)
      // Sort by last modified date (assuming file object has a `lastModified` field)
      const sortedFiles = filteredFiles.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )

      console.log("sortedFiles are ", sortedFiles)

      setVaultFiles(sortedFiles)
    } catch (error) {
      console.error("Error fetching vault files:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoading && user && !isDataFetched && activeTab === 'vault') {
      handleVaultSelection(); // Auto-fetch vault docs
    }
  }, [user, activeTab]);

  if (!user) return

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
      throw new Error("User is not authenticated")
    }

    try {
      // Fetch the company user using the user's email
      const companyUser = await userApi.getClientByEmail(user?.email || "")

      console.log("User is ", user)

      // If companyUser is not found or doesn't have an ID, throw an error
      if (!companyUser?._id) {
        throw new Error("Company user not found")
      }

      // Fetch the files for the specific company user based on their _id
      const userFiles = await vaultApi.getSpecificFiles({ user_id: companyUser._id })

      console.log("userFiles  is ", userFiles.data)

      // Optionally filter the files if you need, right now we return them as is
      const filteredFiles = userFiles.data // Modify filtering logic if necessary

      // Return the files
      return {
        files: filteredFiles,
      }
    } catch (error) {
      console.error("Error fetching files:", error)
      throw new Error("Failed to fetch files")
    }
  }

  const updateParentExtractedData = (data: { [key: string]: ExtractedData }) => {
    setExtractedData(data)
    setIsDataFetched(true)
  }

  const handleMessagesGenerated = (messages: Message[], chatId) => {
    setChatMessages(messages, chatId)
  }

  async function assessIntent(userMessage: string) {
    const interactionTypePrompt =
      "Is the user asking a follow-up question about the 'CEO Quote', 'Summary', 'Headline' or 'Key-Highlights'  of the press release? If yes, identify which one. Just just the identified type ";

    const system_prompt =
      "You are a high-quality IR/PR professional specializing in crafting impactful press releases for companies across various industries.";

    const interactionTypeResponse = await openAiApi.completion(
      [
        { role: "system", content: system_prompt },
        { role: "user", content: userMessage },
      ],
      interactionTypePrompt,
    );

    const interactionType =
      interactionTypeResponse?.data.choices[0].message.content;
    console.log("interactionType is ", interactionType);

    return interactionType;
  }


  async function processMessage(prompt: string, userMessage: string) {
    const system_prompt =
      "You are a high-quality IR/PR professional specializing in crafting impactful press releases for companies across various industries.";

    console.log("Sending requests to OpenAI APIs");

    const responseObject = await openAiApi.completion(
      [
        { role: "system", content: system_prompt },
        { role: "user", content: userMessage },
      ],
      prompt,
    );

    const aiResponse = responseObject?.data.choices[0].message.content;
    console.log("aiResponse is ", aiResponse);

    return aiResponse;
  }

  const handleSendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;
    setIsLoading(true);

    try {
      const intent = await assessIntent(userMessage);

      console.log("Old extracted data is ", extractedData)
      const dynamicKey = Object.keys(extractedData)[0] // Get the first key dynamically
      const data = extractedData[dynamicKey] // Access data for that key

      if (intent === "CEO Quote") {
        console.log("CEO Quote needs to be updated");

        let prompt = `Update the CEO Quote based on user's message: ${userMessage}. 
        The earlier CEO Quote was ${data.ceoQuote}. 
        The extracted text for the news is ${data.extractedText}
        Return only the quote and nothing else. Do not add any formatting.
        `;

        console.log("prompt is ", prompt)

        let aiResponse = await processMessage(prompt, userMessage);
        aiResponse = "ceoQuote" + "--:--" + aiResponse

        console.log("aiResponse is ", aiResponse);

        return `${aiResponse}`
      } else if (intent === "Summary") {
        console.log("Summary needs to be updated");

        let prompt = `Update the Summary based on user's message: ${userMessage}. 
        The earlier Summary was ${data.summary}.
        The extracted text for the news is ${data.extractedText}
        Return only the summary and nothing else. Do not add any formatting.
        `;

        let aiResponse = await processMessage(prompt, userMessage);
        aiResponse = "summary" + "--:--" + aiResponse

        console.log("aiResponse is ", aiResponse);
        return `${aiResponse}`

      } else if (intent === "Headline") {
        let prompt = `Update the Headline based on user's message: ${userMessage}. 
        The earlier Headline was ${data.headline}. 
        The extracted text for the news is ${data.extractedText}
        Return only the headline and nothing else. Do not add any formatting.
        `;

        let aiResponse = await processMessage(prompt, userMessage);
        aiResponse = "headline" + "--:--" + aiResponse

        console.log("aiResponse is ", aiResponse);

        return `${aiResponse}`

      } else if (intent === "Key-Highlights") {
        let prompt = `Update the Key-Highlights based on user's message: ${userMessage}. 
        The earlier Key-Highlights was ${data.keyHighlights}. 
        The extracted text for the news is ${data.extractedText}
        Return only the Key-Highlights and nothing else. Do not add any formatting.
        `;

        let aiResponse = await processMessage(prompt, userMessage);
        aiResponse = "keyHighlights" + "--:--" + aiResponse

        console.log("aiResponse is ", aiResponse);
        return `${aiResponse}`

      }

    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
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
          setActiveTab("vault") // Switch to "Select from Vault" tab after document upload
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
    handleFileUploadFromPaste(documentContent, documentName) // Submit the document content
    // You can add additional logic after submitting, like clearing the text area or moving to the next step
  }

  const handleFileUploadFromPaste = async (content: string, name: string) => {
    setDocumentContent(content)

    if (user) {
      companyUser = await userApi.getClientByEmail(user?.email || "")
    }

    const response = await vaultApi.createFileFromText({
      fileName: documentName,
      fileContent: content,
      user_id: companyUser._id,
      docType: "Paste-News"
    })

    //setSelectedDocuments((prev) => [...prev, newDocument])
    setActiveTab("vault") // Switch to "Select from Vault" tab after document upload
    toast.success(`File uploaded successfully`)
  }

  const handleDocumentTypeChange = (index: number, type: DocumentType) => {
    const updatedDocuments = [...selectedDocuments]
    updatedDocuments[index].type = type || defaultType
    setSelectedDocuments(updatedDocuments)
  }

  const handleUpdateField = (field: string, value: string) => {

    console.log("REcieved a command to update the fields ", field)
    console.log("REcieved a command to update the field with value ", value)

    if (!extractedData || Object.keys(extractedData).length === 0) {
      console.warn("No documents found in extractedData. Cannot update.");
      return;
    }

    // ✅ Find the first available documentId
    const firstDocumentId = Object.keys(extractedData)[0];

    setExtractedData((prevData) => ({
      ...prevData,
      [firstDocumentId]: {
        ...(prevData[firstDocumentId] || {}), // ✅ Ensure document exists
        [field]: value, // ✅ Update only the specified field
      },
    }));

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
    const companyUser = await userApi.getClientByEmail(user?.email || "")

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

      let extractedTextForSelectedDocuments = ""

      for (const doc of selectedDocuments) {
        try {
          const file = doc.file as File

          if (file && file._id) {
            // File is fetched from the Vault
            const extractedText = file.extractedText
            extractedTextForSelectedDocuments = extractedText + extractedTextForSelectedDocuments
          }

          if (file && !file._id) {
            // File is new. Read the doc from the Vault
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
    }
  }

  const togglePastSessions = () => {
    setIsPastSessionsCollapsed(!isPastSessionsCollapsed)
  }

  const toggleChatInterface = () => {
    setIsChatInterfaceCollapsed(!isChatInterfaceCollapsed)
  }

  const handleUpdateExtractedData = (fileName: string, field: string, value: string) => {
    setExtractedData((prev) => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        [field]: value,
      },
    }))

    handleUpdateField(field, value) // Update local state as well
  }

  const handleRemoveDocument = (index: number) => {
    const updatedDocuments = selectedDocuments.filter((_, i) => i !== index)
    setSelectedDocuments(updatedDocuments)
  }

  if (!isDocumentSelected) {
    return (
      <div className="flex">
        {/* Past Sessions Panel */}
        <div
          className={`transition-all duration-300 ease-in-out ${isPastSessionsCollapsed ? "w-10" : "w-1/4"
            } border-r border-gray-200`}
        >
          <div className="flex items-center justify-between p-2 bg-gray-50">
            <h3 className={`text-lg font-semibold text-[#1B2559] ${isPastSessionsCollapsed ? "hidden" : "block"}`}>
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
            <PastChatSessions onSelectSession={(selectedSessionId) => console.log("Selected session:", selectedSessionId)} />
          </div>
        </div>

        {/* AI Document Builder Panel */}
        <Card className="w-full mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">AI Press Release Builder</CardTitle>
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
                <TabsTrigger value="paste">Paste Text</TabsTrigger>
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
                  <Label htmlFor="paste-doc-name" className="text-lg font-semibold">
                    Document Name
                  </Label>
                  <input
                    id="paste-doc-name"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter document name..."
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                  />

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
                <Button
                  onClick={handleVaultSelection}
                  disabled={isLoading}
                  className="w-full bg-[#1B2559] text-white hover:bg-[#0196FD] transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading Vault Documents
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Refresh Vault Documents
                    </>
                  )}
                </Button>
                {vaultFiles.length > 0 && (
                  <div className="space-y-2 max-h-[40rem] overflow-y-auto">
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
      </div>
    )
  }


  const generatePDF = async () => {
    setIsLoading(true)

    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    console.log("extractedData os ", extractedData)
    const dynamicKey = Object.keys(extractedData)[0] // Get the first key dynamically
    const data = extractedData[dynamicKey] // Access data for that key

    console.log("data os ", data)

    // Generate PDF
    const pdfContent = (
      <PressReleasePDF
        title={data.headline}
        subHeadline={data.subHeadline}
        date={date}
        content={data.summary}
        keyHighlights={data.keyHighlights}
        ceoQuote={data.ceoQuote}
        ceoName={companyUser.companyCEOName}
        aboutCompany={companyUser.companyAbout}
        cautionaryNote={companyUser.companyCautionaryNote}
        companyContactEmail={companyUser.companyCEOName}
        companyContactName={companyUser.companyContactName}
        companyName={companyUser.companyName}
        companyDescriptor={companyUser.companyDescriptor}
        companyInvestorRelationsCompanyName={companyUser.companyInvestorRelationsCompanyName}
        companyInvestorRelationsContactEmail={companyUser.companyInvestorRelationsContactEmail}
        companyInvestorRelationsContactName={companyUser.companyInvestorRelationsContactName}
        companyInvestorRelationsContactPhone={companyUser.companyInvestorRelationsContactPhone}
      />
    )

    console.log("pdfContent is ", pdfContent)
    const blob = await pdf(pdfContent).toBlob()

    if (blob) {
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "press_release.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    setIsLoading(false)
  }



  const handleDragResize = (event) => {
    isResizing.current = true;

    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", stopResize);
  }

  // Dynamically Adjust Width on Mouse Move
  const handleResize = (event) => {
    if (isResizing.current) {
      const newWidth = (event.clientX / window.innerWidth) * 100;
      if (newWidth > 30 && newWidth < 70) {
        // Restrict width between 30% and 70%
        setPanelWidth(newWidth);
      }
    }
  };

  // Stop Resizing on Mouse Release
  const stopResize = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", stopResize);
  };

  return (
    <div className="w-full p-4">
      <Card className="h-screen bg-white shadow-lg">
        <CardHeader className="pb-2">
          {/* Flex Container for Title & Button */}
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl text-[#1B2559]">AI Document Analysis</CardTitle>

            {isDataFetched && (
              <Button onClick={generatePDF} className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-md ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary-dark"}`}>
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5" />
                    <span>Generate PDF</span>
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Description below the title & button */}
          <CardDescription>Review AI-extracted details and refine with chat assistance</CardDescription>
        </CardHeader>

        <CardContent className="h-[calc(100%-4rem)] p-0 border border-gray-300 rounded-md">
          <div className="flex h-full">

            {/* AI Extracted Details Section */}
            <div
              className={`flex-grow overflow-hidden p-4 transition-all duration-300 ease-in-out ${isPastSessionsCollapsed && isChatInterfaceCollapsed ? "w-full" : "w-3/5"
                }`}
            >
              <h3 className="text-xl font-semibold mb-2 text-[#1B2559] flex items-center">
                AI Extracted Details
              </h3>

              <AIExtractedDetails
                documents={selectedDocuments}
                onUpdateExtractedData={handleUpdateExtractedData}
                isLoading={isExtractingData}
                company={companyUser}
                updateParentExtractedData={updateParentExtractedData}
                onMessagesGenerated={handleMessagesGenerated}
                returnExtractedData={extractedData}
              />

            </div>

            {/* Resizable Divider */}
            <div className="w-2 bg-gray-300 cursor-ew-resize" onMouseDown={handleDragResize}></div>

            {/* Chat Interface Panel */}
            <div
              className={`transition-all duration-300 ease-in-out ${isChatInterfaceCollapsed ? "w-12" : "w-2/5"
                } bg-gray-50 border-l border-gray-200 flex flex-col`}
            >
              <div className="flex items-center justify-between p-2 bg-gray-50 border-b">
                <h3 className={`text-xl font-semibold text-[#1B2559] ${isChatInterfaceCollapsed ? "hidden" : "block"}`}>
                  Chat Assistance
                </h3>
                <Button variant="ghost" size="icon" onClick={toggleChatInterface} className="h-8 w-8 text-primary">
                  {isChatInterfaceCollapsed ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </Button>
              </div>

              {!isChatInterfaceCollapsed && (
                <ChatInterface onSendMessage={handleSendMessage} chatId={chatData.chatId} onUpdateField={handleUpdateField} />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

}

export default AIDocBuilder

