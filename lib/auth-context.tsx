"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"

interface AuthContextType {
    user: User | null
    loading: boolean
    mockLogin: () => void
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

    useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => setLoading(false), 1000)
        return () => clearTimeout(timer)
    }, [])

    const mockLogin = () => {
        const mockUser: User = {
            uid: "123456",
            email: "user@example.com",
            displayName: "John Doe",
            photoURL: "/avatars/01.png",
            emailVerified: true,
            isAnonymous: false,
            metadata: {
                creationTime: "2023-01-01T00:00:00Z",
                lastSignInTime: "2023-01-01T00:00:00Z",
            },
            providerData: [],
            refreshToken: "",
            tenantId: null,
            delete: async () => { },
            getIdToken: async () => "",
            getIdTokenResult: async () => ({
                token: "",
                authTime: "",
                issuedAtTime: "",
                expirationTime: "",
                signInProvider: null,
                claims: {},
            }),
            reload: async () => { },
            toJSON: () => ({}),
        }
        setUser(mockUser)
    }

    const mockLogout = () => {
        setUser(null)
    }

    return <AuthContext.Provider value={{ user, loading, mockLogin, mockLogout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

