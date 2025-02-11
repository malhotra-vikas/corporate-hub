import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import ChatApi from "@/lib/api/chat.api"
import VaultApi from "@/lib/api/vault.api"
import OpenAiApi from "@/lib/api/openApi.api"
import UserApi from "@/lib/api/user.api"
import { toast } from "react-toastify"

interface ExtractedData {
  name: string
  headline: string
  subHeadline: string
  summary: string
  keyHighlights: string
  ceoQuote: string
}

interface AIExtractedDetailsProps {
  documents: Array<{
    file: {
      extractedData: string
      name: string
      user_id: string
      _id: string
    }
    type: string
  }>
  onUpdateExtractedData: (fileId: string, field: string, value: string) => void
  isLoading: boolean
  company: any
}

const fieldLabels = {
  name: "Press Release Name",
  headline: "Headline",
  subHeadline: "Sub-Headline",
  summary: "Summary",
  keyHighlights: "Key Highlights",
  ceoQuote: "CEO's Quote",
};

export const AIExtractedDetails: React.FC<AIExtractedDetailsProps> = ({
  documents,
  //extractedData,
  onUpdateExtractedData,
  isLoading: initialIsLoading,
  company
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(initialIsLoading);
  const [editingFields, setEditingFields] = useState<{ [key: string]: string[] }>({})
  const [toneMessages, setToneMessages] = useState<string | null>(null);
  let [currentChatId, setCurrentChatId] = useState<string | null>(null); // Added
  const [showPdfConfirmation, setShowPdfConfirmation] = useState(false);
  const [welcomeMessageSent, setWelcomeMessageSent] = useState(false); // Added state variable
  let [chatName, setChatName] = useState(); // Added state variable
  let [loggedInUser, setLoggedinUser] = useState(); // Added state variable
  const [messages, setMessages] = useState<any[]>([]);
  let [summary, setSummary] = useState<string>("");
  let [headline, setHeadline] = useState<string>("");
  let [subHeadline, setSubHeadline] = useState<string>("");
  let [keyHighlights, setKeyHighlights] = useState<string>("");

  let [ceoQuote, setCeoQuote] = useState<string>("");
  let [documentText, setExtractedDocumentText] = useState<string>("");

  let [extractedData, setExtractedData] = useState<{
    [key: string]: {
      name: string
      headline: string
      subHeadline: string
      summary: string
      keyHighlights: string
      ceoQuote: string
    }
  }>({})

  
  const chatApi = new ChatApi();
  const vaultApi = new VaultApi();
  const openAiApi = new OpenAiApi();
  const userApi = new UserApi();
  
  console.log("In AIExtractedDetails - documents ", documents)
  console.log("In AIExtractedDetails - company ", company)

  useEffect(() => {
    const fetchData = async () => {
      setLoggedinUser(company._id);
  
      if (initialIsLoading) {
        let cumulativeExtractedText = "";
        let file_id = ""
  
        documents.forEach((fileData) => {
          cumulativeExtractedText += fileData.file.extractedData;
          file_id = fileData.file._id
        });
  
        console.log("In AIExtractedDetails - cumulativeExtractedText ", cumulativeExtractedText);
  
        await runAi(cumulativeExtractedText, file_id);
      }
    };
  
    fetchData();
  }, [initialIsLoading, company._id, documents]);

  const runAi = async (cumulativeExtractedText: string, file_id: string) => {
    setIsLoading(true)

    const namePrompt =
      "Generate a short, memorable name of no more than 5 words for this press-release using the headline that the user provided. ";

    let headlinePrompt = `
        Generate a short, impactful headline of no more than 25 words that captures the core news. Follow the guidelines. Set the Tone with a Strong Headline.
        The headline should succinctly convey the key news and its significance. You would never add any assumptions, just convey facts.
        Highlight the value to shareholders, whether it's a new acquisition, a major "milestone, or a growth driver. 
        
        Leverage High-Performing professional Keywords to enhance engagement and convey confidence. Do not add any formating
      `;

    let ceoQuotePrompt = `
        Generate a CEO quote in first-person for the following news. Follow the guidelines. 
        CEO quotes are critical to reinforcing the significance of the news. 
        Tailor messaging to the target audience (e.g., shareholders, investors, partners, or the clinical community). Do not add any formating

        You would never add any assumptions, just convey facts.
        Leverage High-Performing professional Keywords to enhance engagement and convey confidence

      `;

    if (toneMessages) {
      ceoQuotePrompt = ceoQuotePrompt + " The tone should be " + toneMessages;
    } else {
      ceoQuotePrompt =
        ceoQuotePrompt + " The tone should be cautiously optimistic. ";
    }

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
      `;

    if (toneMessages) {
      summaryPrompt = summaryPrompt + " The tone should be " + toneMessages;
    } else {
      summaryPrompt =
        summaryPrompt + " The tone should be cautiously optimistic. ";
    }

    let subHeadlinePrompt = `
        Generate 2 consise, impactful bullet points to highlight Sub-Headlines to Expand on the Value Proposition. 
        Each sub-headline should be no more than 30 words that captures the core news. You would never add any assumptions, just convey facts.

        Sub-headlines offer an opportunity to elaborate on the key metrics or context. These should succinctly convey the key news and its significance. 
        Highlight the value to shareholders, whether it's a new acquisition, a major milestone, or a growth driver. Do not add any formating. 

        Include financial specifics and revenue forcasts if the news includes that. 
        Leverage High-Performing professional Keywords to enhance engagement and convey confidence. Return the output in a JSON format like with 
        {
          Bullet Point hook: Bullet Point Details
        }
      `;

    if (toneMessages) {
      subHeadlinePrompt =
        subHeadlinePrompt + " The tone should be " + toneMessages;
    } else {
      subHeadlinePrompt =
        subHeadlinePrompt + " The tone should be cautiously optimistic. ";
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

        `;

    if (toneMessages) {
      keyHighlightsPrompt =
        keyHighlightsPrompt + " The tone should be " + toneMessages;
    } else {
      keyHighlightsPrompt =
        keyHighlightsPrompt + " The tone should be cautiously optimistic. ";
    }
    const system_prompt =
      "You are a high-quality IR/PR professional specializing in crafting impactful press releases for companies across various industries.";

    // Step 3: Run OpenAI APIs in parallel
    console.log("Sending requests to OpenAI APIs", {
      summary: summaryPrompt,
      headline: headlinePrompt,
      ceoQuote: ceoQuotePrompt,
      subHeadline: subHeadlinePrompt,
      keyHighlights: keyHighlightsPrompt,
    });

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

    let generatedSummary = summaryResponse?.data.choices[0].message.content;
    let generatedHeadline =
      headlineResponse?.data.choices[0].message.content;
      let generatedCeoQuote =
      ceoQuoteResponse?.data.choices[0].message.content;

    let generatedSubHeadlines =
      subHeadlineResponse?.data.choices[0].message.content;

    // Ensure the response is in the correct JSON format and handle parsing
    try {
      generatedSubHeadlines = JSON.parse(generatedSubHeadlines);
    } catch (error) {
      console.error("Error parsing SubHeadlines JSON:", error);
      generatedSubHeadlines = {}; // Assign an empty object if parsing fails
    }

    // Parse the JSON response for key highlights
    let generatedKeyHighlights =
      keyHighlightsResponse?.data.choices[0].message.content;

    // Ensure the response is in the correct JSON format and handle parsing
    try {
      generatedKeyHighlights = JSON.parse(generatedKeyHighlights);
    } catch (error) {
      console.error("Error parsing key highlights JSON:", error);
      generatedKeyHighlights = {}; // Assign an empty object if parsing fails
    }

    const chatNameResponse = await openAiApi.completion(
      [
        { role: "system", content: system_prompt },
        { role: "user", content: generatedHeadline },
      ],
      namePrompt,
    );

    let generatedName = chatNameResponse?.data.choices[0].message.content;
    chatName = generatedName
    setChatName(generatedName);

    console.log("Received responses from OpenAI APIs", {
      chatName: generatedName,
      summary: generatedSummary,
      headline: generatedHeadline,
      ceoQuote: generatedCeoQuote,
      subHeadline: generatedSubHeadlines,
      keyHighlights: generatedKeyHighlights,
    });

    // After generating summary, headline, and CEO quote
    console.log("Creating new chat with generated content");
    try {
      const newChatContent = [
        {
          message: "Generated Headline: " + generatedHeadline,
          direction: "incoming",
          sender: "bot",
        },
        {
          message:
            `Generated Sub Headline:: \n` +
            Object.entries(generatedSubHeadlines)
              .map(([key, value]) => `- ${key}: ${value}`)
              .join("\n"),
          direction: "incoming",
          sender: "bot",
        },
        {
          message: "Generated Summary: " + generatedSummary,
          direction: "incoming",
          sender: "bot",
        },
        {
          message:
            `Generated Key Highlights: \n` +
            Object.entries(generatedKeyHighlights)
              .map(([key, value]) => `- ${key}: ${value}`)
              .join("\n"),
          direction: "incoming",
          sender: "bot",
        },
        {
          message: "Generated CEO Quote: " + generatedCeoQuote,
          direction: "incoming",
          sender: "bot",
        },
      ];

      if (currentChatId) {
        console.log("Saving chat name as ", chatName);
        await chatApi.updateChat({
          _id: currentChatId,
          userid: loggedInUser,
          messages: newChatContent,
          chat_type: "Press Release",
          chatName: chatName,
        });

        //navigate(`/chat/pressRelease/${currentChatId}`);
      }

      // Update messages state with new chat content
      setMessages((prevMessages) => [...prevMessages, ...newChatContent]);
    } catch (error) {
      console.error("Failed to create new chat:", error);
      toast.error("Failed to create new chat. Please try again.");
    }

    // Headline
    setHeadline(generatedHeadline);

    // Sub Headline
    setSubHeadline(generatedSubHeadlines);

    // Summary
    setSummary(generatedSummary);

    // Key Highlights
    setKeyHighlights(generatedKeyHighlights);

    // CEO Quote
    setCeoQuote(generatedCeoQuote);

    const newExtractedData = {
      [file_id]: {  // Use the file name (or any unique identifier) as the key
        name: generatedName,
        headline: generatedHeadline,
        subHeadline: generatedSubHeadlines,
        summary: generatedSummary,
        keyHighlights:generatedKeyHighlights,
        ceoQuote: generatedCeoQuote,
      }
    };
    
    setExtractedData(newExtractedData);
    
    setIsLoading(false)

  }

  const handleEdit = (fileId: string, field: string) => {
    setEditingFields((prev) => ({
      ...prev,
      [fileId]: [...(prev[fileId] || []), field],
    }))
  }

  const handleSave = (fileId: string, field: string, value: string) => {
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

    console.log("Field contant is ", value)

    if (isEditing) {
      return (
        <div className="space-y-2">
          {isRichText ? (
            <RichTextEditor
              label={fieldName}
              value={typeof value === "string" ? value : JSON.stringify(value, null, 2)} // Convert object to string
              onChange={(newValue) => onUpdateExtractedData(fileId, field, newValue)}
            />
          ) : (
            <div className="space-y-2">
              <Label htmlFor={`${fileId}-${field}`}>{fieldName}</Label>
              <Input
                id={`${fileId}-${field}`}
                value={typeof value === "string" ? value : JSON.stringify(value, null, 2)} // Convert object to string
                onChange={(e) => onUpdateExtractedData(fileId, field, e.target.value)}
              />
            </div>
          )}
          <div className="space-x-2">
            <Button onClick={() => handleSave(fileId, field, value)} className="bg-primary text-white">
              Save
            </Button>
            <Button variant="outline" onClick={() => handleCancel(fileId, field)}>
              Cancel
            </Button>
          </div>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg font-semibold text-primary">Extracting data...</span>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-primary">{fieldName}</h4>
          <Button variant="outline" size="sm" onClick={() => handleEdit(fileId, field)}>
            Edit
          </Button>
        </div>
        {isRichText ? (
          <div
            dangerouslySetInnerHTML={{
              __html: typeof value === "string" ? value : Object.entries(value) // Render object entries
              .map(([key, val]) => `<strong>${key}:</strong> ${val}`)
              .join("<br/>"),
            }}
            className="prose prose-sm max-w-none"
            style={{ whiteSpace: "pre-wrap" }}
          />
        ) : (
          <p className="text-gray-700">
            {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
          </p>

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
              <span className="truncate text-primary">{doc.file._id}</span>
              <Badge variant="secondary" className="ml-2">
                {doc.type}
              </Badge>
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

