"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileUpload } from "@/components/file-upload"

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    companyName: "Acme Corp",
    aboutCompany:
      "<p>Acme Corporation is a fictional company that features prominently in the Road Runner/Wile E. Coyote animated shorts as a running gag featuring outlandish products that fail or backfire catastrophically at the worst possible times.</p>",
    cautionaryNote: "<p>This document contains forward-looking statements. Actual results may differ materially.</p>",
    companyDescriptor: "<p>Leading provider of innovative solutions for cartoon characters.</p>",
    ceoName: "John Doe",
    contactName: "Jane Smith",
    contactEmail: "jane@acmecorp.com",
    irContactName: "Bob Johnson",
    irContactEmail: "bob@acmecorp.com",
    irContactPhone: "+1 (555) 123-4567",
    irCompanyName: "Acme Investor Relations",
    logo: null as File | null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleRichTextChange = (name: string) => (value: string) => {
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogoUpload = (file: File) => {
    setProfile((prev) => ({ ...prev, logo: file }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Profile data:", profile)
    alert("Profile updated successfully!")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>Manage your company's information and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              {profile.logo ? (
                <AvatarImage src={URL.createObjectURL(profile.logo)} alt="Company Logo" />
              ) : (
                <AvatarImage src="/company-logo.png" alt="Default Company Logo" />
              )}
              <AvatarFallback>{profile.companyName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{profile.companyName}</h2>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="company-info">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="company-info">Company Info</TabsTrigger>
          <TabsTrigger value="contact-info">Contact Info</TabsTrigger>
          <TabsTrigger value="ir-info">IR Info</TabsTrigger>
        </TabsList>
        <TabsContent value="company-info">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your company's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" name="companyName" value={profile.companyName} onChange={handleInputChange} />
              </div>
              <FileUpload onFileSelect={handleLogoUpload} accept="image/*" label="Company Logo" />
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
        </TabsContent>
        <TabsContent value="contact-info">
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
        </TabsContent>
        <TabsContent value="ir-info">
          <Card>
            <CardHeader>
              <CardTitle>Investor Relations Information</CardTitle>
              <CardDescription>Update your investor relations contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="irContactName">IR Contact Name</Label>
                <Input
                  id="irContactName"
                  name="irContactName"
                  value={profile.irContactName}
                  onChange={handleInputChange}
                />
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
                <Input
                  id="irCompanyName"
                  name="irCompanyName"
                  value={profile.irCompanyName}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardFooter>
          <Button type="submit" className="ml-auto">
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

