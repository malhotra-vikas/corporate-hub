export interface Company {
    id: string
    name: string
    description: string
    industry: string
    foundedYear: number
    website: string
    logoUrl?: string
}

export interface User {
    id: string
    name: string
    email: string
    role: "admin" | "companyUser"
    active: boolean
    company?: Company // Only for companyUser role
}

