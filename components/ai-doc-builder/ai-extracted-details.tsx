import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const AIExtractedDetails = () => {
  // This is a placeholder for AI-extracted data
  const extractedData = {
    type: "Earnings Statement",
    title: "Q4 2023 Earnings Release",
    date: "February 1, 2024",
    keyPoints: ["Revenue increased by 15% year-over-year", "Net income grew by 22%", "Launched 3 new product lines"],
    financialHighlights: {
      revenue: "$1.2 billion",
      netIncome: "$300 million",
      eps: "$2.50 per share",
    },
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">AI Extracted Details</h2>
      <Card>
        <CardHeader>
          <CardTitle>{extractedData.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">Type: {extractedData.type}</p>
          <p className="text-sm text-muted-foreground mb-4">Date: {extractedData.date}</p>
          <h3 className="font-semibold mb-2">Key Points:</h3>
          <ul className="list-disc pl-5 mb-4">
            {extractedData.keyPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
          <h3 className="font-semibold mb-2">Financial Highlights:</h3>
          <ul className="list-none">
            <li>Revenue: {extractedData.financialHighlights.revenue}</li>
            <li>Net Income: {extractedData.financialHighlights.netIncome}</li>
            <li>EPS: {extractedData.financialHighlights.eps}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

