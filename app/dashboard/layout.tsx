import type { Metadata } from "next"
import Link from "next/link"

import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/sidebar-nav"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Aiir Hub Dashboard",
}

const sidebarNavItems = [
  {
    title: "Overview",
    href: "/dashboard",
  },
  {
    title: "Hub",
    href: "/hub",
  },
  {
    title: "Documents",
    href: "/dashboard/documents",
  },
  {
    title: "Vault",
    href: "/dashboard/vault",
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
  },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="space-y-6 p-10 pb-16">
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Manage your documents and account with Aiir Hub</p>
        </div>
        <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
          Back to Home
        </Link>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  )
}

