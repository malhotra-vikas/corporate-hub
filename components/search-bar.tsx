"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (query: string) => void
  placeholder: string
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  const [search, setSearch] = useState(value)

  useEffect(() => {
    setSearch(value)
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearch(newValue)
    onChange(newValue)
  }

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input type="search" placeholder={placeholder} value={search} onChange={handleInputChange} />
    </div>
  )
}

