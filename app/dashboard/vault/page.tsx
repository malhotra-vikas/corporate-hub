import type { Metadata } from "next"
import { getFiles, uploadFile } from "@/app/actions/upload-file"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">{file.name}</TableCell>
                  <TableCell>{getFileTypeDisplay(file.type)}</TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell>{file.uploadDate.toLocaleString()}</TableCell>
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

