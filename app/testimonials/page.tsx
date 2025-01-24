import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Testimonials | CorporateHub",
  description: "What our clients say about CorporateHub",
}

export default function TestimonialsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Client Testimonials</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>John Doe</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              "CorporateHub has revolutionized how we manage our documents. It's secure, efficient, and user-friendly."
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Jane Smith</CardTitle>
          </CardHeader>
          <CardContent>
            <p>"The collaboration features have greatly improved our team's productivity. Highly recommended!"</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mike Johnson</CardTitle>
          </CardHeader>
          <CardContent>
            <p>"CorporateHub's security measures give us peace of mind when handling sensitive documents."</p>
          </CardContent>
        </Card>
      </div>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  )
}

