import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Pricing | CorporateHub",
  description: "CorporateHub pricing plans",
}

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Pricing Plans</h1>
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-4">$29/mo</p>
            <ul className="list-disc list-inside mb-4">
              <li>5GB Storage</li>
              <li>10 Users</li>
              <li>Basic Support</li>
            </ul>
            <Button className="w-full">Get Started</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-4">$79/mo</p>
            <ul className="list-disc list-inside mb-4">
              <li>50GB Storage</li>
              <li>Unlimited Users</li>
              <li>Priority Support</li>
            </ul>
            <Button className="w-full">Get Started</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-4">Custom</p>
            <ul className="list-disc list-inside mb-4">
              <li>Unlimited Storage</li>
              <li>Unlimited Users</li>
              <li>24/7 Dedicated Support</li>
            </ul>
            <Button className="w-full">Contact Sales</Button>
          </CardContent>
        </Card>
      </div>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  )
}

