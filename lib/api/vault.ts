import type { File } from "@/lib/types"

// Dummy file data moved from upload-file.ts
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
    // ... (rest of the dummy files)
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

