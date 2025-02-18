"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import ChatApi from "@/lib/api/chat.api"
import VaultApi from "@/lib/api/vault.api"
import OpenAiApi from "@/lib/api/openApi.api"
import UserApi from "@/lib/api/user.api"
import { toast } from "react-toastify"
import { ChatInterface } from "./chat-interface"

export interface ExtractedData {
  name: string
  headline: string
  subHeadline: string
  summary: string
  keyHighlights: string
  ceoQuote: string
  extractedText: string
}

interface Message {
  role: string
  content: string
}

interface AIExtractedDetailsProps {
  documents: Array<{
    file: {
      extractedText: any
      filePath: any
      extractedData: string
      name: string
      docType: string
      user_id: string
      _id: string
    }
    type: string
  }>
  chatSessionId: string
  onUpdateExtractedData: (fileId: string, field: string, value: string) => void
  isLoading: boolean
  company: any
  updateParentExtractedData: (data: { [key: string]: ExtractedData }) => void
  onMessagesGenerated: (messages: Message[], chatId: string) => void
  returnExtractedData: any // New prop for updated extracted data
}

const fieldLabels = {
  headline: "extractedTextHeadline",
  subHeadline: "extractedSubHeadline",
  summary: "extractedTextSummary",
  keyHighlights: "extractedKeyHighlights",
  ceoQuote: "extractedCeoQuote",
}

