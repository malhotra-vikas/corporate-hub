"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Company, User } from "@/lib/types"
import { RichTextEditor } from "@/components/rich-text-editor"
import { FileUpload } from "@/components/file-upload"

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
        logoUrl: "",
        aboutCompany: "",
        cautionaryNote: "",
        companyDescriptor: "",
        ceoName: "",
        contactName: "",
        contactEmail: "",
        irContactName: "",
        irContactEmail: "",
        irContactPhone: "",
        irCompanyName: "",
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

    const handleLogoUpload = (file: File) => {
        // In a real application, you would upload this file to your server or a cloud storage service
        // and get back a URL. For now, we'll just use a fake URL.
        setCompany({ ...company, logoUrl: URL.createObjectURL(file) })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
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
                <div>
                    <FileUpload onFileSelect={handleLogoUpload} accept="image/*" label="Company Logo" />
                </div>
                <RichTextEditor
                    label="About the Company"
                    value={company.aboutCompany}
                    onChange={(value) => setCompany({ ...company, aboutCompany: value })}
                />
                <RichTextEditor
                    label="Cautionary Note"
                    value={company.cautionaryNote}
                    onChange={(value) => setCompany({ ...company, cautionaryNote: value })}
                />
                <RichTextEditor
                    label="Company Descriptor"
                    value={company.companyDescriptor}
                    onChange={(value) => setCompany({ ...company, companyDescriptor: value })}
                />
                <div>
                    <Label htmlFor="ceo-name">CEO Name</Label>
                    <Input
                        id="ceo-name"
                        value={company.ceoName}
                        onChange={(e) => setCompany({ ...company, ceoName: e.target.value })}
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="contact-name">Contact Name</Label>
                        <Input
                            id="contact-name"
                            value={company.contactName}
                            onChange={(e) => setCompany({ ...company, contactName: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="contact-email">Contact Email</Label>
                        <Input
                            id="contact-email"
                            type="email"
                            value={company.contactEmail}
                            onChange={(e) => setCompany({ ...company, contactEmail: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="ir-contact-name">IR Contact Name</Label>
                        <Input
                            id="ir-contact-name"
                            value={company.irContactName}
                            onChange={(e) => setCompany({ ...company, irContactName: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="ir-contact-email">IR Contact Email</Label>
                        <Input
                            id="ir-contact-email"
                            type="email"
                            value={company.irContactEmail}
                            onChange={(e) => setCompany({ ...company, irContactEmail: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="ir-contact-phone">IR Contact Phone</Label>
                        <Input
                            id="ir-contact-phone"
                            type="tel"
                            value={company.irContactPhone}
                            onChange={(e) => setCompany({ ...company, irContactPhone: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="ir-company-name">IR Company Name</Label>
                        <Input
                            id="ir-company-name"
                            value={company.irCompanyName}
                            onChange={(e) => setCompany({ ...company, irCompanyName: e.target.value })}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
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

