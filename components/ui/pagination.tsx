import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

interface PaginationProps {
  totalPages: number
  currentPage: number
  totalCount: number
}

export function Pagination({ totalPages, currentPage, totalCount }: PaginationProps) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-between space-x-6">
      <div className="text-sm text-muted-foreground">Total documents: {totalCount}</div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" disabled={currentPage <= 1} aria-label="Go to previous page" asChild>
          <Link href={`?page=${currentPage - 1}`}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        {pageNumbers.map((page) => (
          <Button key={page} variant={currentPage === page ? "default" : "outline"} size="icon" asChild>
            <Link href={`?page=${page}`}>{page}</Link>
          </Button>
        ))}
        <Button variant="outline" size="icon" disabled={currentPage >= totalPages} aria-label="Go to next page" asChild>
          <Link href={`?page=${currentPage + 1}`}>
            <ChevronRightIcon className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

