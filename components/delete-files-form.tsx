"use client"

import { useState, useTransition } from "react"
import { deleteFiles } from "@/app/actions/upload-file"
import { useRouter } from "next/navigation"

export function DeleteFilesForm({ children }: { children: React.ReactNode }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const selectedFiles = formData.getAll("selectedFiles") as string[]

        if (selectedFiles.length === 0) {
            alert("Please select at least one file to delete.")
            return
        }

        startTransition(async () => {
            await deleteFiles(selectedFiles)
            router.refresh()
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            {children}
            {isPending && <p>Deleting...</p>}
        </form>
    )
}

