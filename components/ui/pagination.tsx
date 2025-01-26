import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

interface PaginationProps {
  totalPages: number
  currentPage: number
  totalCount: number
}

export function Pagination({ totalPages, currentPage, totalCount }: PaginationProps) {
  return (
    <div className="flex items-center justify-between space-x-6">
      <div className="text-sm text-muted-foreground">Total documents: {totalCount}</div>
      <div className="flex items-center space-x-6">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            disabled={currentPage <= 1}
            aria-label="Go to previous page"
            asChild
          >
            <Link href={`/dashboard/vault?page=${currentPage - 1}`}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            disabled={currentPage >= totalPages}
            aria-label="Go to next page"
            asChild
          >
            <Link href={`/dashboard/vault?page=${currentPage + 1}`}>
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

