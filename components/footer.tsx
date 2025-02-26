import Link from "next/link"
import { Button } from "@/components/ui/button"
import { themeConfig } from "@/lib/theme-config"

export function Footer() {
    return (




        <footer className="border-t bg-background">
            <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <img src="/airhub-logo-current.png" alt={themeConfig.name} className="h-6 w-auto" />
                </div>

                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        All rights reserved © {new Date().getFullYear()}.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/terms">Terms</Link>
                    </Button>
                </div>
            </div>
        </footer>
    )
}

