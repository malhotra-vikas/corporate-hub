"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { themeConfig } from "@/lib/theme-config"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/lib/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function MainNav() {
    const pathname = usePathname()
    const { user, mockLogin, mockLogout } = useAuth()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <Link href="/" className="flex items-center space-x-2">
                    <img src="/logo.svg" alt={themeConfig.name} className="h-8 w-auto" />
                    <span className="font-bold text-xl">{themeConfig.name}</span>
                </Link>
                <NavigationMenu className="mx-6">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    <li className="row-span-3">
                                        <NavigationMenuLink asChild>
                                            <a
                                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/50 to-primary p-6 no-underline outline-none focus:shadow-md"
                                                href="/"
                                            >
                                                <img src="/logo.svg" alt={themeConfig.name} className="h-6 w-auto mb-2" />
                                                <div className="mb-2 mt-4 text-lg font-medium text-white">{themeConfig.name}</div>
                                                <p className="text-sm leading-tight text-white/90">{themeConfig.description}</p>
                                            </a>
                                        </NavigationMenuLink>
                                    </li>
                                    <ListItem href="/features" title="Document Management">
                                        Secure storage and organization of corporate documents
                                    </ListItem>
                                    <ListItem href="/features" title="Collaboration">
                                        Real-time collaboration and version control
                                    </ListItem>
                                    <ListItem href="/features" title="Security">
                                        Enterprise-grade security and compliance
                                    </ListItem>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                    <ListItem href="/hub" title="IR Hub">
                                        Access market data and investor relations tools
                                    </ListItem>
                                    <ListItem href="/pricing" title="Pricing">
                                        Flexible plans for businesses of all sizes
                                    </ListItem>
                                    <ListItem href="/testimonials" title="Case Studies">
                                        See how other companies use CorporateHub
                                    </ListItem>
                                    <ListItem href="/documentation" title="Documentation">
                                        Detailed guides and API documentation
                                    </ListItem>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <div className="ml-auto flex items-center space-x-4">
                    {user ? (
                        <>
                            <UserNav />
                            <Button onClick={mockLogout} variant="ghost">
                                Mock Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost">Mock Login</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => mockLogin("admin")}>Login as Admin</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => mockLogin("companyUser")}>Login as Company User</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Link href="/signup">
                                <Button>Sign Up</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a"> & { title: string }>(
    ({ className, title, children, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            className,
                        )}
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
                    </a>
                </NavigationMenuLink>
            </li>
        )
    },
)
ListItem.displayName = "ListItem"

