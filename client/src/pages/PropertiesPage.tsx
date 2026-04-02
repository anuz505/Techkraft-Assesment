import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PropertyFilters from "@/components/property/property-filters"
import PropertyGrid from "@/components/property/property-grid"
import PropertyPagination from "@/components/property/property-pagination"
import PropertySkeleton from "@/components/property/property-skeleton"
import { useAuth } from "@/contexts/AuthContext"
import { usePropertyMutations } from "@/hooks/mutations/use-property-mutations"
import { useProperties } from "@/hooks/queries/use-properties"
import { extractApiError } from "@/lib/api-client"
import type {
  Property,
  PropertyCreateInput,
  PropertyFilters as PropertyFiltersState,
  PropertyStatus,
  PropertyUpdateInput,
} from "@/types/property"

const PAGE_SIZE = 9

interface PropertyFormState {
  title: string
  address: string
  state: string
  price: string
  bedrooms: string
  bathrooms: string
  image_url: string
  description: string
  status: PropertyStatus
}

const EMPTY_FORM: PropertyFormState = {
  title: "",
  address: "",
  state: "",
  price: "",
  bedrooms: "",
  bathrooms: "",
  image_url: "",
  description: "",
  status: "available",
}

function mapPropertyToForm(property: Property): PropertyFormState {
  return {
    title: property.title,
    address: property.address,
    state: property.state,
    price: String(property.price),
    bedrooms: String(property.bedrooms),
    bathrooms: String(property.bathrooms),
    image_url: property.image_url ?? "",
    description: property.description ?? "",
    status: property.status,
  }
}

function buildPayload(form: PropertyFormState): PropertyCreateInput {
  return {
    title: form.title.trim(),
    address: form.address.trim(),
    state: form.state.trim(),
    price: Number(form.price),
    bedrooms: Number(form.bedrooms),
    bathrooms: Number(form.bathrooms),
    image_url: form.image_url.trim() || null,
    description: form.description.trim() || null,
    status: form.status,
  }
}

function PropertiesPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"

  const [filters, setFilters] = useState<PropertyFiltersState>({
    query: "",
    status: "",
    state: "",
    minPrice: null,
    maxPrice: null,
  })
  const [page, setPage] = useState(1)
  const [form, setForm] = useState<PropertyFormState>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const params = useMemo(
    () => ({
      ...filters,
      skip: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
    }),
    [filters, page],
  )

  const { data = [], isLoading, isError, error } = useProperties(params)
  const {
    createProperty,
    updateProperty,
    deleteProperty,
    isCreating,
    isUpdating,
    isDeleting,
    deletingPropertyId,
  } = usePropertyMutations()

  const handleApplyFilters = (nextFilters: PropertyFiltersState) => {
    setPage(1)
    setFilters(nextFilters)
  }

  const handleInputChange = (field: keyof PropertyFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = (payload: PropertyCreateInput) => {
    if (!payload.title || !payload.address || !payload.state) {
      return "Title, address and state are required."
    }
    if (!Number.isFinite(payload.price) || payload.price <= 0) {
      return "Price must be greater than 0."
    }
    if (form.bedrooms.trim() === "" || !Number.isFinite(payload.bedrooms) || payload.bedrooms < 0) {
      return "Bedrooms must be 0 or more."
    }
    if (form.bathrooms.trim() === "" || !Number.isFinite(payload.bathrooms) || payload.bathrooms <= 0) {
      return "Bathrooms must be greater than 0."
    }
    return null
  }

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setFormError(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    const payload = buildPayload(form)
    const validationError = validateForm(payload)
    if (validationError) {
      setFormError(validationError)
      return
    }

    try {
      if (editingId) {
        const updatePayload: PropertyUpdateInput = { ...payload }
        await updateProperty({ propertyId: editingId, input: updatePayload })
      } else {
        await createProperty(payload)
      }
      resetForm()
    } catch (submitError) {
      setFormError(extractApiError(submitError, "Unable to save property"))
    }
  }

  const handleEdit = (property: Property) => {
    setEditingId(property.id)
    setForm(mapPropertyToForm(property))
    setFormError(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (property: Property) => {
    const shouldDelete = window.confirm(`Delete property \"${property.title}\"?`)
    if (!shouldDelete) {
      return
    }

    try {
      await deleteProperty(property.id)
      if (editingId === property.id) {
        resetForm()
      }
    } catch (deleteError) {
      setFormError(extractApiError(deleteError, "Unable to delete property"))
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6 sm:p-10">
      <div>
        <h1 className="text-3xl font-semibold">Properties</h1>
      </div>

      {isAdmin ? (
        <section className="rounded-xl border p-4">
          <h2 className="text-lg font-semibold">{editingId ? "Edit property" : "Add property"}</h2>
          <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input
                placeholder="Title"
                value={form.title}
                onChange={(event) => handleInputChange("title", event.target.value)}
              />
              <Input
                placeholder="Address"
                value={form.address}
                onChange={(event) => handleInputChange("address", event.target.value)}
              />
              <Input
                placeholder="State"
                value={form.state}
                onChange={(event) => handleInputChange("state", event.target.value)}
              />
              <Input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(event) => handleInputChange("price", event.target.value)}
              />
              <Input
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="Bedrooms"
                value={form.bedrooms}
                onChange={(event) => handleInputChange("bedrooms", event.target.value)}
              />
              <Input
                type="number"
                min="1"
                inputMode="numeric"
                placeholder="Bathrooms"
                value={form.bathrooms}
                onChange={(event) => handleInputChange("bathrooms", event.target.value)}
              />
              <div className="space-y-1">
                <Input
                  placeholder="Image URL (optional)"
                  value={form.image_url}
                  onChange={(event) => handleInputChange("image_url", event.target.value)}
                />
                <span className="block text-xs text-muted-foreground">Image upload is not implemented for now.</span>
              </div>
              <select
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                value={form.status}
                onChange={(event) => handleInputChange("status", event.target.value)}
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
              </select>
            </div>
            <Input
              placeholder="Description (optional)"
              value={form.description}
              onChange={(event) => handleInputChange("description", event.target.value)}
            />

            {formError ? (
              <p className="text-sm text-destructive">{formError}</p>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={isCreating || isUpdating}>
                {editingId ? (isUpdating ? "Updating..." : "Update property") : isCreating ? "Adding..." : "Add property"}
              </Button>
              {editingId ? (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel edit
                </Button>
              ) : null}
            </div>
          </form>
        </section>
      ) : null}

      <PropertyFilters value={filters} onApply={handleApplyFilters} />

      {isLoading ? <PropertySkeleton /> : null}

      {isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {extractApiError(error, "Failed to load properties")}
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <PropertyGrid
          properties={data}
          onEdit={isAdmin ? handleEdit : undefined}
          onDelete={isAdmin ? handleDelete : undefined}
          deletingPropertyId={isDeleting ? deletingPropertyId : undefined}
        />
      ) : null}

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
