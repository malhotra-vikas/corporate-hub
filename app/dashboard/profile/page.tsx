"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileUpload } from "@/components/file-upload"
import { useAuth } from "@/lib/auth-context"

// Add this import for the API calls
import UserApi from "@/lib/api/user.api"

import { toast } from "react-toastify"

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    companyName: "",
    companyAbout: "",
    companyCautionaryNote: "",
    companyDescriptor: "",
    companyCEOName: "",
    companyContactName: "",
    companyContactEmail: "",
    companyInvestorRelationsContactName: "",
    companyInvestorRelationsContactEmail: "",
    companyInvestorRelationsContactPhone: "",
    companyInvestorRelationsCompanyName: "",
    logo: null as File | null,
  })

  const userApi = new UserApi()
  
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  let companyUser


  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          companyUser = await userApi.getClientByEmail(user.email)
          
          setProfile((prevProfile) => ({
            ...prevProfile,
            ...companyUser
          }))
        } catch (error) {
          console.error("Error fetching profile:", error)
          toast.error("Failed to load profile data")
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadProfile()
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleRichTextChange = (name: string) => (value: string) => {
    setProfile((prev) => ({ ...prev, [name]: value }))
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      try {
        await userApi.updateUserByEmail(profile)
        toast.success("Profile updated successfully!")
      } catch (error) {
        console.error("Error updating profile:", error)
        toast.error("Failed to update profile")
      }
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
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
              <RichTextEditor
                label="About the Company"
                value={profile.companyAbout}
                onChange={handleRichTextChange("companyAbout")}
              />
              <RichTextEditor
                label="Cautionary Note"
                value={profile.companyCautionaryNote}
                onChange={handleRichTextChange("companyCautionaryNote")}
              />
              <RichTextEditor
                label="Company Descriptor"
                value={profile.companyDescriptor}
                onChange={handleRichTextChange("companyDescriptor")}
              />
              <div className="space-y-2">
                <Label htmlFor="companyCEOName">CEO Name</Label>
                <Input id="companyCEOName" name="companyCEOName" value={profile.companyCEOName} onChange={handleInputChange} />
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
                <Label htmlFor="companyContactName">Contact Name</Label>
                <Input id="companyContactName" name="companyContactName" value={profile.companyContactName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyContactEmail">Contact Email</Label>
                <Input
                  id="companyContactEmail"
                  name="companyContactEmail"
                  type="email"
                  value={profile.companyContactEmail}
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
                <Label htmlFor="companyInvestorRelationsContactName">IR Contact Name</Label>
                <Input
                  id="companyInvestorRelationsContactName"
                  name="companyInvestorRelationsContactName"
                  value={profile.companyInvestorRelationsContactName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyInvestorRelationsContactEmail">IR Contact Email</Label>
                <Input
                  id="companyInvestorRelationsContactEmail"
                  name="companyInvestorRelationsContactEmail"
                  type="email"
                  value={profile.companyInvestorRelationsContactEmail}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="irContactPhone">IR Contact Phone</Label>
                <Input
                  id="companyInvestorRelationsContactPhone"
                  name="companyInvestorRelationsContactPhone"
                  type="tel"
                  value={profile.companyInvestorRelationsContactPhone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyInvestorRelationsCompanyName">IR Company Name</Label>
                <Input
                  id="companyInvestorRelationsCompanyName"
                  name="companyInvestorRelationsCompanyName"
                  value={profile.companyInvestorRelationsCompanyName}
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

