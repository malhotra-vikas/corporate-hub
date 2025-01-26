"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"

const QuillNoSSR = dynamic(() => import("react-quill"), {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
})

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    label: string
}

export function RichTextEditor({ value, onChange, label }: RichTextEditorProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
            </label>
            <QuillNoSSR theme="snow" value={value} onChange={onChange} />
        </div>
    )
}

