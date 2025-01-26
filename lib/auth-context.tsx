"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type UserRole = "admin" | "companyUser"

interface User {
    uid: string
    email: string
    displayName: string
    photoURL: string | null
    role: UserRole
}

interface AuthContextType {
    user: User | null
    loading: boolean
    mockLogin: (role: UserRole) => void
    mockLogout: () => void
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    mockLogin: () => { },
    mockLogout: () => { },
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const mockLogin = (role: UserRole) => {
        const mockUser: User = {
            uid: "123456",
            email: role === "admin" ? "admin@example.com" : "user@example.com",
            displayName: role === "admin" ? "Admin User" : "Company User",
            photoURL: "/avatars/01.png",
            role: role,
        }
        setUser(mockUser)
        setLoading(false)
    }

    const mockLogout = () => {
        setUser(null)
        setLoading(false)
    }

    return <AuthContext.Provider value={{ user, loading, mockLogin, mockLogout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

