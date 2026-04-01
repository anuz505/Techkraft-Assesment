import { useMemo, useState } from "react"
import PropertyFilters from "@/components/property/property-filters"
import PropertyGrid from "@/components/property/property-grid"
import PropertyPagination from "@/components/property/property-pagination"
import PropertySkeleton from "@/components/property/property-skeleton"
import { useProperties } from "@/hooks/queries/use-properties"
import { extractApiError } from "@/lib/api-client"
import type { PropertyFilters as PropertyFiltersState } from "@/types/property"

const PAGE_SIZE = 9

function PropertiesPage() {
  const [filters, setFilters] = useState<PropertyFiltersState>({
    query: "",
    status: "",
    state: "",
    minPrice: null,
    maxPrice: null,
  })
  const [page, setPage] = useState(1)

  const params = useMemo(
    () => ({
      ...filters,
      skip: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
    }),
    [filters, page],
  )

  const { data = [], isLoading, isError, error } = useProperties(params)

  const handleApplyFilters = (nextFilters: PropertyFiltersState) => {
    setPage(1)
    setFilters(nextFilters)
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6 sm:p-10">
      <div>
        <h1 className="text-3xl font-semibold">Properties</h1>
        <p className="text-muted-foreground">Find listings fast with search and quick popover filters.</p>
      </div>

      <PropertyFilters value={filters} onApply={handleApplyFilters} />

      {isLoading ? <PropertySkeleton /> : null}

      {isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {extractApiError(error, "Failed to load properties")}
        </div>
      ) : null}

      {!isLoading && !isError ? <PropertyGrid properties={data} /> : null}

      <PropertyPagination
        page={page}
        pageSize={PAGE_SIZE}
        count={data.length}
        onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
        onNext={() => setPage((prev) => prev + 1)}
      />
    </main>
  )
}

export default PropertiesPage
