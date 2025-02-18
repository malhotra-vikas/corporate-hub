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
import { LoginButton } from "@/components/login-button"

export function MainNav() {
    const pathname = usePathname()
    const { user } = useAuth()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <img src="/airhub-logo.png" alt={themeConfig.name} className="h-8 w-auto" />
                    <span className="font-bold text-xl">{themeConfig.name}</span>
                </Link>

                {/* Navigation Menu */}
                <NavigationMenu className="mx-6">
                    <NavigationMenuList>
                        {user ? (
                            <>
                                <NavigationMenuItem>
                                    <Link href="/hub" legacyBehavior passHref>
                                        <NavigationMenuLink
                                            className={cn(
                                                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:bg-[#0196FD] focus:text-white hover:bg-[#0196FD] hover:text-white h-10 py-2 px-4 group",
                                                pathname === "/hub" ? "bg-[#0196FD]" : "bg-transparent"
                                            )}
                                        >
                                            IR Hub
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link href="/dashboard/vault" legacyBehavior passHref>
                                        <NavigationMenuLink
                                            className={cn(
                                                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:bg-[#0196FD] focus:text-white hover:bg-[#0196FD] hover:text-white h-10 py-2 px-4 group",
                                                pathname === "/dashboard/vault" ? "bg-[#0196FD]" : "bg-transparent"
                                            )}
                                        >
                                            Vault
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link href="/ai-doc-builder/press-release" legacyBehavior passHref>
                                        <NavigationMenuLink
                                            className={cn(
                                                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:bg-[#0196FD] focus:text-white hover:bg-[#0196FD] hover:text-white h-10 py-2 px-4 group",
                                                pathname === "/ai-doc-builder/press-release" ? "bg-[#0196FD]" : "bg-transparent"
                                            )}
                                        >
                                            AI-Doc-Builder
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            </>
                        ) : (
                            <>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-white rounded-md shadow-md">
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
                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white rounded-md shadow-md">
                                            <ListItem href="/hub" title="IR Hub">
                                                Access market data and investor relations tools
                                            </ListItem>
                                            <ListItem href="/pricing" title="Pricing">
                                                Flexible plans for businesses of all sizes
                                            </ListItem>
                                            <ListItem href="/testimonials" title="Case Studies">
                                                See how other companies use AiirHub
                                            </ListItem>
                                            <ListItem href="/documentation" title="Documentation">
                                                Detailed guides and API documentation
                                            </ListItem>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link href="/pricing" legacyBehavior passHref>
                                        <NavigationMenuLink className="px-4 py-2 text-sm font-medium hover:text-[#0196FD] transition-colors">
                                            Pricing
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            </>
                        )}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Right-side Controls (Login / User Profile) */}
                <div className="ml-auto flex items-center space-x-4">
                    {user ? (
                        <UserNav />
                    ) : (
                        <>
                            <LoginButton />
                            <Link href="/signup">
                                <Button className="bg-[#0196FD] text-white hover:bg-[#017ACC] transition-colors">
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

/** ListItem Component for Dropdowns */
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
                        <div className="text-sm font-medium leading-none text-foreground">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
                    </a>
                </NavigationMenuLink>
            </li>
        )
    }
);
ListItem.displayName = "ListItem";
