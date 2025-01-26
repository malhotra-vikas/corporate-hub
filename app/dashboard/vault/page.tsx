import type { Metadata } from "next"
import { getFiles, uploadFile, getQuarter } from "@/app/actions/upload-file"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { FileIcon, FileTextIcon, ImageIcon, PresentationIcon, Trash2Icon } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { SearchBar } from "@/components/search-bar"
import { DeleteFilesForm } from "@/components/delete-files-form"

export const metadata: Metadata = {
  title: "Document Vault",
  description: "Securely store and manage your corporate documents",
}

export default async function VaultPage({
  searchParams,
}: {
  searchParams: { page: string; search: string }
}) {
  const page = Number(searchParams.page) || 1
  const search = searchParams.search || ""
  const { files, totalPages, currentPage } = await getFiles(page, 10, search)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Vault</CardTitle>
          <CardDescription>Securely store and manage your corporate documents</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={uploadFile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="file">Select File</Label>
                <Input id="file" type="file" name="file" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Document Category</Label>
                <Select name="category" defaultValue="other">
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="press_release">Press Release</SelectItem>
                    <SelectItem value="earnings_statement">Earnings Statement</SelectItem>
                    <SelectItem value="shareholder_letter">Shareholder Letter</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit">Upload Document</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <SearchBar />
          </div>
          <DeleteFilesForm>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Select</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Quarter</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>
                        <Checkbox name="selectedFiles" value={file.id} />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(file.type)}
                          <span>{file.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getFileTypeDisplay(file.type)}</TableCell>
                      <TableCell>{formatFileSize(file.size)}</TableCell>
                      <TableCell>{formatDate(file.uploadDate)}</TableCell>
                      <TableCell>{getQuarter(new Date(file.uploadDate))}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {file.category}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <Button type="submit" variant="destructive">
                <Trash2Icon className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
              <Pagination totalPages={totalPages} currentPage={currentPage} />
            </div>
          </DeleteFilesForm>
        </CardContent>
      </Card>
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
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PowerPoint",
    "text/plain": "Text",
    "image/png": "PNG",
    "image/jpeg": "JPEG",
  }
  return types[mimeType] || "Other"
}

function getFileIcon(mimeType: string) {
  switch (mimeType) {
    case "application/pdf":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "text/plain":
      return <FileTextIcon className="h-5 w-5 text-gray-500" />
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return <PresentationIcon className="h-5 w-5 text-gray-500" />
    case "image/png":
    case "image/jpeg":
      return <ImageIcon className="h-5 w-5 text-gray-500" />
    default:
      return <FileIcon className="h-5 w-5 text-gray-500" />
  }
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

