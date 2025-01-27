import type { User } from "@/lib/types"

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
    // ... (other dummy users)
]

export async function getUsers(): Promise<User[]> {
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

