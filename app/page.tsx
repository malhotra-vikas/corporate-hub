import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsDashboard } from "@/components/stats-dashboard"
import { themeConfig } from "@/lib/theme-config"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="bg-gradient-to-b from-primary to-primary-dark text-white space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <Link
            href="/hub"
            className="rounded-2xl bg-white/10 px-4 py-1.5 text-sm font-medium text-white"
            target="_blank"
          >
            New: Access market insights in our IR Hub
          </Link>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Secure Document Management for Modern Enterprises
          </h1>
          <p className="max-w-[42rem] leading-normal text-white/80 sm:text-xl sm:leading-8">
            Streamline your corporate document workflow with enterprise-grade security and AI-powered collaboration
            tools.
          </p>
          <div className="space-x-4">
            <Link href="/hub">
              <Button size="lg" className="bg-[#cdf683] text-black hover:bg-[#b8e15e]">
                Get Started
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="bg-white/10 text-white hover:bg-white/20 border-[#cdf683]">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <StatsDashboard />

      <section id="features" className="container space-y-6 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Features</h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Everything you need to manage your corporate documents efficiently and securely.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Secure Storage</CardTitle>
              <CardDescription>Enterprise-grade security for your sensitive documents</CardDescription>
            </CardHeader>
            <CardContent>
              <img src="/icons/shield.svg" alt="Security" className="h-12 w-12 mx-auto" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Real-time Collaboration</CardTitle>
              <CardDescription>Work together seamlessly with your team</CardDescription>
            </CardHeader>
            <CardContent>
              <img src="/icons/users.svg" alt="Collaboration" className="h-12 w-12 mx-auto" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Version Control</CardTitle>
              <CardDescription>Track changes and maintain document history</CardDescription>
            </CardHeader>
            <CardContent>
              <img src="/icons/git-branch.svg" alt="Version Control" className="h-12 w-12 mx-auto" />
            </CardContent>
          </Card>
        </div>
      </section>
      <section id="testimonials" className="bg-muted py-8 md:py-12 lg:py-24">
        <div className="container">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Trusted by Industry Leaders</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              See what our customers have to say about AiirHub
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Exceptional Security</CardTitle>
                <CardDescription>Financial Services Company</CardDescription>
              </CardHeader>
              <CardContent>
                "AiirHub's security features give us complete confidence in storing our sensitive documents."
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
              <CardContent>
                "AiirHub's user-friendly interface has made document management effortless."
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section id="cta" className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Ready to Get Started?</h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Join thousands of companies already using AiirHub
          </p>
          <Link href="/hub">
            <Button size="lg" className="mt-4 bg-[#cdf683] text-black hover:bg-[#b8e15e]">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <img src="/airhub-logo.png" alt={themeConfig.name} className="h-6 w-auto" />
          </div>
        </div>
      </footer>
    </div>
  )
}

