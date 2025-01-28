"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface UIContextType {
    isLoading: boolean
    setIsLoading: (isLoading: boolean) => void
    theme: "light" | "dark"
    toggleTheme: () => void
}

const UIContext = createContext<UIContextType>({
    isLoading: false,
    setIsLoading: () => { },
    theme: "light",
    toggleTheme: () => { },
})

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [theme, setTheme] = useState<"light" | "dark">("light")

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
    }

    return <UIContext.Provider value={{ isLoading, setIsLoading, theme, toggleTheme }}>{children}</UIContext.Provider>
}

export const useUI = () => useContext(UIContext)

