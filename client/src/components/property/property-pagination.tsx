import { Button } from "@/components/ui/button"

interface PropertyPaginationProps {
  page: number
  pageSize: number
  count: number
  onPrev: () => void
  onNext: () => void
}

function PropertyPagination({ page, pageSize, count, onPrev, onNext }: PropertyPaginationProps) {
  const disablePrev = page === 1
  const disableNext = count < pageSize

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
      <p className="text-sm text-muted-foreground">Page {page}</p>
      <div className="flex gap-2">
        <Button type="button" variant="outline" disabled={disablePrev} onClick={onPrev}>
          Previous
        </Button>
        <Button type="button" variant="outline" disabled={disableNext} onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  )
}

export default PropertyPagination
