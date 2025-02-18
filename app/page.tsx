"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { themeConfig } from "@/lib/theme-config"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/hub") // Redirect logged-in users to /hub
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="bg-gradient-to-b from-primary to-primary-dark text-white space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">

          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            An A.I Powered Hub for Public Companies
          </h1>
          <p className="max-w-[42rem] leading-normal text-white/80 sm:text-xl sm:leading-8">
            The days of routine, monotonous, corporate tasks are over.
          </p>
        </div>
      </section>


      <section id="features" className="container space-y-6 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Features</h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Save countless hours to focus on what matters most.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Press Releases</CardTitle>
              <CardDescription>DRaft press release in seconds</CardDescription>
            </CardHeader>
            <CardContent>
              <img src="press-release_5395863.png" alt="Press Releases" className="h-12 w-12 mx-auto" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Earnings and Scripts</CardTitle>
              <CardDescription>Generate earnings press releases and scripts</CardDescription>
            </CardHeader>
            <CardContent>
              <img src="earnings.png" alt="Earnings" className="h-12 w-12 mx-auto" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>PRISM-Powered Messaging</CardTitle>
              <CardDescription>Reach new investors and receive analytics on messaging</CardDescription>
            </CardHeader>
            <CardContent>
              <img src="/icons/git-branch.svg" alt="Version Control" className="h-12 w-12 mx-auto" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Track industry news and competitors</CardTitle>
              <CardDescription>A.I. Powered news tailored to you</CardDescription>
            </CardHeader>
            <CardContent>
              <img src="news.png" alt="News" className="h-12 w-12 mx-auto" />
            </CardContent>
          </Card>          <Card>
            <CardHeader>
              <CardTitle>A.I. Suggested Social Media Posts</CardTitle>
              <CardDescription> Create and publish social media posts</CardDescription>
            </CardHeader>
            <CardContent>
              <img src="/icons/git-branch.svg" alt="Version Control" className="h-12 w-12 mx-auto" />
            </CardContent>
          </Card>          <Card>
            <CardHeader>
              <CardTitle>Your Own L.L.M.</CardTitle>
              <CardDescription>Your own Large Language Model trained on your company’s documents and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <img src="ai-llm.png" alt="AI" className="h-12 w-12 mx-auto" />
            </CardContent>
          </Card>
        </div>
      </section>
      <section id="testimonials" className="bg-muted py-8 md:py-12 lg:py-24">
        <div className="container">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Trained by I.R. and P.R. Professionals</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Created from the ground up by industry experts with 50+ years of experience in the industry
            </p>

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
    </div>
  )
}

