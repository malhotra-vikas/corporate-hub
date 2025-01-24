import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export const metadata: Metadata = {
  title: "Create Document",
  description: "Create a new corporate document",
}

export default function DocumentCreationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Create New Document</h3>
        <p className="text-sm text-muted-foreground">
          Create a new corporate document such as a press release, earnings release, or shareholder letter.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="document-type">Document Type</Label>
          <select id="document-type" className="w-full p-2 border rounded">
            <option>Press Release</option>
            <option>Earnings Release</option>
            <option>Shareholder Letter</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Enter document title" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea id="content" placeholder="Enter document content" className="min-h-[200px]" />
        </div>
        <Button>Create Document</Button>
      </div>
    </div>
  )
}

