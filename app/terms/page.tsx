import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Terms of Service | AiirHub",
  description: "AiirHub Terms of Service",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <div className="space-y-4 mb-6">
        <p>Welcome to AiirHub. By using our service, you agree to these terms. Please read them carefully.</p>
        <h2 className="text-2xl font-semibold">1. Use of Service</h2>
        <p>
          You must follow any policies made available to you within the Services. Don't misuse our Services. For
          example, don't interfere with our Services or try to access them using a method other than the interface and
          the instructions that we provide.
        </p>
        <h2 className="text-2xl font-semibold">2. Privacy</h2>
        <p>
        AiirHub's privacy policies explain how we treat your personal data and protect your privacy when you use
          our Services. By using our Services, you agree that AiirHub can use such data in accordance with our
          privacy policies.
        </p>
        <h2 className="text-2xl font-semibold">3. Modifications</h2>
        <p>
          We may modify these terms or any additional terms that apply to a Service to, for example, reflect changes to
          the law or changes to our Services. You should look at the terms regularly.
        </p>
      </div>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  )
}

