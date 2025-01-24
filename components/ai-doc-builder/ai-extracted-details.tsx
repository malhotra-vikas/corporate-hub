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
    <ScrollArea className="h-[calc(100vh-10rem)]">
      {extractedData.map((data, index) => (
        <Card key={index} className="mb-4">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base flex justify-between items-center">
              <span className="truncate">{data.fileName}</span>
              <Badge variant="secondary" className="ml-2">
                {data.type}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-muted-foreground">Generated Title: {data.title}</p>
            <p className="text-sm text-muted-foreground mb-2">Date: {data.date}</p>
            <h4 className="font-semibold text-sm mb-1">Key Points:</h4>
            <ul className="list-disc pl-5 mb-2 text-sm">
              {data.keyPoints.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
            {data.financialHighlights && (
              <>
                <h4 className="font-semibold text-sm mb-1">Financial Highlights:</h4>
                <ul className="list-none text-sm">
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

