"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import VaultApi from "@/lib/api/vault.api"
import UserApi from "@/lib/api/user.api"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileTextIcon, ImageIcon, PresentationIcon, Trash2Icon, ArrowUpDown } from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { Pagination } from "@/components/ui/pagination"
import Link from "next/link"
import { toast } from "react-toastify"
import type { VaultFile } from "@/lib/types"
import type { File } from "buffer"

export default function VaultPage() {
  const [files, setFiles] = useState<VaultFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("uploadDate")
  const [order, setOrder] = useState("desc")
  const { user, loading } = useAuth()
  const [companyName, setCompanyName] = useState("")

  const userApi = new UserApi()
  const vaultApi = new VaultApi()

  useEffect(() => {
    if (user) {
      loadFiles()
    }
  }, [user])

  const filteredFiles = useMemo(() => {
    console.log("Filtering files with search:", search)
    const filtered = files.filter(
      (file) =>
        (file.originalName && file.originalName.toLowerCase().includes(search.toLowerCase())) ||
        (file.docType && file.docType.toLowerCase().includes(search.toLowerCase())) ||
        (file.mimetype && file.mimetype.toLowerCase().includes(search.toLowerCase())) ||
        (file.uploadedDate && file.uploadedDate.toLowerCase().includes(search.toLowerCase()))
      )
    console.log("Filtered files count:", filtered.length)
    return filtered
  }, [files, search])

  const paginatedFiles = useMemo(() => {
    return filteredFiles.slice((page - 1) * 10, page * 10)
  }, [filteredFiles, page])

  const totalPages = Math.ceil(filteredFiles.length / 10)

  useEffect(() => {
    console.log("Search state changed:", search)
    setPage(1) // Reset to first page when search changes
  }, [search])

  const handleSearchChange = useCallback((value: string) => {
    console.log("Search input changed:", value)
    setSearch(value)
  }, [])

  useEffect(() => {
    console.log("Files loaded:", files.length)
  }, [files])

  const deleteFile = async (fileId: string) => {
    const response = await vaultApi.deleteFile({ fileId: fileId })
    return response
  }

  const uploadFile = async (userId: string, file: File, category: string) => {
    const formData = new FormData()
    formData.append("originalName", file.name)
    formData.append("serverFileName", file.name)
    formData.append("files", file as Blob)
    formData.append("category", category)
    formData.append("user_id", userId)

    const filesTag: any = []
    const tempObj = {
      [file.name]: {
        docType: category,
        useFull: "Both",
      },
    }
    filesTag?.push(tempObj)

    formData.append("tags", JSON.stringify(filesTag))

    try {
      const response = await vaultApi.uploadDocuments(formData)
      return response
    } catch (error) {
      console.error("Error Response:", error.response.data)
      throw error
    }
  }

  const loadFiles = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const companyUser = await userApi.getClientByEmail(user?.email || "")
      const vaultFilesResponse = await vaultApi.getSpecificFiles({ user_id: companyUser._id })

      let files = vaultFilesResponse?.data || []

      // Sort by last modified date (assuming file object has a `lastModified` field)
      files = files.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      
      console.log("Loaded files count:", files.length)

      setFiles(files)

      const companyName = companyUser?.companyName || ""
      setCompanyName(companyName)
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
    const file = formData.get("file") as unknown as File
    const category = formData.get("category") as string

    const companyUser = await userApi.getClientByEmail(user?.email || "")

    console.log("Use for uploda - user = ", companyUser._id)

    try {
      await uploadFile(companyUser._id || "", file, category)
      toast.success("File uploaded successfully")
      loadFiles()
    } catch (error) {
      console.log("Error is ", error)
      toast.error("Failed to upload file")
    }
  }

  const handleDeleteFiles = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) return
    const formData = new FormData(event.currentTarget)
    const fileIds = formData.getAll("fileIds") as string[]
    try {
      await Promise.all(fileIds.map((id) => deleteFile(id)))
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

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900">Welcome {companyName}</h1>
      </header>
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
                    <SelectItem value="Document">Documents</SelectItem>
                    <SelectItem value="Image">Images</SelectItem>
                    <SelectItem value="Presentation">Presentations</SelectItem>
                    <SelectItem value="Press Releases">Press Releases</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit">Upload</Button>
              </div>
              <SearchBar value={search} onChange={handleSearchChange} placeholder="Search files..." />
            </div>
          </form>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Link href="#" onClick={() => toggleSort("name")} className="flex items-center">
                    File Name
                  </Link>
                </TableHead>
                <TableHead>
                  <Link href="#" onClick={() => toggleSort("size")} className="flex items-center">
                    Document Type
                  </Link>
                </TableHead>
                <TableHead>
                  <Link href="#" onClick={() => toggleSort("uploadDate")} className="flex items-center">
                    Uploaded
                  </Link>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFiles.map((file) => (
                <TableRow key={file._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {file.type === "document" && <FileTextIcon className="mr-2 h-4 w-4" />}
                      {file.type === "image" && <ImageIcon className="mr-2 h-4 w-4" />}
                      {file.type === "presentation" && <PresentationIcon className="mr-2 h-4 w-4" />}
                      <a
                        href={file.filePath}
                        target={
                          file.filePath.match(
                            /^https?:\/\/(v1\.aiirbrain\.com|aiirbrain\.com|aiirhub\.com|v1\.aiirhub\.com|localhost)/,
                          )
                            ? "_self"
                            : "_blank"
                        }
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                        onClick={(e) => {
                          if (
                            file.filePath.match(
                              /^https?:\/\/(v1\.aiirbrain\.com|aiirbrain\.com|aiirhub\.com|v1\.aiirhub\.com|localhost)/,
                            )
                          ) {
                            e.preventDefault()
                            window.location.href = file.filePath
                          } else {
                            window.open(file.filePath, "_blank")
                          }
                        }}
                      >
                        {file.originalName}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>{file.docType}</TableCell>
                  <TableCell>{file.uploadedDate ? new Date(file.uploadedDate).toLocaleDateString() : "N/A"}</TableCell>
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
          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(page) => setPage(page)}
              totalCount={filteredFiles.length}
            />
          </div>
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

