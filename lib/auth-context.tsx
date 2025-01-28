"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { auth } from "@/lib/firebase"
import {
    onAuthStateChanged,
    User as FirebaseUser,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth"
import UserApi from "@/lib/api/user.api"

type UserRole = "admin" | "companyUser"

interface User {
    uid: string
    email: string | null
    displayName: string | null
    photoURL: string | null
    role: UserRole
    _id?: string
    token?: string
}

interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, name: string) => Promise<void>
    signOut: () => Promise<void>
    getToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signIn: async () => { },
    signUp: async () => { },
    signOut: async () => { },
    getToken: async () => null,
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const token = await firebaseUser.getIdToken()
                // Here you would typically fetch additional user data from your backend
                const userApi = new UserApi()
                const userData = await userApi.getClientByEmail(firebaseUser.email || "")
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                    role: userData.role || "companyUser",
                    _id: userData._id,
                    token: token,
                })
            } else {
                setUser(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const signIn = async (email: string, password: string) => {
        try {
            console.log("In Auth ", email)
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const firebaseUser = userCredential.user

            console.log("In Auth firebaseUser ", firebaseUser)

            // Call your backend API
            const userApi = new UserApi()
            console.log("In Auth userApi ", userApi)

            const loginResponse = await userApi.login({ username: email, password })
            console.log("In Auth loginResponse ", loginResponse)

            // Combine Firebase user data with your backend data
            setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                role: loginResponse.data.role || "companyUser",
                _id: loginResponse.data._id,
            })
            // After successful sign in, update the user state with the token
            const token = await auth.currentUser?.getIdToken()
            setUser((prevUser) => (prevUser ? { ...prevUser, token } : null))
        } catch (error) {
            console.error("Error signing in:", error)
            if (error instanceof Error) {
                if (error.message.includes("auth/user-not-found")) {
                    throw new Error("No user found with this email address. Please check your email or sign up.")
                } else if (error.message.includes("auth/wrong-password")) {
                    throw new Error("Incorrect password. Please try again.")
                } else if (error.message.includes("auth/invalid-credential")) {
                    throw new Error("Invalid credentials. Please check your email and password.")
                } else {
                    throw new Error("An error occurred during sign in. Please try again later.")
                }
            } else {
                throw new Error("An unexpected error occurred. Please try again later.")
            }
        }
    }

    const signUp = async (email: string, password: string, name: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const firebaseUser = userCredential.user

            console.log("in signup ", firebaseUser)

            // Call your backend API
            const userApi = new UserApi()
            const createUserResponse = await userApi.createUser({
                email
            })
            console.log("in signup createUserResponse ", createUserResponse)

            // Combine Firebase user data with your backend data
            setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: name,
                photoURL: firebaseUser.photoURL,
                role: createUserResponse.data.role || "companyUser",
                _id: createUserResponse.data._id,
            })
            // After successful sign up, update the user state with the token
            const token = await auth.currentUser?.getIdToken()
            setUser((prevUser) => (prevUser ? { ...prevUser, token } : null))
        } catch (error) {
            console.error("Error signing up:", error)
            if (error instanceof Error) {
                throw new Error("An error occurred during sign up. Please try again later.")
            } else {
                throw new Error("An unexpected error occurred. Please try again later.")
            }
        }
    }

    const signOut = async () => {
        await auth.signOut()
        setUser(null)
    }

    const getToken = async () => {
        if (user && user.token) {
            return user.token
        }
        const token = await auth.currentUser?.getIdToken()
        if (token) {
            setUser((prevUser) => (prevUser ? { ...prevUser, token } : null))
        }
        return token || null
    }

    const testFirebaseAuth = async () => {
        try {
            const testUser = await signInWithEmailAndPassword(auth, "test@example.com", "testpassword")
            console.log("Test authentication successful:", testUser)
        } catch (error) {
            console.error("Test authentication failed:", error)
        }
    }

    useEffect(() => {
        testFirebaseAuth()
    }, [auth]) // Added auth to dependencies

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, getToken }}>{children}</AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

