import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <Link href="/hub" className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium" target="_blank">
            New: Access market insights in our IR Hub
          </Link>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Secure Document Management for Modern Enterprises
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Streamline your corporate document workflow with Aiir Hub's enterprise-grade security and intuitive
            collaboration tools.
          </p>
          <div className="space-x-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-11 px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="h-11 px-8">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <section id="features" className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Features</h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Everything you need to manage your corporate documents efficiently and securely with Aiir Hub.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle>Secure Storage</CardTitle>
              <CardDescription>Enterprise-grade security for your sensitive documents</CardDescription>
            </CardHeader>
            <CardContent>
              <Icons.shield className="h-8 w-8 text-primary" />
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle>Real-time Collaboration</CardTitle>
              <CardDescription>Work together seamlessly with your team</CardDescription>
            </CardHeader>
            <CardContent>
              <Icons.users className="h-8 w-8 text-primary" />
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle>Version Control</CardTitle>
              <CardDescription>Track changes and maintain document history</CardDescription>
            </CardHeader>
            <CardContent>
              <Icons.git className="h-8 w-8 text-primary" />
            </CardContent>
          </Card>
        </div>
      </section>
      <section id="testimonials" className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Trusted by Industry Leaders</h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            See what our customers have to say about Aiir Hub
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Exceptional Security</CardTitle>
              <CardDescription>Financial Services Company</CardDescription>
            </CardHeader>
            <CardContent>
              "Aiir Hub's security features give us complete confidence in storing our sensitive documents."
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Streamlined Workflow</CardTitle>
              <CardDescription>Technology Corporation</CardDescription>
            </CardHeader>
            <CardContent>"The platform has revolutionized how we manage and collaborate on documents."</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Intuitive Interface</CardTitle>
              <CardDescription>Healthcare Provider</CardDescription>
            </CardHeader>
            <CardContent>"Aiir Hub's user-friendly interface has made document management effortless."</CardContent>
          </Card>
        </div>
      </section>
      <section id="cta" className="border-t">
        <div className="container flex flex-col items-center justify-center gap-4 py-8 md:py-12 lg:py-24">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Ready to Get Started?</h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Join thousands of companies already using Aiir Hub
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="mt-4">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Icons.logo className="h-6 w-6" />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by{" "}
              <a href="#" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
                Aiir Hub
              </a>
              . The source code is available on{" "}
              <a href="#" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

