"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserManagement } from "@/components/admin/user-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminPage() {
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (user && user.role !== "admin") {
            router.push("/dashboard")
        }
    }, [user, router])

    if (!user || user.role !== "admin") {
        return null
    }

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Admin Panel</CardTitle>
                    <CardDescription>Manage your AiirHub instance</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="users">
                        <TabsList>
                            <TabsTrigger value="users">User & Company Management</TabsTrigger>
                            <TabsTrigger value="settings">Global Settings</TabsTrigger>
                            <TabsTrigger value="logs">System Logs</TabsTrigger>
                        </TabsList>
                        <TabsContent value="users">
                            <UserManagement />
                        </TabsContent>
                        <TabsContent value="settings">
                            <p>Global settings configuration will be implemented here.</p>
                        </TabsContent>
                        <TabsContent value="logs">
                            <p>System logs will be displayed here.</p>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

