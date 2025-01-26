"use server"

import { revalidatePath } from "next/cache"

export interface File {
  id: string
  name: string
  type: string
  size: number
  uploadDate: Date
  category: string
}

// This is a mock database. In a real application, you'd use a proper database.
let files: File[] = [
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
  {
    id: "6",
    name: "Q3_2023_Earnings_Call_Transcript.pdf",
    type: "application/pdf",
    size: 350000,
    uploadDate: new Date("2023-10-20T15:30:00"),
    category: "Earnings Statement",
  },
  {
    id: "7",
    name: "Corporate_Sustainability_Report_2023.pdf",
    type: "application/pdf",
    size: 4200000,
    uploadDate: new Date("2023-11-05T09:00:00"),
    category: "Other",
  },
  {
    id: "8",
    name: "Board_Meeting_Minutes_Oct2023.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 125000,
    uploadDate: new Date("2023-10-31T17:45:00"),
    category: "Other",
  },
  {
    id: "9",
    name: "New_Product_Spec_Sheet.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 750000,
    uploadDate: new Date("2023-09-15T11:20:00"),
    category: "Other",
  },
  {
    id: "10",
    name: "Investor_Presentation_Q4_2023.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: 8500000,
    uploadDate: new Date("2023-12-01T14:00:00"),
    category: "Other",
  },
  {
    id: "11",
    name: "Q4_2023_Financial_Statements.pdf",
    type: "application/pdf",
    size: 3000000,
    uploadDate: new Date("2024-01-20T09:30:00"),
    category: "Earnings Statement",
  },
  {
    id: "12",
    name: "Annual_Report_2023.pdf",
    type: "application/pdf",
    size: 15000000,
    uploadDate: new Date("2024-02-15T10:00:00"),
    category: "Shareholder Letter",
  },
  {
    id: "13",
    name: "Press_Release_New_CEO_Appointment.txt",
    type: "text/plain",
    size: 12000,
    uploadDate: new Date("2024-03-01T08:00:00"),
    category: "Press Release",
  },
  {
    id: "14",
    name: "Q1_2024_Earnings_Presentation.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: 7000000,
    uploadDate: new Date("2024-04-25T16:45:00"),
    category: "Earnings Statement",
  },
  {
    id: "15",
    name: "Corporate_Governance_Guidelines.pdf",
    type: "application/pdf",
    size: 1200000,
    uploadDate: new Date("2023-12-10T13:15:00"),
    category: "Other",
  },
  {
    id: "16",
    name: "Risk_Assessment_Report_2023.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 2800000,
    uploadDate: new Date("2023-11-30T11:45:00"),
    category: "Other",
  },
  {
    id: "17",
    name: "Press_Release_Q1_2024_Results.txt",
    type: "text/plain",
    size: 18000,
    uploadDate: new Date("2024-04-30T07:30:00"),
    category: "Press Release",
  },
  {
    id: "18",
    name: "Shareholder_Meeting_Agenda_2024.pdf",
    type: "application/pdf",
    size: 450000,
    uploadDate: new Date("2024-05-15T09:00:00"),
    category: "Shareholder Letter",
  },
  {
    id: "19",
    name: "Executive_Compensation_Summary_2023.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 980000,
    uploadDate: new Date("2024-03-20T14:30:00"),
    category: "Other",
  },
  {
    id: "20",
    name: "Corporate_Social_Responsibility_Report.pdf",
    type: "application/pdf",
    size: 5500000,
    uploadDate: new Date("2024-02-28T10:15:00"),
    category: "Other",
  },
  {
    id: "21",
    name: "Q2_2024_Financial_Highlights.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: 4800000,
    uploadDate: new Date("2024-07-15T16:00:00"),
    category: "Earnings Statement",
  },
  {
    id: "22",
    name: "Press_Release_Strategic_Partnership.txt",
    type: "text/plain",
    size: 14500,
    uploadDate: new Date("2024-06-01T08:45:00"),
    category: "Press Release",
  },
  {
    id: "23",
    name: "Audit_Committee_Charter.pdf",
    type: "application/pdf",
    size: 720000,
    uploadDate: new Date("2024-01-05T11:30:00"),
    category: "Other",
  },
  {
    id: "24",
    name: "Investor_Day_Presentation_2024.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: 12000000,
    uploadDate: new Date("2024-09-10T13:00:00"),
    category: "Other",
  },
  {
    id: "25",
    name: "Q3_2024_Earnings_Call_Transcript.pdf",
    type: "application/pdf",
    size: 380000,
    uploadDate: new Date("2024-10-25T17:30:00"),
    category: "Earnings Statement",
  },
]

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File
  const category = formData.get("category") as string
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
    category: category || "Other",
  }

  files.push(newFile)

  revalidatePath("/dashboard/vault")

  return { success: true, file: newFile }
}

export async function getFiles(page = 1, pageSize = 10, search = "") {
  // In a real application, you'd fetch this from your database with pagination and search
  let filteredFiles = files
  if (search) {
    filteredFiles = files.filter(
      (file) =>
        file.name.toLowerCase().includes(search.toLowerCase()) ||
        file.category.toLowerCase().includes(search.toLowerCase()),
    )
  }
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedFiles = filteredFiles.slice(startIndex, endIndex)
  return {
    files: paginatedFiles,
    totalPages: Math.ceil(filteredFiles.length / pageSize),
    currentPage: page,
    totalCount: filteredFiles.length,
  }
}

export async function deleteFiles(fileIds: string[]) {
  if (!Array.isArray(fileIds)) {
    throw new Error("fileIds must be an array")
  }
  files = files.filter((file) => !fileIds.includes(file.id))
  revalidatePath("/dashboard/vault")
  return { success: true }
}

export async function getQuarter(date: Date): string {
  const month = date.getMonth()
  const year = date.getFullYear()
  const quarter = Math.floor(month / 3) + 1
  return `Q${quarter} ${year}`
}

