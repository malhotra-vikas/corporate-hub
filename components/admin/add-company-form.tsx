"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Company, User } from "@/lib/types"
import { RichTextEditor } from "@/components/rich-text-editor"
import { FileUpload } from "@/components/file-upload"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, ChevronRight } from "lucide-react"

interface AddCompanyFormProps {
    onSubmit: (company: Company, user: Omit<User, "id" | "company">) => void
    onCancel: () => void
}

const steps = [
    { id: 1, title: "Basic Info" },
    { id: 2, title: "Company Details" },
    { id: 3, title: "Contact Info" },
    { id: 4, title: "User Setup" },
]

export function AddCompanyForm({ onSubmit, onCancel }: AddCompanyFormProps) {
    const [step, setStep] = useState(1)
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
        setCompany({ ...company, logoUrl: URL.createObjectURL(file) })
    }

    const progress = (step / steps.length) * 100

    return (
        <div className="flex h-full flex-col bg-background">
            <div className="border-b">
                <div className="container flex h-16 items-center px-4">
                    <div className="flex flex-1 items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Progress value={progress} className="w-60" />
                            <span className="text-sm text-muted-foreground">
                                Step {step} of {steps.length}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" onClick={onCancel}>
                                Cancel
                            </Button>
                            {step < steps.length ? (
                                <Button onClick={() => setStep(step + 1)}>
                                    Next <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button onClick={handleSubmit}>
                                    Complete <Check className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 px-4 py-6">
                <div className="container grid gap-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">{steps[step - 1].title}</h2>
                            <p className="text-muted-foreground">Complete the information below to proceed</p>
                        </div>
                    </div>

                    <form className="grid gap-6">
                        {step === 1 && (
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="company-name">Company Name</Label>
                                    <Input
                                        id="company-name"
                                        value={company.name}
                                        onChange={(e) => setCompany({ ...company, name: e.target.value })}
                                        placeholder="Enter company name"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="industry">Industry</Label>
                                    <Input
                                        id="industry"
                                        value={company.industry}
                                        onChange={(e) => setCompany({ ...company, industry: e.target.value })}
                                        placeholder="Enter industry"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={company.description}
                                        onChange={(e) => setCompany({ ...company, description: e.target.value })}
                                        placeholder="Enter company description"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="founded-year">Founded Year</Label>
                                        <Input
                                            id="founded-year"
                                            type="number"
                                            value={company.foundedYear}
                                            onChange={(e) => setCompany({ ...company, foundedYear: Number.parseInt(e.target.value) })}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            type="url"
                                            value={company.website}
                                            onChange={(e) => setCompany({ ...company, website: e.target.value })}
                                            placeholder="https://"
                                            required
                                        />
                                    </div>
                                </div>
                                <FileUpload onFileSelect={handleLogoUpload} accept="image/*" label="Company Logo" />
                            </div>
                        )}

                        {step === 2 && (
                            <div className="grid gap-6">
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
                                <div className="grid gap-2">
                                    <Label htmlFor="ceo-name">CEO Name</Label>
                                    <Input
                                        id="ceo-name"
                                        value={company.ceoName}
                                        onChange={(e) => setCompany({ ...company, ceoName: e.target.value })}
                                        placeholder="Enter CEO name"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="grid gap-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="contact-name">Contact Name</Label>
                                        <Input
                                            id="contact-name"
                                            value={company.contactName}
                                            onChange={(e) => setCompany({ ...company, contactName: e.target.value })}
                                            placeholder="Enter contact name"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="contact-email">Contact Email</Label>
                                        <Input
                                            id="contact-email"
                                            type="email"
                                            value={company.contactEmail}
                                            onChange={(e) => setCompany({ ...company, contactEmail: e.target.value })}
                                            placeholder="Enter contact email"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="ir-contact-name">IR Contact Name</Label>
                                        <Input
                                            id="ir-contact-name"
                                            value={company.irContactName}
                                            onChange={(e) => setCompany({ ...company, irContactName: e.target.value })}
                                            placeholder="Enter IR contact name"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="ir-contact-email">IR Contact Email</Label>
                                        <Input
                                            id="ir-contact-email"
                                            type="email"
                                            value={company.irContactEmail}
                                            onChange={(e) => setCompany({ ...company, irContactEmail: e.target.value })}
                                            placeholder="Enter IR contact email"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="ir-contact-phone">IR Contact Phone</Label>
                                        <Input
                                            id="ir-contact-phone"
                                            type="tel"
                                            value={company.irContactPhone}
                                            onChange={(e) => setCompany({ ...company, irContactPhone: e.target.value })}
                                            placeholder="Enter IR contact phone"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="ir-company-name">IR Company Name</Label>
                                        <Input
                                            id="ir-company-name"
                                            value={company.irCompanyName}
                                            onChange={(e) => setCompany({ ...company, irCompanyName: e.target.value })}
                                            placeholder="Enter IR company name"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="user-name">Name</Label>
                                    <Input
                                        id="user-name"
                                        value={user.name}
                                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                                        placeholder="Enter user's full name"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="user-email">Email</Label>
                                    <Input
                                        id="user-email"
                                        type="email"
                                        value={user.email}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                        placeholder="Enter user's email"
                                        required
                                    />
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </ScrollArea>
        </div>
    )
}

