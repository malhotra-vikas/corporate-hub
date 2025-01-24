import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AIExtractedDetailsProps {
  documents: Array<{
    file: {
      name: string
      category: string
    }
    type: string
  }>
}

export const AIExtractedDetails: React.FC<AIExtractedDetailsProps> = ({ documents }) => {
  // This is a placeholder for AI-extracted data
  const extractedData = documents.map((doc) => ({
    fileName: doc.file.name,
    type: doc.type,
    title: `AI-Generated Title for ${doc.file.name}`,
    date: new Date().toLocaleDateString(),
    keyPoints: ["AI-generated key point 1", "AI-generated key point 2", "AI-generated key point 3"],
    financialHighlights:
      doc.type === "earnings_statement"
        ? {
            revenue: "$X.XX billion",
            netIncome: "$X.XX million",
            eps: "$X.XX per share",
          }
        : null,
  }))

  return (
    <ScrollArea className="h-[calc(100%-2rem)] pr-4">
      {extractedData.map((data, index) => (
        <Card key={index} className="mb-4">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{data.fileName}</span>
              <Badge>{data.type}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">Generated Title: {data.title}</p>
            <p className="text-sm text-muted-foreground mb-4">Date: {data.date}</p>
            <h3 className="font-semibold mb-2">Key Points:</h3>
            <ul className="list-disc pl-5 mb-4">
              {data.keyPoints.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
            {data.financialHighlights && (
              <>
                <h3 className="font-semibold mb-2">Financial Highlights:</h3>
                <ul className="list-none">
                  <li>Revenue: {data.financialHighlights.revenue}</li>
                  <li>Net Income: {data.financialHighlights.netIncome}</li>
                  <li>EPS: {data.financialHighlights.eps}</li>
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  )
}

