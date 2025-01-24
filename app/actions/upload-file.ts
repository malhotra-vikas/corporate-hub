"use server"

import { revalidatePath } from "next/cache"

export interface File {
  id: string
  name: string
  type: string
  size: number
  uploadDate: Date
}

// This is a mock database. In a real application, you'd use a proper database.
const files: File[] = [
  {
    id: "1",
    name: "Q2_2023_Financial_Report.pdf",
    type: "application/pdf",
    size: 2500000, // 2.5 MB
    uploadDate: new Date("2023-07-15T10:30:00"),
  },
  {
    id: "2",
    name: "Employee_Handbook_2023.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 1800000, // 1.8 MB
    uploadDate: new Date("2023-06-01T14:45:00"),
  },
  {
    id: "3",
    name: "Marketing_Strategy_2024.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: 5200000, // 5.2 MB
    uploadDate: new Date("2023-08-22T09:15:00"),
  },
  {
    id: "4",
    name: "Product_Launch_Press_Release.txt",
    type: "text/plain",
    size: 15000, // 15 KB
    uploadDate: new Date("2023-09-05T16:20:00"),
  },
  {
    id: "5",
    name: "Company_Logo_2023.png",
    type: "image/png",
    size: 500000, // 500 KB
    uploadDate: new Date("2023-05-10T11:00:00"),
  },
]

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File
  if (!file) {
    throw new Error("No file uploaded")
  }

  // In a real application, you'd upload the file to a storage service here
  // For this example, we'll just store the file metadata
  const newFile = {
    id: Math.random().toString(36).substr(2, 9),
    name: file.name,
    type: file.type,
    size: file.size,
    uploadDate: new Date(),
  }

  files.push(newFile)

  revalidatePath("/dashboard/vault")

  return { success: true, file: newFile }
}

export async function getFiles() {
  // In a real application, you'd fetch this from your database
  return files
}

