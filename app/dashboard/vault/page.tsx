"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import VaultApi from "@/lib/api/vault.api"
import UserApi from "@/lib/api/user.api"

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
import { File } from "buffer"
import router from "next/router"

export default function VaultPage() {
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("uploadDate")
  const [order, setOrder] = useState("desc")
  const { user, loading, signIn } = useAuth()
  const [companyName, setCompanyName] = useState("")

  console.log("in VaultPage user os ", user)

  const userApi = new UserApi()

  useEffect(() => {
    if (user) {
      loadFiles()
    }
  }, [])

  const vaultApi = new VaultApi();

  const deleteFile = async (fileId: string) => {
    const response = await vaultApi.deleteFile({ fileId: fileId });

    return response;
  }

  const uploadFile = async (userId: string, file: File, category: string) => {

    console.log("In upload")
    const formData = new FormData();
    formData.append("originalName", file.name);
    formData.append("serverFileName", file.name)
    formData.append("files", file as Blob);
    formData.append("category", category);
    formData.append("user_id", userId);

    let filesTag: any = [];
    let tempObj = {
      [file.name]: {
        docType: category,
        useFull: "Both",
      },
    };
    filesTag?.push(tempObj);

    formData.append("tags", JSON.stringify(filesTag));

    // Log form data manually to inspect it (FormData cannot be logged directly)
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await vaultApi.uploadDocuments(formData)
      return response;
    } catch (error) {
      console.error("Error Response:", error.response.data);

      throw error;  // rethrow the error after logging for further handling if necessary

    }

  }

  const loadFiles = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const companyUser = await userApi.getClientByEmail(user?.email || "")
      console.log("companyUser is ", companyUser)

      const vaultFilesResponse = await vaultApi.getSpecificFiles({ user_id: companyUser._id })


      let files

      if (vaultFilesResponse && vaultFilesResponse.data && vaultFilesResponse.data.length > 0) {
        files = vaultFilesResponse.data
      } else {
        files = []
      }

      console.log("vaultFiles are  ", files)

      //const { totalPages, currentPage, totalCount } = await getFiles(page, 10, search, sort, order)

      setFiles(files)

      const companyName = companyUser?.companyName || ""
      setCompanyName(companyName)

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
    const file = formData.get("file") as unknown as File
    const category = formData.get("category") as string

    console.log("File is ", file)
    console.log("File Category is ", category)

    try {

      await uploadFile(user._id || '', file, category)
      toast.success("File uploaded successfully")
      loadFiles()
    } catch (error) {
      console.log("Err ror is ", error)
      toast.error("Failed to upload file")
    }
  }

  const handleDeleteFiles = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) return
    const formData = new FormData(event.currentTarget)
    const fileIds = formData.getAll("fileIds") as string[]
    try {
      await Promise.all(fileIds.map((id) => deleteFile(id))); // `deleteFile` expects a string (fileId)

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
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900">Welcome {companyName}</h1>
        <p className="text-sm text-gray-500">Powered by AiirHub</p>
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
                    Document Type
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
                      <a
                        href={file.filePath}
                        target={file.filePath.match(/^https?:\/\/(v1\.aiirbrain\.com|aiirbrain\.com|aiirhub\.com|v1\.aiirhub\.com|localhost)/) ? "_self" : "_blank"}
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                        onClick={(e) => {
                          // Check if the file path starts with any of the specified domains
                          if (file.filePath.match(/^https?:\/\/(v1\.aiirbrain\.com|aiirbrain\.com|aiirhub\.com|v1\.aiirhub\.com|localhost)/)) {
                            // Prevent default action (opening the link) and trigger download
                            e.preventDefault();
                            window.location.href = file.filePath;  // This will trigger the download
                          } else {
                            // For external files, allow them to open in a new tab
                            window.open(file.filePath, '_blank');
                          }
                        }}
                      >
                        {file.originalName}
                      </a>

                    </div>
                  </TableCell>
                  <TableCell>{file.mimetype}</TableCell>
                  <TableCell>{file.docType}</TableCell>
                  <TableCell>
                    {file.uploadedDate ? new Date(file.uploadedDate).toLocaleDateString() : "N/A"}
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
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(page) => setPage(page)} totalCount={files.length} />
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




