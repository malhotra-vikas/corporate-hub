"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { User, Company } from "@/lib/types"
import { AddCompanyForm } from "@/components/admin/add-company-form"
import { Plus, UserPlus } from "lucide-react"

const mockUsers: User[] = [
    { id: "1", name: "John Doe", email: "john@example.com", role: "admin", active: true },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane@acme.com",
        role: "companyUser",
        active: true,
        company: {
            id: "c1",
            name: "Acme Corp",
            description: "A leading provider of innovative solutions",
            industry: "Technology",
            foundedYear: 2000,
            website: "https://acme.com",
            logoUrl: "/acme-logo.png",
            aboutCompany: "<p>Acme Corp is a technology leader...</p>",
            cautionaryNote: "<p>This document contains forward-looking statements...</p>",
            companyDescriptor: "<p>Leading provider of innovative solutions...</p>",
            ceoName: "John Acme",
            contactName: "Jane Acme",
            contactEmail: "contact@acme.com",
            irContactName: "Bob Acme",
            irContactEmail: "ir@acme.com",
            irContactPhone: "+1 (555) 123-4567",
            irCompanyName: "Acme Investor Relations",
        },
    },
    {
        id: "3",
        name: "Bob Johnson",
        email: "bob@globex.com",
        role: "companyUser",
        active: false,
        company: {
            id: "c2",
            name: "Globex Corporation",
            description: "Global leader in synergy",
            industry: "Conglomerate",
            foundedYear: 1989,
            website: "https://globex.com",
            logoUrl: "/globex-logo.png",
            aboutCompany: "<p>Globex Corporation is a multinational conglomerate...</p>",
            cautionaryNote: "<p>Investors should carefully consider the risks...</p>",
            companyDescriptor: "<p>Global leader in synergistic business solutions...</p>",
            ceoName: "Hank Scorpio",
            contactName: "Frank Globex",
            contactEmail: "contact@globex.com",
            irContactName: "Lisa Globex",
            irContactEmail: "ir@globex.com",
            irContactPhone: "+1 (555) 987-6543",
            irCompanyName: "Globex Investor Relations",
        },
    },
]

export function UserManagement() {
    const [users, setUsers] = useState<User[]>(mockUsers)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [isAddingCompany, setIsAddingCompany] = useState(false)

    const handleUpdateUser = (updatedUser: User) => {
        setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
        setEditingUser(null)
    }

    const handleDeleteUser = (userId: string) => {
        setUsers(users.filter((user) => user.id !== userId))
    }

    const handleAddCompany = (newCompany: Company, newUser: Omit<User, "id" | "company">) => {
        const id = (users.length + 1).toString()
        const newUserWithCompany: User = {
            ...newUser,
            id,
            role: "companyUser",
            company: { ...newCompany, id: `c${id}` },
        }
        setUsers([...users, newUserWithCompany])
        setIsAddingCompany(false)
    }

    const handleToggleUserStatus = (userId: string) => {
        setUsers(users.map((user) => (user.id === userId ? { ...user, active: !user.active } : user)))
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">User & Company Management</h2>
                    <p className="text-muted-foreground">Manage your organization's users and companies</p>
                </div>
                <Button onClick={() => setIsAddingCompany(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add New Company
                </Button>
            </div>

            <Dialog open={isAddingCompany} onOpenChange={setIsAddingCompany}>
                <DialogContent className="max-w-4xl h-[90vh] p-0">
                    <AddCompanyForm onSubmit={handleAddCompany} onCancel={() => setIsAddingCompany(false)} />
                </DialogContent>
            </Dialog>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                        {user.role}
                                    </span>
                                </TableCell>
                                <TableCell>{user.company?.name || "N/A"}</TableCell>
                                <TableCell>
                                    <Switch checked={user.active} onCheckedChange={() => handleToggleUserStatus(user.id)} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="mr-2">
                                        Edit
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

