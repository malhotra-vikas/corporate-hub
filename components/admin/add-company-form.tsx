"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Company, User } from "@/lib/types"

interface AddCompanyFormProps {
    onSubmit: (company: Company, user: Omit<User, "id" | "company">) => void
}

export function AddCompanyForm({ onSubmit }: AddCompanyFormProps) {
    const [company, setCompany] = useState<Omit<Company, "id">>({
        name: "",
        description: "",
        industry: "",
        foundedYear: new Date().getFullYear(),
        website: "",
    })

    const [user, setUser] = useState<Omit<User, "id" | "company">>({
        name: "",
        email: "",
        role: "companyUser",
        active: true,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(company as Company, user)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Company Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input
                            id="company-name"
                            value={company.name}
                            onChange={(e) => setCompany({ ...company, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Input
                            id="industry"
                            value={company.industry}
                            onChange={(e) => setCompany({ ...company, industry: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={company.description}
                        onChange={(e) => setCompany({ ...company, description: e.target.value })}
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="founded-year">Founded Year</Label>
                        <Input
                            id="founded-year"
                            type="number"
                            value={company.foundedYear}
                            onChange={(e) => setCompany({ ...company, foundedYear: Number.parseInt(e.target.value) })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                            id="website"
                            type="url"
                            value={company.website}
                            onChange={(e) => setCompany({ ...company, website: e.target.value })}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-lg font-medium">Primary User Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="user-name">Name</Label>
                        <Input
                            id="user-name"
                            value={user.name}
                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="user-email">Email</Label>
                        <Input
                            id="user-email"
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            required
                        />
                    </div>
                </div>
            </div>

            <Button type="submit">Add Company and User</Button>
        </form>
    )
}

