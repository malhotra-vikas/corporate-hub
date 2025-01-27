import type { File } from "@/lib/types"

const dummyFiles: File[] = [
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
    name: "Q1_2023_Earnings_Call_Transcript.pdf",
    type: "application/pdf",
    size: 1200000,
    uploadDate: new Date("2023-04-20T09:15:00"),
    category: "Earnings Statement",
  },
  {
    id: "4",
    name: "Annual_Report_2022.pdf",
    type: "application/pdf",
    size: 5000000,
    uploadDate: new Date("2023-03-01T11:00:00"),
    category: "Shareholder Letter",
  },
  {
    id: "5",
    name: "Board_Meeting_Minutes_July2023.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 500000,
    uploadDate: new Date("2023-07-31T16:30:00"),
    category: "Other",
  },
  {
    id: "6",
    name: "Product_Launch_Presentation.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: 8000000,
    uploadDate: new Date("2023-08-05T13:45:00"),
    category: "Press Release",
  },
  {
    id: "7",
    name: "Q3_2023_Forecast.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 1500000,
    uploadDate: new Date("2023-07-01T10:00:00"),
    category: "Other",
  },
  {
    id: "8",
    name: "Sustainability_Report_2023.pdf",
    type: "application/pdf",
    size: 3500000,
    uploadDate: new Date("2023-09-15T14:20:00"),
    category: "Other",
  },
  {
    id: "9",
    name: "Merger_Announcement_Draft.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 750000,
    uploadDate: new Date("2023-08-20T11:30:00"),
    category: "Press Release",
  },
  {
    id: "10",
    name: "Q4_2022_Financial_Statements.pdf",
    type: "application/pdf",
    size: 2800000,
    uploadDate: new Date("2023-01-31T09:00:00"),
    category: "Earnings Statement",
  },
  {
    id: "11",
    name: "Investor_Day_2023_Agenda.pdf",
    type: "application/pdf",
    size: 600000,
    uploadDate: new Date("2023-09-01T15:45:00"),
    category: "Other",
  },
  {
    id: "12",
    name: "Corporate_Governance_Guidelines.pdf",
    type: "application/pdf",
    size: 1000000,
    uploadDate: new Date("2023-05-12T10:30:00"),
    category: "Other",
  },
  {
    id: "13",
    name: "Q2_2023_Earnings_Press_Release.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 450000,
    uploadDate: new Date("2023-07-20T08:00:00"),
    category: "Press Release",
  },
  {
    id: "14",
    name: "Annual_Shareholder_Meeting_Presentation.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: 12000000,
    uploadDate: new Date("2023-05-15T13:00:00"),
    category: "Shareholder Letter",
  },
  {
    id: "15",
    name: "Risk_Assessment_Report_2023.pdf",
    type: "application/pdf",
    size: 3200000,
    uploadDate: new Date("2023-06-30T11:15:00"),
    category: "Other",
  },
  {
    id: "16",
    name: "Executive_Compensation_Summary.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 900000,
    uploadDate: new Date("2023-04-01T09:30:00"),
    category: "Other",
  },
  {
    id: "17",
    name: "Q1_2023_Investor_Presentation.pdf",
    type: "application/pdf",
    size: 7500000,
    uploadDate: new Date("2023-04-15T14:00:00"),
    category: "Earnings Statement",
  },
  {
    id: "18",
    name: "Code_of_Ethics.pdf",
    type: "application/pdf",
    size: 800000,
    uploadDate: new Date("2023-02-28T10:45:00"),
    category: "Other",
  },
  {
    id: "19",
    name: "Strategic_Plan_2024-2026.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: 5500000,
    uploadDate: new Date("2023-09-30T16:00:00"),
    category: "Other",
  },
  {
    id: "20",
    name: "Q3_2023_Earnings_Call_Script.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 350000,
    uploadDate: new Date("2023-10-15T09:45:00"),
    category: "Earnings Statement",
  },
  {
    id: "21",
    name: "Dividend_Declaration_August2023.pdf",
    type: "application/pdf",
    size: 250000,
    uploadDate: new Date("2023-08-10T11:30:00"),
    category: "Press Release",
  },
  {
    id: "22",
    name: "ESG_Report_2023.pdf",
    type: "application/pdf",
    size: 4800000,
    uploadDate: new Date("2023-07-31T15:20:00"),
    category: "Other",
  },
  {
    id: "23",
    name: "Board_of_Directors_Bios.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 1100000,
    uploadDate: new Date("2023-03-15T13:10:00"),
    category: "Other",
  },
  {
    id: "24",
    name: "Q2_2023_Financial_Statements.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 2200000,
    uploadDate: new Date("2023-07-31T10:00:00"),
    category: "Earnings Statement",
  },
  {
    id: "25",
    name: "Proxy_Statement_2023.pdf",
    type: "application/pdf",
    size: 3800000,
    uploadDate: new Date("2023-04-01T09:00:00"),
    category: "Shareholder Letter",
  },
]

export async function getFiles(
  page = 1,
  pageSize = 10,
  search = "",
  sort = "uploadDate",
  order = "desc",
): Promise<{ files: File[]; totalPages: number; currentPage: number; totalCount: number }> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  let filteredFiles = dummyFiles
  if (search) {
    filteredFiles = dummyFiles.filter(
      (file) =>
        file.name.toLowerCase().includes(search.toLowerCase()) ||
        file.category.toLowerCase().includes(search.toLowerCase()),
    )
  }

  // Sort the files
  filteredFiles.sort((a, b) => {
    if (sort === "name" || sort === "type" || sort === "category") {
      return order === "asc" ? a[sort].localeCompare(b[sort]) : b[sort].localeCompare(a[sort])
    } else if (sort === "size" || sort === "uploadDate") {
      return order === "asc" ? (a[sort] as number) - (b[sort] as number) : (b[sort] as number) - (a[sort] as number)
    } else if (sort === "quarter") {
      const quarterA = getQuarter(new Date(a.uploadDate))
      const quarterB = getQuarter(new Date(b.uploadDate))
      return order === "asc" ? quarterA.localeCompare(quarterB) : quarterB.localeCompare(quarterA)
    }
    return 0
  })

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

export async function uploadFile(file: File): Promise<File> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  const newFile = { ...file, id: (dummyFiles.length + 1).toString() }
  dummyFiles.push(newFile)
  return newFile
}

export async function deleteFiles(fileIds: string[]): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  fileIds.forEach((id) => {
    const index = dummyFiles.findIndex((file) => file.id === id)
    if (index !== -1) {
      dummyFiles.splice(index, 1)
    }
  })
}

function getQuarter(date: Date): string {
  const month = date.getMonth()
  const year = date.getFullYear()
  const quarter = Math.floor(month / 3) + 1
  return `${year}-Q${quarter}`
}

