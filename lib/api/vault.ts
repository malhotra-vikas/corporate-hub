import type { VaultFile } from "@/lib/types"


const dummyFiles: VaultFile[] = [
  {
    _id: "1",
    originalName: "Q2_2023_Financial_Report.pdf",
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
    type: "application/pdf",
    size: 2500000,
    uploadDate: new Date("2023-07-15T10:30:00"),
    category: "Earnings Statement",
  },
  {
    _id: "2",
    originalName: "Employee_Handbook_2023.docx",
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",    
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 1800000,
    uploadDate: new Date("2023-06-01T14:45:00"),
    category: "Other",
  },
  {
    _id: "3",
    originalName: "Q1_2023_Earnings_Call_Transcript.pdf",
    type: "application/pdf",
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",    
    size: 1200000,
    uploadDate: new Date("2023-04-20T09:15:00"),
    category: "Earnings Statement",
  },
  {
    _id: "4",
    originalName: "Annual_Report_2022.pdf",
    type: "application/pdf",
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
    size: 5000000,
    uploadDate: new Date("2023-03-01T11:00:00"),
    category: "Shareholder Letter",
  },
  {
    _id: "5",
    originalName: "Board_Meeting_Minutes_July2023.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
    size: 500000,
    uploadDate: new Date("2023-07-31T16:30:00"),
    category: "Other",
  },
  {
    _id: "6",
    originalName: "Product_Launch_Presentation.pptx",
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: 8000000,
    uploadDate: new Date("2023-08-05T13:45:00"),
    category: "Press Release",
  },
  {
    _id: "7",
    originalName: "Q3_2023_Forecast.xlsx",
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 1500000,
    uploadDate: new Date("2023-07-01T10:00:00"),
    category: "Other",
  },
  {
    _id: "8",
    originalName: "Sustainability_Report_2023.pdf",
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
    type: "application/pdf",
    size: 3500000,
    uploadDate: new Date("2023-09-15T14:20:00"),
    category: "Other",
  },
  {
    _id: "9",
    originalName: "Merger_Announcement_Draft.docx",
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 750000,
    uploadDate: new Date("2023-08-20T11:30:00"),
    category: "Press Release",
  },
  {
    _id: "10",
    originalName: "Q4_2022_Financial_Statements.pdf",
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
    type: "application/pdf",
    size: 2800000,
    uploadDate: new Date("2023-01-31T09:00:00"),
    category: "Earnings Statement",
  },
  {
    _id: "11",
    originalName: "Investor_Day_2023_Agenda.pdf",
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
    type: "application/pdf",
    size: 600000,
    uploadDate: new Date("2023-09-01T15:45:00"),
    category: "Other",
  },
  {
    _id: "12",
    originalName: "Corporate_Governance_Gu_idelines.pdf",
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
    type: "application/pdf",
    size: 1000000,
    uploadDate: new Date("2023-05-12T10:30:00"),
    category: "Other",
  },
  {
    _id: "13",
    originalName: "Q2_2023_Earnings_Press_Release.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
    size: 450000,
    uploadDate: new Date("2023-07-20T08:00:00"),
    category: "Press Release",
  },
  {
    _id: "14",
    originalName: "Annual_Shareholder_Meeting_Presentation.pptx",
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: 12000000,
    uploadDate: new Date("2023-05-15T13:00:00"),
    category: "Shareholder Letter",
  },
  {
    _id: "15",
    originalName: "Risk_Assessment_Report_2023.pdf",
    type: "application/pdf",
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
    size: 3200000,
    uploadDate: new Date("2023-06-30T11:15:00"),
    category: "Other",
  },
  {
    _id: "16",
    originalName: "Executive_Compensation_Summary.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 900000,
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
    uploadDate: new Date("2023-04-01T09:30:00"),
    category: "Other",
  },
  {
    _id: "17",
    originalName: "Q1_2023_Investor_Presentation.pdf",
    type: "application/pdf",
    size: 7500000,
    uploadDate: new Date("2023-04-15T14:00:00"),
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
    category: "Earnings Statement",
  },
  {
    _id: "18",
    originalName: "Code_of_Ethics.pdf",
    type: "application/pdf",
    size: 800000,
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
    uploadDate: new Date("2023-02-28T10:45:00"),
    category: "Other",
  },
  {
    _id: "19",
    originalName: "Strategic_Plan_2024-2026.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: 5500000,
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
    uploadDate: new Date("2023-09-30T16:00:00"),
    category: "Other",
  },
  {
    _id: "20",
    originalName: "Q3_2023_Earnings_Call_Script.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 350000,
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
    uploadDate: new Date("2023-10-15T09:45:00"),
    category: "Earnings Statement",
  },
  {
    _id: "21",
    originalName: "Div_idend_Declaration_August2023.pdf",
    type: "application/pdf",
    size: 250000,
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
    uploadDate: new Date("2023-08-10T11:30:00"),
    category: "Press Release",
  },
  {
    _id: "22",
    originalName: "ESG_Report_2023.pdf",
    type: "application/pdf",
    size: 4800000,
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
    uploadDate: new Date("2023-07-31T15:20:00"),
    category: "Other",
  },
  {
    _id: "23",
    originalName: "Board_of_Directors_Bios.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 1100000,
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
    uploadDate: new Date("2023-03-15T13:10:00"),
    category: "Other",
  },
  {
    _id: "24",
    originalName: "Q2_2023_Financial_Statements.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 2200000,
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
    uploadDate: new Date("2023-07-31T10:00:00"),
    category: "Earnings Statement",
  },
  {
    _id: "25",
    originalName: "Proxy_Statement_2023.pdf",
    type: "application/pdf",
    size: 3800000,
    serverFileName: "Q2_2023_Financial_Report.pdf",
    filePath: "Q2_2023_Financial_Report.pdf",
    mimetype: "application/pdf",
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
): Promise<{ files: VaultFile[]; totalPages: number; currentPage: number; totalCount: number }> {


  let filteredFiles = dummyFiles

  if (search && filteredFiles) {
    filteredFiles = dummyFiles.filter(
      (file) =>
        file.originalName.toLowerCase().includes(search.toLowerCase()) ||
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

export async function uploadFile(file: VaultFile): Promise<VaultFile> {
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

