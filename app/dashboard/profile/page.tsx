"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RichTextEditor } from "@/components/rich-text-editor"

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    companyName: "",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleRichTextChange = (name: string) => (value: string) => {
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Profile data:", profile)
    // For now, we'll just show an alert
    alert("Profile updated successfully!")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>Update your company's profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input id="companyName" name="companyName" value={profile.companyName} onChange={handleInputChange} />
          </div>
          <RichTextEditor
            label="About the Company"
            value={profile.aboutCompany}
            onChange={handleRichTextChange("aboutCompany")}
          />
          <RichTextEditor
            label="Cautionary Note"
            value={profile.cautionaryNote}
            onChange={handleRichTextChange("cautionaryNote")}
          />
          <RichTextEditor
            label="Company Descriptor"
            value={profile.companyDescriptor}
            onChange={handleRichTextChange("companyDescriptor")}
          />
          <div className="space-y-2">
            <Label htmlFor="ceoName">CEO Name</Label>
            <Input id="ceoName" name="ceoName" value={profile.ceoName} onChange={handleInputChange} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Update your company's contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactName">Contact Name</Label>
            <Input id="contactName" name="contactName" value={profile.contactName} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={profile.contactEmail}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Investor Relations Information</CardTitle>
          <CardDescription>Update your investor relations contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="irContactName">IR Contact Name</Label>
            <Input id="irContactName" name="irContactName" value={profile.irContactName} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="irContactEmail">IR Contact Email</Label>
            <Input
              id="irContactEmail"
              name="irContactEmail"
              type="email"
              value={profile.irContactEmail}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="irContactPhone">IR Contact Phone</Label>
            <Input
              id="irContactPhone"
              name="irContactPhone"
              type="tel"
              value={profile.irContactPhone}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="irCompanyName">IR Company Name</Label>
            <Input id="irCompanyName" name="irCompanyName" value={profile.irCompanyName} onChange={handleInputChange} />
          </div>
        </CardContent>
      </Card>

      <CardFooter>
        <Button type="submit" className="ml-auto">
          Save Changes
        </Button>
      </CardFooter>
    </form>
  )
}

