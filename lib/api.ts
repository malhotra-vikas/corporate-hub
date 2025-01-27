import { type User, Company, type File } from "@/lib/types"

// Dummy user data
const dummyUsers: User[] = [
    { id: "1", name: "John Doe", email: "john@example.com", role: "admin", active: true },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane@acme.com",
        role: "companyUser",
        active: true,
        company: {
            id: "c1",
            name: "Acme Corp",
            description: "A leading provider of innovative solutions",
            industry: "Technology",
            foundedYear: 2000,
            website: "https://acme.com",
            logoUrl: "/acme-logo.png",
            aboutCompany: "<p>Acme Corp is a technology leader...</p>",
            cautionaryNote: "<p>This document contains forward-looking statements...</p>",
            companyDescriptor: "<p>Leading provider of innovative solutions...</p>",
            ceoName: "John Acme",
            contactName: "Jane Acme",
            contactEmail: "contact@acme.com",
            irContactName: "Bob Acme",
            irContactEmail: "ir@acme.com",
            irContactPhone: "+1 (555) 123-4567",
            irCompanyName: "Acme Investor Relations",
        },
    },
    {
        id: "3",
        name: "Bob Johnson",
        email: "bob@globex.com",
        role: "companyUser",
        active: false,
        company: {
            id: "c2",
            name: "Globex Corporation",
            description: "Global leader in synergy",
            industry: "Conglomerate",
            foundedYear: 1989,
            website: "https://globex.com",
            logoUrl: "/globex-logo.png",
            aboutCompany: "<p>Globex Corporation is a multinational conglomerate...</p>",
            cautionaryNote: "<p>Investors should carefully consider the risks...</p>",
            companyDescriptor: "<p>Global leader in synergistic business solutions...</p>",
            ceoName: "Hank Scorpio",
            contactName: "Frank Globex",
            contactEmail: "contact@globex.com",
            irContactName: "Lisa Globex",
            irContactEmail: "ir@globex.com",
            irContactPhone: "+1 (555) 987-6543",
            irCompanyName: "Globex Investor Relations",
        },
    },
]

// Dummy file data
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
    // ... (other file entries)
]

// API functions
export async function getUsers(): Promise<User[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return dummyUsers
}

export async function getUser(id: string): Promise<User | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return dummyUsers.find((user) => user.id === id)
}

export async function updateUser(updatedUser: User): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const index = dummyUsers.findIndex((user) => user.id === updatedUser.id)
    if (index !== -1) {
        dummyUsers[index] = updatedUser
        return updatedUser
    }
    throw new Error("User not found")
}

export async function deleteUser(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = dummyUsers.findIndex((user) => user.id === id)
    if (index !== -1) {
        dummyUsers.splice(index, 1)
    }
}

export async function getFiles(
    page = 1,
    pageSize = 10,
    search = "",
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

// Add more API functions as needed for other data (e.g., companies, documents, etc.)

