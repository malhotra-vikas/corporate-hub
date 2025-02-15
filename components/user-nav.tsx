"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import UserApi from "@/lib/api/user.api"
import { Badge } from "@/components/ui/badge"

export function UserNav() {
    const router = useRouter()
    const { user, signOut } = useAuth()

    const handleSignOut = async () => {
        await signOut()
        router.push("/")
    }

    const userApi = new UserApi()

    if (!user) return null

    if (user) {
        const ticker = user.companyTicker

        console.log("User Company Ticket ", ticker)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-auto rounded-lg px-2">
                    <Avatar className="flex items-center justify-center h-8 w-auto">
                        <Badge
                            variant="beat"
                            className="flex items-center gap-1 px-3 py-1 bg-[#81C3F1] text-black min-w-max rounded-md"
                        >
                            {user.companyTicker ? user.companyTicker.toUpperCase() : "USER"}
                        </Badge>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        <p className="text-xs font-medium text-primary">Role: {user.role}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                        Profile
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/dashboard/vault")}>
                        Vault
                        <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/hub")}>
                        IR Hub
                        <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                        <DropdownMenuItem onClick={() => router.push("/admin")}>
                            Admin Panel
                            <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

