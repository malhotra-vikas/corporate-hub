"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import UserApi from "@/lib/api/user.api"
import VaultApi from "@/lib/api/vault.api"
import Cookies from 'js-cookie';

type UserRole = "admin" | "companyUser"

interface CompanyDetails {
    name: string
    foundedYear: string
    ceoName: string
    companyTicker: string
    exchange: string
    industry: string
    description: string
    cik: string
    logo: string
}

interface User {
    //uid: string
    fireBaseUid: string
    _id?: string
    email: string | null
    displayName: string | null
    displayTicker: string | null
    companyName: string | null
    companyTicker: string | null
    companyExchange: string | null
    companyCEOName: string | null
    photoURL: string | null
    is_verified: boolean,
    role: UserRole
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
                console.log("User Email  is ", firebaseUser.email)
                console.log("User ID  is ", firebaseUser.uid)

                const userData = await userApi.getClientByEmail(firebaseUser.email || "")

                console.log("My User Data is ", userData)

                const localUser = {
                    fireBaseUid: firebaseUser.uid,
                    //uid: userData._id,
                    email: firebaseUser.email,
                    displayName: userData.displayName,
                    displayTicker: userData.displayTicker,
                    companyName: userData.companyName,
                    companyTicker: userData.companyTicker,
                    companyExchange: userData.companyExchange,
                    companyCEOName: userData.companyCEOName,
                    is_verified: userData.is_verified,
                    photoURL: firebaseUser.photoURL,
                    role: userData.role || "companyUser",
                    _id: userData._id,
                    token: token,
                }
                setUser(localUser)

                console.log("My User Data from getUsr ", localUser)
                // Store the fireBaseUid in localStorage or cookies

                localStorage.setItem('uuid', firebaseUser.uid); // Storing in localStorage
                // Store in cookies (expires in 7 days)
                

            } else {
                setUser(null)
                localStorage.removeItem('uuid'); // Remove from localStorage on sign-out
                Cookies.remove('uuid')
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const signIn = async (email: string, password: string) => {
        try {
            console.log("In Auth ", email)
            const userCredential = await signInWithEmailAndPassword(auth, email.toLowerCase(), password)
            const firebaseUser = userCredential.user

            const userApi = new UserApi()
            const vaultApi = new VaultApi()

            const loginResponse = await userApi.login({ username: email.toLowerCase(), password })
            console.log("Logged is user ", loginResponse)
            console.log("Logged is user ticker ", loginResponse.data.user_info.companyTicker)
            console.log("Logged is user exchange ", loginResponse.data.user_info.companyExchange)

            const localUser = {
                fireBaseUid: loginResponse.data.user_info.fireBaseUid,
                //uid: loginResponse.data.user_info._id,
                email: loginResponse.data.user_info.email,
                displayName: loginResponse.data.user_info.companyName,
                displayTicker: loginResponse.data.user_info.displayTicker,
                companyName: loginResponse.data.user_info.companyName,
                companyTicker: loginResponse.data.user_info.companyTicker,
                companyExchange: loginResponse.data.user_info.companyExchange,
                companyCEOName: loginResponse.data.user_info.companyCEOName,
                photoURL: firebaseUser.photoURL,
                is_verified: loginResponse.data.user_info.is_verified,
                role: loginResponse.data.role || "companyUser",
                _id: loginResponse.data._id,
            }

            setUser(localUser)
            const token = await auth.currentUser?.getIdToken()
            setUser((prevUser) => (prevUser ? { ...prevUser, token } : null))

            localStorage.setItem('uuid', localUser._id); // Storing in localStorage            
            

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

            email = email.toLowerCase()

            // Create a FireBase User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const firebaseUser = userCredential.user

            // Now create a User in the DB too
            const userApi = new UserApi()

            const createCompanyData = {
                email,
                companyName,
                companyTicker,
                fireBaseUid: firebaseUser.uid,
                companyCEOName: companyDetails.ceoName,
                foundedYear: companyDetails.foundedYear,
                companyExchange: companyDetails.exchange,
                companyIndustry: companyDetails.industry,
                companyDescription: companyDetails.description,
                companyCIK: companyDetails.cik,
                companyLogo: companyDetails.logo,
                role: "companyUser", // Default role for new users
            }

            console.log("createUser Request being sent is  ", createCompanyData)

            const createUserResponse = await userApi.createUser(createCompanyData)

            console.log("createUserResponse os ", createUserResponse)
            const localUser = {
                fireBaseUid: createUserResponse.data.fireBaseUid,
                //uid: createUserResponse.data._id,
                email: createUserResponse.data.email,
                displayName: companyName,
                displayTicker: companyTicker,
                companyName: companyName,
                companyTicker: companyTicker,
                companyExchange: companyDetails.exchange,
                companyCEOName: companyDetails.ceoName,
                is_verified: false,
                photoURL: createUserResponse.data.photoURL,
                role: createUserResponse.data.role || "companyUser",
                _id: createUserResponse.data._id,
            }

            setUser(localUser)
            const token = await auth.currentUser?.getIdToken()
            setUser((prevUser) => (prevUser ? { ...prevUser, token } : null))

            localStorage.setItem('uuid', localUser._id); // Storing in localStorage

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
        localStorage.removeItem('userData');  // Optionally clear any persistent session data
        localStorage.removeItem('uuid'); // Cleanig in localStorage



        console.log("User signed out successfully");
    }

    const getToken = async () => {
        if (user?.token) {
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
