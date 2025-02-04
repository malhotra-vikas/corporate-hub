"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"

interface SearchBarProps {
    onSearch: (query: string) => void
    placeholder: string
}

export function SearchBar({ onSearch, placeholder }: SearchBarProps) {
    const [search, setSearch] = useState("")

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(search)
    }

    return (
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
            <Input type="search" placeholder={placeholder} value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button type="submit">
                <SearchIcon className="h-4 w-4 mr-2" />
                Search
            </Button>
        </form>
    )
}

