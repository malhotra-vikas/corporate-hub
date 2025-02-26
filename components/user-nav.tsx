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
import { ChevronDown } from "lucide-react"

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
                <Button
                    variant="ghost"
                    className="relative flex items-center justify-between w-[180px] h-10 rounded-md px-3 bg-gray-100 hover:bg-gray-200 transition bg-[#81C3F1] text-black min-w-max rounded-md"
                >
                    {/* User Badge inside a flex container for alignment */}
                    <div className="flex items-center gap-2">
                        {user.companyTicker ? user.companyTicker.toUpperCase() : "USER"}
                    </div>

                    {/* Dropdown Indicator */}
                    <ChevronDown className="h-4 w-4 text-gray-600" />
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

