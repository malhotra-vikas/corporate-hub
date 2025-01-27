"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2Icon } from "lucide-react"
import { deleteFiles } from "@/lib/api/vault"

interface DeleteFilesFormProps {
    files: { id: string; name: string }[]
}

export function DeleteFilesForm({ files }: DeleteFilesFormProps) {
    const [isPending, setIsPending] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState<string[]>([])
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (selectedFiles.length === 0) {
            alert("Please select at least one file to delete.")
            return
        }

        setIsPending(true)
        try {
            await deleteFiles(selectedFiles)
            setSelectedFiles([]) // Reset selected files
            router.refresh()
        } catch (error) {
            console.error("Error deleting files:", error)
            alert("An error occurred while deleting files. Please try again.")
        } finally {
            setIsPending(false)
        }
    }

    const handleCheckboxChange = (fileId: string, checked: boolean) => {
        setSelectedFiles((prev) => (checked ? [...prev, fileId] : prev.filter((id) => id !== fileId)))
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="rounded-md border">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="w-[50px] p-2">Select</th>
                            <th className="p-2 text-left">File Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file) => (
                            <tr key={file.id}>
                                <td className="p-2">
                                    <Checkbox
                                        checked={selectedFiles.includes(file.id)}
                                        onCheckedChange={(checked) => handleCheckboxChange(file.id, checked as boolean)}
                                    />
                                </td>
                                <td className="p-2">{file.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <Button type="submit" variant="danger" disabled={isPending || selectedFiles.length === 0}>
                    <Trash2Icon className="mr-2 h-4 w-4" />
                    Delete Selected ({selectedFiles.length})
                </Button>
            </div>
            {isPending && <p>Deleting...</p>}
        </form>
    )
}

