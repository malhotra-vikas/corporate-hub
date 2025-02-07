import type { Metadata } from "next"
import Link from "next/link"
import { themeConfig } from "@/lib/theme-config"

import { Separator } from "@/components/ui/separator"
import { useState } from "react"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Corporate Hub Dashboard",
}


interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  
  return (
    <div className="flex min-h-screen">

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 space-y-6">
          {children}
        </div>
      </main>
    </div>
  )
}

