import type { Metadata } from "next"
import Link from "next/link"

import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/sidebar-nav"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Corporate Hub Dashboard",
}

const sidebarNavItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: "layout",
  },
  {
    title: "Hub",
    href: "/hub",
    icon: "globe",
  },
  {
    title: "Documents",
    href: "/dashboard/documents",
    icon: "file-text",
  },
  {
    title: "Vault",
    href: "/dashboard/vault",
    icon: "lock",
  },
  {
    title: "AI Doc Builder",
    href: "/ai-doc-builder",
    icon: "cpu",
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: "user",
  },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col bg-gray-100 p-4 md:flex">
        <div className="mb-4">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="CorporateHub" className="h-8 w-auto" />
            <span className="font-bold text-xl">CorporateHub</span>
          </Link>
        </div>
        <SidebarNav items={sidebarNavItems} />
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Manage your documents and account</p>
            </div>
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
              Back to Home
            </Link>
          </div>
          <Separator className="my-6" />
          {children}
        </div>
      </main>
    </div>
  )
}

