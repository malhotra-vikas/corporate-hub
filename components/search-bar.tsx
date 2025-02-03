"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"

// Define prop types for SearchBar component
interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
    const router = useRouter()

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        router.push(`/dashboard/vault?search=${encodeURIComponent(value)}`)
    }

    return (
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
            <Input
                type="search"
                placeholder={placeholder}
                value={value}
                onChange={onChange}  // Using the passed in onChange prop
            />
            <Button type="submit">
                <SearchIcon className="h-4 w-4 mr-2" />
                Search
            </Button>
        </form>
    )
}
