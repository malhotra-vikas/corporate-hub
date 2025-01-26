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

interface User {
    id: string
    name: string
    email: string
    role: "admin" | "companyUser"
    active: boolean
}

const mockUsers: User[] = [
    { id: "1", name: "John Doe", email: "john@example.com", role: "admin", active: true },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "companyUser", active: true },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "companyUser", active: false },
]

export function UserManagement() {
    const [users, setUsers] = useState<User[]>(mockUsers)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [newUser, setNewUser] = useState<Omit<User, "id">>({ name: "", email: "", role: "companyUser", active: true })

    const handleUpdateUser = (updatedUser: User) => {
        setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
        setEditingUser(null)
    }

    const handleDeleteUser = (userId: string) => {
        setUsers(users.filter((user) => user.id !== userId))
    }

    const handleAddUser = () => {
        const id = (users.length + 1).toString()
        setUsers([...users, { ...newUser, id }])
        setNewUser({ name: "", email: "", role: "companyUser", active: true })
    }

    const handleToggleUserStatus = (userId: string) => {
        setUsers(users.map((user) => (user.id === userId ? { ...user, active: !user.active } : user)))
    }

    return (
        <div className="space-y-4">
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Add New User</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>Enter the details of the new user. Click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                Role
                            </Label>
                            <select
                                id="role"
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "admin" | "companyUser" })}
                                className="col-span-3"
                            >
                                <option value="companyUser">Company User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleAddUser}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
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
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="edit-role" className="text-right">
                                                    Role
                                                </Label>
                                                <select
                                                    id="edit-role"
                                                    value={editingUser?.role || user.role}
                                                    onChange={(e) => setEditingUser({ ...user, role: e.target.value as "admin" | "companyUser" })}
                                                    className="col-span-3"
                                                >
                                                    <option value="companyUser">Company User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </div>
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

