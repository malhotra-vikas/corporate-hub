import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <Icons.logo className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">CorporateHub</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/testimonials">
            Testimonials
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
            Dashboard
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to CorporateHub
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Streamline your corporate document management with our secure and intuitive platform.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/dashboard">
                  <Button>Get Started</Button>
                </Link>
                <Link href="/features">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Icons.logo className="h-10 w-10 mb-2" />
                <h3 className="text-xl font-bold">Secure Document Storage</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Store your corporate documents in our highly secure vault.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Icons.logo className="h-10 w-10 mb-2" />
                <h3 className="text-xl font-bold">Easy Document Creation</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Create professional documents with our intuitive interface.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Icons.logo className="h-10 w-10 mb-2" />
                <h3 className="text-xl font-bold">Collaboration Tools</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Work together seamlessly with your team on important documents.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              What Our Clients Say
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center italic">
                  "CorporateHub has revolutionized how we manage our documents. It's secure, efficient, and
                  user-friendly."
                </p>
                <p className="text-sm font-bold">- John Doe, CEO</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center italic">
                  "The collaboration features have greatly improved our team's productivity. Highly recommended!"
                </p>
                <p className="text-sm font-bold">- Jane Smith, CFO</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center italic">
                  "CorporateHub's security measures give us peace of mind when handling sensitive documents."
                </p>
                <p className="text-sm font-bold">- Mike Johnson, CTO</p>
              </div>
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Pricing Plans
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg bg-white dark:bg-gray-900">
                <h3 className="text-xl font-bold">Basic</h3>
                <p className="text-4xl font-bold">$29/mo</p>
                <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                  <li>5GB Storage</li>
                  <li>10 Users</li>
                  <li>Basic Support</li>
                </ul>
                <Button className="mt-4">Get Started</Button>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg bg-white dark:bg-gray-900">
                <h3 className="text-xl font-bold">Pro</h3>
                <p className="text-4xl font-bold">$79/mo</p>
                <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                  <li>50GB Storage</li>
                  <li>Unlimited Users</li>
                  <li>Priority Support</li>
                </ul>
                <Button className="mt-4">Get Started</Button>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg bg-white dark:bg-gray-900">
                <h3 className="text-xl font-bold">Enterprise</h3>
                <p className="text-4xl font-bold">Custom</p>
                <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                  <li>Unlimited Storage</li>
                  <li>Unlimited Users</li>
                  <li>24/7 Dedicated Support</li>
                </ul>
                <Button className="mt-4">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 CorporateHub. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="/terms">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="/privacy">
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

