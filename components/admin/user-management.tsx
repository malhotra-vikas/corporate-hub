"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { User, Company } from "@/lib/types"
import { AddCompanyForm } from "@/components/admin/add-company-form"

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
        <div className="space-y-4">
            <Button onClick={() => setIsAddingCompany(true)}>Add New Company</Button>

            <Dialog open={isAddingCompany} onOpenChange={setIsAddingCompany}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Add New Company</DialogTitle>
                        <DialogDescription>Enter the details of the new company and its primary user.</DialogDescription>
                    </DialogHeader>
                    <AddCompanyForm onSubmit={handleAddCompany} />
                </DialogContent>
            </Dialog>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{user.company?.name || "N/A"}</TableCell>
                            <TableCell>
                                <Switch checked={user.active} onCheckedChange={() => handleToggleUserStatus(user.id)} />
                            </TableCell>
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="mr-2">
                                            Edit
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Edit User</DialogTitle>
                                            <DialogDescription>
                                                Make changes to the user's information here. Click save when you're done.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="edit-name" className="text-right">
                                                    Name
                                                </Label>
                                                <Input
                                                    id="edit-name"
                                                    value={editingUser?.name || user.name}
                                                    onChange={(e) => setEditingUser({ ...user, name: e.target.value })}
                                                    className="col-span-3"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="edit-email" className="text-right">
                                                    Email
                                                </Label>
                                                <Input
                                                    id="edit-email"
                                                    type="email"
                                                    value={editingUser?.email || user.email}
                                                    onChange={(e) => setEditingUser({ ...user, email: e.target.value })}
                                                    className="col-span-3"
                                                />
                                            </div>
                                            {user.role === "companyUser" && (
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="edit-company" className="text-right">
                                                        Company
                                                    </Label>
                                                    <Input
                                                        id="edit-company"
                                                        value={editingUser?.company?.name || user.company?.name}
                                                        onChange={(e) =>
                                                            setEditingUser({
                                                                ...user,
                                                                company: { ...user.company!, name: e.target.value },
                                                            })
                                                        }
                                                        className="col-span-3"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" onClick={() => editingUser && handleUpdateUser(editingUser)}>
                                                Save Changes
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

