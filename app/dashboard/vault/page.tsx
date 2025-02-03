"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import VaultApi from "@/lib/api/vault.api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileTextIcon, ImageIcon, PresentationIcon, Trash2Icon, ArrowUpDown } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { SearchBar } from "@/components/search-bar"
import { Pagination } from "@/components/ui/pagination"
import Link from "next/link"
import { toast } from "react-toastify"
import { getFiles } from "@/lib/api/vault"
import { VaultFile } from "@/lib/types"


export default function VaultPage() {
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("uploadDate")
  const [order, setOrder] = useState("desc")
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadFiles()
    }
  }, [user, page, search, sort, order])

  const vaultApi = new VaultApi();

  const loadFiles = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      console.log("Gettng vaultFilesResponse for User ", user.uid)

      const vaultFilesResponse = await vaultApi.getSpecificFiles({ user_id: user.uid})

      console.log("vaultFilesResponse is ", vaultFilesResponse)

      let files

      if (vaultFilesResponse && vaultFilesResponse.data && vaultFilesResponse.data.length > 0) {
        files = vaultFilesResponse.data
      } else {
        files = []
      }

      const { totalPages, currentPage, totalCount } = await getFiles(page, 10, search, sort, order)

      setFiles(files)
      // Update pagination state here if needed
    } catch (error) {
      toast.error("Failed to load files")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleFileUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return
    const formData = new FormData(event.currentTarget)
    const file = formData.get("file") as File
    const category = formData.get("category") as string
    try {
      
      //await uploadFile(user.uid, file, category)
      toast.success("File uploaded successfully")
      loadFiles()
    } catch (error) {
      toast.error("Failed to upload file")
    }
  }

  const handleDeleteFiles = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) return
    const formData = new FormData(event.currentTarget)
    const fileIds = formData.getAll("fileIds") as string[]
    try {
      //await Promise.all(fileIds.map((id) => deleteFile(user.uid, id)))
      toast.success("Files deleted successfully")
      loadFiles()
    } catch (error) {
      toast.error("Failed to delete files")
    }
  }

  const toggleSort = (column: string) => {
    if (sort === column) {
      setOrder(order === "asc" ? "desc" : "asc")
    } else {
      setSort(column)
      setOrder("asc")
    }
  }
  
  const totalPages = Math.ceil(files.length / 10)

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Vault</CardTitle>
          <CardDescription>Securely store and manage your important documents.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFileUpload} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Input type="file" name="file" className="mr-4" />
                <Select name="category">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Documents</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="presentation">Presentations</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit">Upload</Button>
              </div>
              <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files..." />
            </div>
          </form>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Link href="#" onClick={() => toggleSort("name")} className="flex items-center">
                    File Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Link>
                </TableHead>
                <TableHead>
                  <Link href="#" onClick={() => toggleSort("type")} className="flex items-center">
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Link>
                </TableHead>
                <TableHead>
                  <Link href="#" onClick={() => toggleSort("size")} className="flex items-center">
                    Size
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Link>
                </TableHead>
                <TableHead>
                  <Link href="#" onClick={() => toggleSort("uploadDate")} className="flex items-center">
                    Uploaded
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Link>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {file.type === "document" && <FileTextIcon className="mr-2 h-4 w-4" />}
                      {file.type === "image" && <ImageIcon className="mr-2 h-4 w-4" />}
                      {file.type === "presentation" && <PresentationIcon className="mr-2 h-4 w-4" />}
                      {file.originalName}
                    </div>
                  </TableCell>
                  <TableCell>{file.mimetype}</TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell>
                    {file.uploadDate ? file.uploadDate.toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell>
                    <form onSubmit={handleDeleteFiles}>
                      <input type="hidden" name="fileIds" value={file._id} />
                      <Button type="submit" variant="ghost" size="sm">
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(page) => setPage(page)} totalCount={0} />
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

