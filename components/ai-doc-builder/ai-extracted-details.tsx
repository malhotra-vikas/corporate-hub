import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
      name: string
      category: string
    }
    type: string
  }>
  extractedData: {
    [key: string]: ExtractedData
  }
  onUpdateExtractedData: (fileName: string, field: string, value: string) => void
}

export const AIExtractedDetails: React.FC<AIExtractedDetailsProps> = ({
  documents,
  extractedData,
  onUpdateExtractedData,
}) => {
  const [editingFields, setEditingFields] = useState<{ [key: string]: string[] }>({})

  const handleEdit = (fileName: string, field: string) => {
    setEditingFields((prev) => ({
      ...prev,
      [fileName]: [...(prev[fileName] || []), field],
    }))
  }

  const handleSave = (fileName: string, field: string, value: string) => {
    onUpdateExtractedData(fileName, field, value)
    setEditingFields((prev) => ({
      ...prev,
      [fileName]: prev[fileName].filter((f) => f !== field),
    }))
  }

  const handleCancel = (fileName: string, field: string) => {
    setEditingFields((prev) => ({
      ...prev,
      [fileName]: prev[fileName].filter((f) => f !== field),
    }))
  }

  const renderEditableField = (fileName: string, field: string, isRichText = true) => {
    const isEditing = editingFields[fileName]?.includes(field)
    const value = extractedData[fileName]?.[field as keyof ExtractedData] || ""

    if (isEditing) {
      return (
        <div className="space-y-2">
          {isRichText ? (
            <RichTextEditor
              label={field}
              value={value}
              onChange={(newValue) => onUpdateExtractedData(fileName, field, newValue)}
            />
          ) : (
            <div className="space-y-2">
              <Label htmlFor={`${fileName}-${field}`}>{field}</Label>
              <Input
                id={`${fileName}-${field}`}
                value={value}
                onChange={(e) => onUpdateExtractedData(fileName, field, e.target.value)}
              />
            </div>
          )}
          <div className="space-x-2">
            <Button onClick={() => handleSave(fileName, field, value)}>Save</Button>
            <Button variant="outline" onClick={() => handleCancel(fileName, field)}>
              Cancel
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">{field}</h4>
          <Button variant="outline" size="sm" onClick={() => handleEdit(fileName, field)}>
            Edit
          </Button>
        </div>
        {isRichText ? <div dangerouslySetInnerHTML={{ __html: value }} /> : <p>{value}</p>}
      </div>
    )
  }

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      {documents.map((doc, index) => (
        <Card key={index} className="mb-4">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base flex justify-between items-center">
              <span className="truncate">{doc.file.name}</span>
              <Badge variant="secondary" className="ml-2">
                {doc.type}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            {renderEditableField(doc.file.name, "Generated Name", false)}
            {renderEditableField(doc.file.name, "Generated Headline")}
            {renderEditableField(doc.file.name, "Generated Sub Headline")}
            {renderEditableField(doc.file.name, "Generated Summary")}
            {renderEditableField(doc.file.name, "Generated Key Highlights")}
            {renderEditableField(doc.file.name, "Generated CEO Quote")}
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  )
}

