import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { AuthProvider } from "@/lib/auth-context"
import { UIProvider } from "@/lib/ui-context"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: {
    default: "CorporateHub - Secure Document Management",
    template: "%s | CorporateHub",
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
        <AuthProvider>
          <UIProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <div className="relative flex min-h-screen flex-col">
                <MainNav />
                <div className="flex-1">{children}</div>
              </div>
            </ThemeProvider>
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

