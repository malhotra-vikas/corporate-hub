import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
    title: "About Us | CorporateHub",
    description: "Learn more about CorporateHub and our mission",
}

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-6">About CorporateHub</h1>
            <div className="space-y-6 max-w-3xl">
                <p>
                    CorporateHub is a leading provider of secure document management solutions for modern enterprises. Our
                    platform is designed to streamline corporate document workflows with enterprise-grade security and AI-powered
                    collaboration tools.
                </p>
                <p>
                    Founded in 2023, our mission is to empower businesses of all sizes to manage their sensitive documents
                    efficiently and securely. We understand the challenges that companies face in today's fast-paced, digital
                    world, and we're committed to providing innovative solutions that meet these evolving needs.
                </p>
                <p>
                    Our team consists of experienced professionals from diverse backgrounds, including information security,
                    software engineering, and corporate governance. This blend of expertise allows us to deliver a comprehensive
                    platform that addresses the complex requirements of modern businesses.
                </p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">Our Core Values</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Security: We prioritize the protection of your sensitive information above all else.</li>
                    <li>Innovation: We continuously evolve our platform to stay ahead of industry trends and needs.</li>
                    <li>User-Centric Design: We believe in creating intuitive, user-friendly experiences.</li>
                    <li>Compliance: We ensure our platform adheres to global regulatory standards.</li>
                    <li>Collaboration: We foster teamwork and efficient communication within organizations.</li>
                </ul>
                <div className="mt-8">
                    <Link href="/contact">
                        <Button>Contact Us</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

