import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Privacy Policy | AiirHub",
  description: "AiirHub Privacy Policy",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <div className="space-y-4 mb-6">
        <p>
          At AiirHub, we take your privacy seriously. This policy describes what personal information we collect
          and how we use it.
        </p>
        <h2 className="text-2xl font-semibold">1. Information Collection</h2>
        <p>
          We collect information to provide better services to all our users. We collect information in the following
          ways:
        </p>
        <ul className="list-disc list-inside">
          <li>Information you give us</li>
          <li>Information we get from your use of our services</li>
        </ul>
        <h2 className="text-2xl font-semibold">2. How We Use Information</h2>
        <p>
          We use the information we collect from all our services to provide, maintain, protect and improve them, to
          develop new ones, and to protect AiirHub and our users.
        </p>
        <h2 className="text-2xl font-semibold">3. Information Security</h2>
        <p>
          We work hard to protect AiirHub and our users from unauthorized access to or unauthorized alteration,
          disclosure or destruction of information we hold.
        </p>
      </div>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  )
}

