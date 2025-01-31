"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import UserApi from "@/lib/api/user.api"

type UserRole = "admin" | "companyUser"

interface CompanyDetails {
    name: string
    foundedYear: string
    ceoName: string
    companyTicker: string
    exchange: string
}

interface User {
    uid: string
    email: string | null
    displayName: string | null
    displayTicker: string | null
    companyName: string | null
    companyTicker: string | null
    companyExchange: string | null
    companyCEOName: string | null
    photoURL: string | null
    role: UserRole
    _id?: string
    token?: string
    }

interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, companyName: string, companyTicker: string, companyDetails: CompanyDetails) => Promise<void>
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
                const userApi = new UserApi()
                const userData = await userApi.getClientByEmail(firebaseUser.email || "")
                console.log("User Email  is ", firebaseUser.email)

                console.log("My User Data is ", userData)
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: userData.displayName,
                    displayTicker: userData.displayTicker,
                    companyName: userData.companyName,
                    companyTicker: userData.companyTicker,
                    companyExchange: userData.companyExchange,
                    companyCEOName: userData.companyCEOName,
                    photoURL: firebaseUser.photoURL,
                    role: userData.role || "companyUser",
                    _id: userData._id,
                    token: token,
                })

                console.log("My User Data from getUsr ", user?.companyExchange)

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

            const userApi = new UserApi()
            const loginResponse = await userApi.login({ username: email, password })
            console.log("Logged is user ", loginResponse)
            console.log("Logged is user ticker ", loginResponse.data.user_info.companyTicker)
            console.log("Logged is user exchange ", loginResponse.data.user_info.companyExchange)

            setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: loginResponse.data.user_info.companyName,
                displayTicker: loginResponse.data.user_info.displayTicker,
                companyName: loginResponse.data.user_info.companyName,
                companyTicker: loginResponse.data.user_info.companyTicker,
                companyExchange: loginResponse.data.user_info.companyExchange,
                companyCEOName: loginResponse.data.user_info.companyCEOName,                
                photoURL: firebaseUser.photoURL,
                role: loginResponse.data.role || "companyUser",
                _id: loginResponse.data._id,
            })
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

    const signUp = async (email: string, password: string, companyName: string, companyTicker: string, companyDetails: CompanyDetails) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const firebaseUser = userCredential.user

            const userApi = new UserApi()
            const createUserResponse = await userApi.createUser({
                email,
                companyName,
                companyTicker,
                firebase_uid: firebaseUser.uid,
                companyCEOName: companyDetails.ceoName,
                foundedYear: companyDetails.foundedYear,
                companyExchange: companyDetails.exchange,
                role: "companyUser", // Default role for new users
            })

            setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: companyName,
                displayTicker: companyTicker,
                companyName: companyName,
                companyTicker: companyTicker,
                companyExchange: companyDetails.exchange,
                companyCEOName: companyDetails.ceoName,

                photoURL: firebaseUser.photoURL,
                role: createUserResponse.data.role || "companyUser",
                _id: createUserResponse.data._id,
            })
            const token = await auth.currentUser?.getIdToken()
            setUser((prevUser) => (prevUser ? { ...prevUser, token } : null))
        } catch (error) {
            console.error("Error signing up:", error)
            if (error instanceof Error) {
                if (error.message.includes("auth/email-already-in-use")) {
                    throw new Error("This email is already in use. Please try signing in or use a different email.")
                } else {
                    throw new Error("An error occurred during sign up. Please try again later.")
                }
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

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, getToken }}>{children}</AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

