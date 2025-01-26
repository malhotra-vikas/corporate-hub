"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"

export function SearchBar() {
    const [search, setSearch] = useState("")
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        router.push(`/dashboard/vault?search=${encodeURIComponent(search)}`)
    }

    return (
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
            <Input
                type="search"
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit">
                <SearchIcon className="h-4 w-4 mr-2" />
                Search
            </Button>
        </form>
    )
}