export const AIExtractedDetails: React.FC<AIExtractedDetailsProps> = ({
  documents,
  onUpdateExtractedData,
  isLoading: initialIsLoading,
  company,
  updateParentExtractedData,
  onMessagesGenerated,
  returnExtractedData,
  chatSessionId
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(initialIsLoading)
  const [editingFields, setEditingFields] = useState<{ [key: string]: string[] }>({})
  const [toneMessages, setToneMessages] = useState<string | null>(null)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [showPdfConfirmation, setShowPdfConfirmation] = useState(false)
  const [welcomeMessageSent, setWelcomeMessageSent] = useState(false)
  const [loggedInUser, setLoggedinUser] = useState<string>("")
  const [messages, setMessages] = useState<any[]>([])
  const [isDataFetched, setIsDataFetched] = useState(false)

  let [ceoQuote, setCeoQuote] = useState<string>("");
  let [documentText, setExtractedDocumentText] = useState<string>("");

  const [extractedData, setExtractedData] = useState<{
    [key: string]: ExtractedData
  }>({})

  const chatApi = new ChatApi()
  const vaultApi = new VaultApi()
  const openAiApi = new OpenAiApi()
  const userApi = new UserApi()

  console.log("In AIExtractedDetails - documents ", documents)
  console.log("In AIExtractedDetails - company ", company)

  
  useEffect(() => {
    
    setExtractedData((prevData) => {
      if (!prevData) {
        console.warn("prevData is undefined, initializing an empty object.");
        return { ...returnExtractedData };
      }
  
      const updatedData = { ...prevData };

      console.log("Data to be updated ", returnExtractedData)
  
      Object.keys(returnExtractedData).forEach((key) => {
        console.log("lookup Key ", key)

        if (key in updatedData) {
          updatedData[key] = returnExtractedData[key]; // ✅ Update only matching keys
        }
      });

      console.log("Updated Data to be painted ", updatedData)

  
      return updatedData;
    });
  }, [returnExtractedData]);


  useEffect(() => {
    const fetchExtractedData = async () => {
      setIsLoading(true);
      try {
        const chatApi = new ChatApi();
        const response = await chatApi.getChatById({ id: chatSessionId });
        console.log(" Datqa for past chat ", response.data)
        
        setExtractedData(response.data);
      } catch (error) {
        console.error("Error fetching extracted data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (chatSessionId) {
      fetchExtractedData();
    }
  }, [chatSessionId]);


  useEffect(() => {
    const fetchData = async () => {
      setLoggedinUser(company._id)

      if (initialIsLoading) {
        let cumulativeExtractedText = ""
        let file_id = ""

        console.log("In AIExtractedDetails - documents ", documents)

        const relevantDoc = documents[0]

        console.log("In AIExtractedDetails - relevantDoc file id ", relevantDoc.file._id)
        console.log("In AIExtractedDetails - relevantDoc user id ", relevantDoc.file.user_id)
        console.log("In AIExtractedDetails - relevantDoc file type  is ", relevantDoc.file.docType)

        if (relevantDoc.file.docType === 'Paste-News') {
          const extractedText = relevantDoc.file.extractedText

          console.log("Paste-News Extracted Text is  ", extractedText)

          await runAi(extractedText, relevantDoc.file._id, company._id);

        } else if (relevantDoc.file.docType === '8-K') {
          const extractedTextLink = relevantDoc.file.filePath
          console.log("8K Text link is  ", extractedTextLink)

          try {
            const response = await vaultApi.fetchSecText(extractedTextLink)
            console.log("Fetched text from 8-K link:", response); // Log first 500 chars for debugging

            const extractedText = await response.data;
          
                      
            console.log("Fetched text from 8-K link:", extractedText.slice(0, 500)); // Log first 500 chars for debugging
        
            // Run AI processing on extracted text
            await runAi(extractedText, relevantDoc.file._id, company._id);
          } catch (error) {
            console.error("Error fetching 8-K text:", error);
          }
        
        } else {
          console.log("Converting PDF to text");
          const pdfToTextResponse = await vaultApi.getFileData({
            user_id: relevantDoc.file.user_id,
            docType: "pdf",
            fileId: relevantDoc.file._id,
          });
          const extractedText = pdfToTextResponse.data;
  
  
          console.log("In AIExtractedDetails - cumulativeExtractedText ", pdfToTextResponse)
  
          await runAi(pdfToTextResponse.data, relevantDoc.file._id, company._id)
  
        }

      }
    }

    fetchData()
  }, [initialIsLoading, company._id, documents])

  const runAi = async (cumulativeExtractedText: string, file_id: string, loggedInUser: string) => {
    setIsLoading(true)

    const namePrompt =
      "Generate a short, memorable name of no more than 5 words for this press-release using the headline that the user provided. "

    const headlinePrompt = `
        Generate a short, impactful headline of no more than 15 words that captures the core news. Follow the guidelines. Set the Tone with a Strong Headline.
        The headline should succinctly convey the key news and its significance. You would never add any assumptions, just convey facts.
        Highlight the value to shareholders, whether it's a new acquisition, a major "milestone, or a growth driver. 
        
        Leverage High-Performing professional Keywords to enhance engagement and convey confidence. Do not add any formating
      `

    let ceoQuotePrompt = `
        Generate a CEO quote in first-person for the following news. Follow the guidelines. 
        CEO quotes are critical to reinforcing the significance of the news. 
        Tailor messaging to the target audience (e.g., shareholders, investors, partners, or the clinical community). Do not add any formating

        You would never add any assumptions, just convey facts.
        Leverage High-Performing professional Keywords to enhance engagement and convey confidence

      `

    let summaryPrompt = `
        Summarize the following news in 2-3 paragraphs. Use the following guidelines. Keep the tone professional and concise. 
        Capture Attention in the Opening Lines. The first few sentences should hook the reader by emphasizing why the news matters. 

        State the achievement, its relevance to the company's strategy, and the potential impact on stakeholders.
        Leverage High-Performing professional Keywords to enhance engagement and convey confidence.
        
        Tie the news to the company's larger strategy. Use metrics to demonstrate value. Ensure consistency in tone and structure.
        Tailor messaging to target audiences, including shareholders, investors, and potential partners. Include financial specifics and revenue forcasts if the news includes that. 
        
        Acknowledge key dependencies. You would never add any assumptions, just convey facts.
        Balance promotional tone with a realistic outlook, highlighting challenges and next steps. Do not add any formating.

        The sumary paragraph will always start with the company descriptor of ${company.companyDescriptor}
      `

    if (toneMessages) {
      summaryPrompt = summaryPrompt + " The tone should be " + toneMessages
    } else {
      summaryPrompt = summaryPrompt + " The tone should be optimistic with no implied gaurantees. "
    }

    let subHeadlinePrompt = `
    Generate 2 concise, impactful bullet points to highlight Sub-Headlines that expand on the Value Proposition. 
    Each sub-headline should be **no more than 30 words** and should capture **only the core news**, without assumptions.
    
    Sub-headlines should:
    - Elaborate on key **metrics** or **context** related to the news.
    - Succinctly convey the **key news** and its **significance**.
    - Highlight **value to shareholders**, whether it's **a new acquisition, milestone, or growth driver**.
    - Include **financial specifics and revenue forecasts** if relevant.
    - Use **high-performing professional keywords** to enhance engagement and convey confidence.
    
    ### **Response Format**
    Return a **valid JSON object** in the following structure:
    \`\`\`json
    {
      "subHeadline-1": "Concise and impactful sub-headline about revenue growth...",
      "subHeadline-2": "Concise and impactful sub-headline about strategic partnership..."
    }
    \`\`\`
    DO NOT add extra text, explanations, or formatting outside this JSON structure.
    `;

    if (toneMessages) {
      subHeadlinePrompt = subHeadlinePrompt + " The tone should be " + toneMessages
    } else {
      subHeadlinePrompt = subHeadlinePrompt + " The tone should be optimistic with no implied gaurantees. "
    }

    let keyHighlightsPrompt = `
        Generate 5 concise, impactful numbered bullet points that clearly capture the key highlights of the news article. 
        Do not add any formatting. 
        Use high-performing professional keywords to drive engagement, convey confidence, and ensure clarity. 
        You would never add any assumptions, just convey facts.
        
        Tie the content to the company's larger strategy, showing how this news fits into broader objectives. 
        Incorporate metrics to demonstrate the value of the news, including revenue forecasts, projected growth, and key financials where relevant.
        
        Tailor the messaging to the following target audiences: shareholders, investors, and potential partners. 
        Acknowledge key dependencies and risks where applicable, and be transparent about potential challenges.
        
        Maintain a balanced tone—promotional but realistic, highlighting both opportunities and the next steps for the company. Return the output in a JSON format like with 
        {
          Bullet Point hook: Bullet Point Details
        }

        `

    if (toneMessages) {
      keyHighlightsPrompt = keyHighlightsPrompt + " The tone should be " + toneMessages
    } else {
      keyHighlightsPrompt = keyHighlightsPrompt + " The tone should be optimistic with no implied gaurantees. "
    }
    const system_prompt =
      "You are a high-quality IR/PR professional specializing in crafting impactful press releases for companies across various industries."

    // Step 3: Run OpenAI APIs in parallel
    console.log("Sending requests to OpenAI APIs", {
      summary: summaryPrompt,
      headline: headlinePrompt,
      ceoQuote: ceoQuotePrompt,
      subHeadline: subHeadlinePrompt,
      keyHighlights: keyHighlightsPrompt,
      cumulativeExtractedText: cumulativeExtractedText
    })


    try {
      const summaryResponse = await openAiApi.completion(
        [
          { role: "system", content: system_prompt },
          { role: "user", content: cumulativeExtractedText },
        ],
        summaryPrompt,
      )
      const headlineResponse = await openAiApi.completion(
        [
          { role: "system", content: system_prompt },
          { role: "user", content: cumulativeExtractedText },
        ],
        headlinePrompt,
      )
  
      const ceoQuoteResponse = await openAiApi.completion(
        [
          { role: "system", content: system_prompt },
          { role: "user", content: cumulativeExtractedText },
        ],
        ceoQuotePrompt,
      )
  
      const subHeadlineResponse = await openAiApi.completion(
        [
          { role: "system", content: system_prompt },
          { role: "user", content: cumulativeExtractedText },
        ],
        subHeadlinePrompt,
      )
  
      const keyHighlightsResponse = await openAiApi.completion(
        [
          { role: "system", content: system_prompt },
          { role: "user", content: cumulativeExtractedText },
        ],
        keyHighlightsPrompt,
      )
  
      const generatedSummary = summaryResponse?.data.choices[0].message.content
      const generatedHeadline = headlineResponse?.data.choices[0].message.content
      const generatedCeoQuote = ceoQuoteResponse?.data.choices[0].message.content
  
      let generatedSubHeadlinesJson = subHeadlineResponse?.data.choices[0].message.content
      let formattedSubHeadlines = "";
      let formattedkeyhighlights = "";
  
  
      // Ensure the response is in the correct JSON format and handle parsing
      try {
        generatedSubHeadlinesJson = cleanJsonString(generatedSubHeadlinesJson)
        console.log("UnParsed generatedSubHeadlinesJson is ", generatedSubHeadlinesJson)


        generatedSubHeadlinesJson = JSON.parse(generatedSubHeadlinesJson)

        console.log("Parsed generatedSubHeadlinesJson is ", generatedSubHeadlinesJson)

        // Iterate through the object and concatenate each key-value pair
        formattedSubHeadlines = Object.entries(generatedSubHeadlinesJson)
          .map(([key, value]) => `${value}`)
          .join("\n");  // Join each pair with a newline character
  
      } catch (error) {
        console.error("Error parsing SubHeadlines JSON:", error)
        formattedSubHeadlines = "" // Assign an empty object if parsing fails
      }
  
      // Parse the JSON response for key highlights
      let generatedKeyHighlightsJson = keyHighlightsResponse?.data.choices[0].message.content
  
      // Ensure the response is in the correct JSON format and handle parsing
      try {
        generatedKeyHighlightsJson = JSON.parse(generatedKeyHighlightsJson)
        // Iterate through the object and concatenate each key-value pair
        formattedkeyhighlights = Object.entries(generatedKeyHighlightsJson)
          .map(([key, value]) => `${key}:${value}`)
          .join("\n");  // Join each pair with a newline character
  
      } catch (error) {
        console.error("Error parsing key highlights JSON:", error)
        formattedkeyhighlights = "" // Assign an empty object if parsing fails
      }
  
      const chatNameResponse = await openAiApi.completion(
        [
          { role: "system", content: system_prompt },
          { role: "user", content: generatedHeadline },
        ],
        namePrompt,
      )
  
      const generatedChatName = chatNameResponse?.data.choices[0].message.content
  
      console.log("Received responses from OpenAI APIs", {
        chatName: generatedChatName,
        summary: generatedSummary,
        headline: generatedHeadline,
        ceoQuote: generatedCeoQuote,
        subHeadline: formattedSubHeadlines,
        keyHighlights: formattedkeyhighlights,
      })
  
      const newExtractedData = {
        [file_id]: {
          name: generatedChatName,
          headline: generatedHeadline,
          subHeadline: formattedSubHeadlines,
          summary: generatedSummary,
          keyHighlights: formattedkeyhighlights,
          ceoQuote: generatedCeoQuote,
          extractedText: cumulativeExtractedText
        },
      }
  
      // Add a 5-second delay before removing the loader
      await delay(3000)

      setExtractedData(newExtractedData)

      updateParentExtractedData(newExtractedData)

      // Persist the extracted data in Vault
      await updateVaultWithInitialExtractedData(file_id, newExtractedData[file_id])
  
      // Persist the extracted data in Chat DB and Chat Window
      await updateNewChatWithNewMessages(loggedInUser, newExtractedData[file_id])
  
    } catch (error) {
      console.error("Error runing AI:", error)
    } finally {
      setIsLoading(false)
    }

  }

  const updateNewChatWithNewMessages = async (loggedInUser: string, data: ExtractedData) => {
        // After generating summary, headline, and CEO quote
        console.log("Creating new chat with generated content")
        try {
          const newChatContent = [
            {
              message: "Generated Headline: " + data.headline,
              direction: "incoming",
              sender: "bot",
            },
            {
              message:
                `Generated Sub Headline:: \n` + data.subHeadline,
              direction: "incoming",
              sender: "bot",
            },
            {
              message: "Generated Summary: " + data.summary,
              direction: "incoming",
              sender: "bot",
            },
            {
              message:
                `Generated Key Highlights: \n` + data.keyHighlights,
              direction: "incoming",
              sender: "bot",
            },
            {
              message: "Generated CEO Quote: " + data.ceoQuote,
              direction: "incoming",
              sender: "bot",
            },
          ]

          const messages: Message[] = newChatContent.map((content) => ({
            role: "assistant",
            content: content.message,
          }))
    
          console.log("Creating new chat name as ", data.name)


          const newChatResponse = await chatApi.newChat({
            userid: loggedInUser,
            messages: newChatContent,
            chat_type: "Press Release",
            chatName: data.name,
          })

          let chatId = ''
          if (newChatResponse) {
            chatId = newChatResponse.data._id

            console.log("Newe chat id is ", chatId)
            setCurrentChatId(chatId)
          }
        
          onMessagesGenerated(messages, chatId)

          // Update messages state with new chat content
          setMessages((prevMessages) => [...prevMessages, ...newChatContent])
        } catch (error) {
          console.error("Failed to create new chat:", error)
          toast.error("Failed to create new chat. Please try again.")
        }
    

  }


  const updateVaultWithInitialExtractedData = async (fileId: string, data: ExtractedData) => {
    try {
      const updateData = [
        {
          _id: fileId,
          extractedTextSummary: data.summary,
          extractedTextHeadline: data.headline,
          extractedCeoQuote: data.ceoQuote,
          extractedSubHeadline: data.subHeadline,
          extractedKeyHighlights: data.keyHighlights,
          chatName: data.name,
        },
      ];

      console.log("Updating vault entry ", updateData);

      await vaultApi.updateFiles(updateData);

    } catch (error) {
      console.error("Error persisting data:", error)
      toast.error("Failed to save data. Please try again.")
    }
  }

  const handleEdit = (fileId: string, field: string) => {
    setEditingFields((prev) => ({
      ...prev,
      [fileId]: [...(prev[fileId] || []), field],
    }))
  }

  const updateExtractedData = async (fileId: string, field: string, value: string) => {
    try {

      const mappedField = fieldLabels[field]

      if (!mappedField) {
        throw new Error("Field mapping not found");
      }
  
      const updateData = [
        {
          _id: fileId,
          [mappedField]: value
        },
      ];
      console.log(`Updating vault entry ${updateData}` )

      await vaultApi.updateFiles(updateData);

    } catch (error) {
      console.error("Error persisting data:", error)
      toast.error("Failed to save data. Please try again.")
    }
  }


  const handleSave = async (fileId: string, field: string, value: string) => {
    const updatedData = {
      ...extractedData[fileId],
      [field]: value,
    }
    setExtractedData((prev) => ({
      ...prev,
      [fileId]: updatedData,
    }))

    console.log(`New value for field ${field} is ${value}` )
    // Persist the changes
    await updateExtractedData(fileId, field, value)

    onUpdateExtractedData(fileId, field, value)

    setEditingFields((prev) => ({
      ...prev,
      [fileId]: prev[fileId].filter((f) => f !== field),
    }))
  }

  const handleCancel = (fileId: string, field: string) => {
    setEditingFields((prev) => ({
      ...prev,
      [fileId]: prev[fileId].filter((f) => f !== field),
    }))
  }

  const renderEditableField = (fileId: string, field: string, isRichText: boolean, fieldName: string) => {
    const isEditing = editingFields[fileId]?.includes(field)
    const value = extractedData[fileId]?.[field as keyof ExtractedData] || ""

    if (isEditing) {
      return (
        <div className="space-y-2">
          {isRichText ? (
            <RichTextEditor
              label={fieldName}
              value={value}
              onChange={(newValue) => {
                setExtractedData((prev) => ({
                  ...prev,
                  [fileId]: {
                    ...prev[fileId],
                    [field]: newValue,
                  },
                }))
              }} />
          ) : (
            <div className="space-y-2">
              <Label htmlFor={`${fileId}-${field}`} className="text-[#1B2559] font-semibold">{fieldName}</Label>
              <Input
                id={`${fileId}-${field}`}
                value={value}
                onChange={(e) => {
                  setExtractedData((prev) => ({
                    ...prev,
                    [fileId]: {
                      ...prev[fileId],
                      [field]: e.target.value,
                    },
                  }))
                }}
              />
            </div>
          )}
          <div className="space-x-2">
            <Button onClick={() => handleCancel(fileId, field)} variant="outline">
              Cancel
            </Button>
            <Button onClick={() => handleSave(fileId, field, extractedData[fileId][field])} variant="default">
              Save
            </Button>
          </div>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full text-[#1B2559]">
          <Loader2 className="h-8 w-8 animate-spin text-[#1B2559]" />
          <span className="ml-2 text-lg font-semibold text-[#1B2559]">Thinking...</span>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-[#1B2559]">{fieldName}</h4>
          <Button variant="outline" size="sm" onClick={() => handleEdit(fileId, field)}>
            Edit
          </Button>
        </div>
        {isRichText ? (
          <div
            dangerouslySetInnerHTML={{ __html: value }}
            className="prose prose-sm max-w-none"
            style={{ whiteSpace: "pre-wrap" }}
          />
        ) : (
          <p className="text-gray-700">{value}</p>
        )}
      </div>
    )
  }

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      {documents.map((doc, index) => (
        <Card key={index} className="mb-4 bg-white shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base flex justify-between items-center">

            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            {renderEditableField(doc.file._id, "name", false, "Press Release Name")}
            {renderEditableField(doc.file._id, "headline", true, "Headline")}
            {renderEditableField(doc.file._id, "subHeadline", true, "Sub Headline")}
            {renderEditableField(doc.file._id, "summary", true, "Summary")}
            {renderEditableField(doc.file._id, "keyHighlights", true, "Key Highlights")}
            {renderEditableField(doc.file._id, "ceoQuote", true, "CEO's Quote")}
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  )
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function cleanJsonString(generatedSubHeadlinesJson: string): string {
  // Remove triple backticks and potential formatting artifacts
  return generatedSubHeadlinesJson.replace(/^```json|```$/g, '').trim();
}

