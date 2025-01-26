"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadCloud } from "lucide-react"

interface FileUploadProps {
    onFileSelect: (file: File) => void
    accept?: string
    label?: string
}

export function FileUpload({ onFileSelect, accept = "image/*", label = "Upload file" }: FileUploadProps) {
    const [fileName, setFileName] = useState<string | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFileName(file.name)
            onFileSelect(file)
        }
    }

    return (
        <div className="space-y-2">
            <Label htmlFor="file-upload">{label}</Label>
            <div className="flex items-center space-x-2">
                <Input id="file-upload" type="file" accept={accept} onChange={handleFileChange} className="hidden" />
                <Button type="button" variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Choose File
                </Button>
                {fileName && <span className="text-sm text-muted-foreground">{fileName}</span>}
            </div>
        </div>
    )
}

