import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/lib/auth-context"
import { UIProvider } from "@/lib/ui-context"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Providers from "./providers"
import type React from "react" // Added import for React

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: {
    default: "AiirHub - Secure Document Management",
    template: "%s | AiirHub",
  },
  description: "Professional corporate document management platform",
  keywords: ["document management", "corporate", "secure", "professional"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <Providers>
        <AuthProvider>
          <UIProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <div className="relative flex min-h-screen flex-col">
                <MainNav />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </ThemeProvider>
          </UIProvider>
        </AuthProvider>
        <ToastContainer position="top-right" autoClose={5000} />
        </Providers>
      </body>
    </html>
  )
}

