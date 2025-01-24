"use client"

import { useRouter } from "next/navigation"
import { uploadFile } from "@/app/actions/upload-file"

export default function VaultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  async function handleUpload(formData: FormData) {
    await uploadFile(formData)
    router.refresh()
  }

  return (
    <div>
      {children}
      <form action={handleUpload}>{/* File input and upload button will be rendered in the page component */}</form>
    </div>
  )
}

