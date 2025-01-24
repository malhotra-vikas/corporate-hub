import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Features | AiirHub",
  description: "Explore the features of AiirHub",
}

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">AiirHub Features</h1>
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Secure Document Storage</h2>
          <p className="mb-4">
            Store your corporate documents with enterprise-grade security. Our vault ensures that your sensitive
            information remains confidential and protected.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Easy Document Creation</h2>
          <p className="mb-4">
            Create professional documents effortlessly with our intuitive interface. From press releases to financial
            reports, we've got you covered.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Collaboration Tools</h2>
          <p className="mb-4">
            Work seamlessly with your team. Our collaboration tools make it easy to share, edit, and review documents in
            real-time.
          </p>
        </section>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}

