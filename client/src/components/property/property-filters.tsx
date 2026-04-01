import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"
import type { PropertyFilters as PropertyFiltersState } from "@/types/property"

interface PropertyFiltersProps {
  value: PropertyFiltersState
  onApply: (filters: PropertyFiltersState) => void
}

function PropertyFilters({ value, onApply }: PropertyFiltersProps) {
  const [draft, setDraft] = useState<PropertyFiltersState>(value)

  useEffect(() => {
    setDraft(value)
  }, [value])

  const handleApply = () => {
    onApply(draft)
  }

  const clearFilters = () => {
    const empty: PropertyFiltersState = {
      query: "",
      state: "",
      status: "",
      minPrice: null,
      maxPrice: null,
    }
    setDraft(empty)
    onApply(empty)
  }

  return (
    <div className="space-y-3 rounded-xl border p-4">
      <Input
        className="h-10 w-full"
        placeholder="Search title or address"
        value={draft.query ?? ""}
        onChange={(event) => setDraft((prev) => ({ ...prev, query: event.target.value }))}
      />

      <div className="flex flex-wrap gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline">
              {draft.state ? `State: ${draft.state}` : "State"}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72">
            <PopoverHeader>
              <PopoverTitle>State</PopoverTitle>
            </PopoverHeader>
            <Input
              placeholder="e.g. CA"
              value={draft.state ?? ""}
              onChange={(event) => setDraft((prev) => ({ ...prev, state: event.target.value }))}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline">
              {draft.status ? `Status: ${draft.status}` : "Status"}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 space-y-2">
            <PopoverHeader>
              <PopoverTitle>Status</PopoverTitle>
            </PopoverHeader>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={draft.status === "available" ? "default" : "outline"}
                onClick={() => setDraft((prev) => ({ ...prev, status: "available" }))}
              >
                Available
              </Button>
              <Button
                type="button"
                variant={draft.status === "sold" ? "default" : "outline"}
                onClick={() => setDraft((prev) => ({ ...prev, status: "sold" }))}
              >
                Sold
              </Button>
            </div>
            <Button
              type="button"
              variant="ghost"
              className="w-fit"
              onClick={() => setDraft((prev) => ({ ...prev, status: "" }))}
            >
              Clear status
            </Button>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline">
              Price range
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80 space-y-2">
            <PopoverHeader>
              <PopoverTitle>Price range</PopoverTitle>
            </PopoverHeader>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="min-price">Min</Label>
                <Input
                  id="min-price"
                  type="number"
                  placeholder="0"
                  value={draft.minPrice ?? ""}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      minPrice: event.target.value ? Number(event.target.value) : null,
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="max-price">Max</Label>
                <Input
                  id="max-price"
                  type="number"
                  placeholder="1000000"
                  value={draft.maxPrice ?? ""}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      maxPrice: event.target.value ? Number(event.target.value) : null,
                    }))
                  }
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button onClick={handleApply} type="button">Apply filters</Button>
        <Button onClick={clearFilters} type="button" variant="outline">Clear</Button>
      </div>
    </div>
  )
}

export default PropertyFilters
