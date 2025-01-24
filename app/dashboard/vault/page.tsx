import type { Metadata } from "next"
import { getFiles, uploadFile } from "@/app/actions/upload-file"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export interface File {
  id: string
  name: string
  type: string
  size: number
  uploadDate: Date
  category: string
}

const files: File[] = [
  {
    id: "1",
    name: "Q2_2023_Financial_Report.pdf",
    type: "application/pdf",
    size: 2500000,
    uploadDate: new Date("2023-07-15T10:30:00"),
    category: "Earnings Statement",
  },
  {
    id: "2",
    name: "Employee_Handbook_2023.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 1800000,
    uploadDate: new Date("2023-06-01T14:45:00"),
    category: "Other",
  },
  {
    id: "3",
    name: "Marketing_Strategy_2024.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: 5200000,
    uploadDate: new Date("2023-08-22T09:15:00"),
    category: "Other",
  },
  {
    id: "4",
    name: "Product_Launch_Press_Release.txt",
    type: "text/plain",
    size: 15000,
    uploadDate: new Date("2023-09-05T16:20:00"),
    category: "Press Release",
  },
  {
    id: "5",
    name: "Annual_Shareholder_Letter_2023.pdf",
    type: "application/pdf",
    size: 500000,
    uploadDate: new Date("2023-05-10T11:00:00"),
    category: "Shareholder Letter",
  },
]

export const metadata: Metadata = {
  title: "Document Vault",
  description: "Securely store and manage your corporate documents",
}

export default async function VaultPage() {
  const files = await getFiles()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Document Vault</h3>
        <p className="text-sm text-muted-foreground">Securely store and manage your corporate documents</p>
      </div>
      <div className="space-y-4">
        <form action={uploadFile}>
          <div className="flex items-center space-x-2">
            <Input type="file" name="file" required />
            <Button type="submit">Upload</Button>
          </div>
        </form>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">{file.name}</TableCell>
                  <TableCell>{getFileTypeDisplay(file.type)}</TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell>{file.uploadDate.toLocaleString()}</TableCell>
                  <TableCell>{file.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function getFileTypeDisplay(mimeType: string): string {
  const types: { [key: string]: string } = {
    "application/pdf": "PDF",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word Document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PowerPoint",
    "text/plain": "Text File",
    "image/png": "PNG Image",
    "image/jpeg": "JPEG Image",
  }
  return types[mimeType] || mimeType
}

