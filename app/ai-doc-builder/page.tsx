import { Metadata } from "next"
import AIDocBuilder from "@/components/ai-doc-builder/ai-doc-builder"

export const metadata: Metadata = {
  title: "AI Doc Builder | AiirHub",
  description: "Create corporate documents with AI assistance",
}

export default function AIDocBuilderPage() {
  return <AIDocBuilder />
}
