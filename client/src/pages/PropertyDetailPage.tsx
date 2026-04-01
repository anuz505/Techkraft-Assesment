import { Link, useParams } from "react-router-dom"
import FavoriteToggle from "@/components/property/favorite-toggle"
import { Button } from "@/components/ui/button"
import { usePropertyDetail } from "@/hooks/queries/use-property-detail"
import { extractApiError } from "@/lib/api-client"

function PropertyDetailPage() {
  const { propertyId = "" } = useParams()
  const { data: property, isLoading, isError, error } = usePropertyDetail(propertyId)

  if (isLoading) {
    return (
      <main className="mx-auto flex w-full max-w-4xl items-center justify-center p-6 sm:p-10">
        <p className="text-muted-foreground">Loading property...</p>
      </main>
    )
  }

  if (isError || !property) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-col justify-center gap-4 p-6 sm:p-10">
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {extractApiError(error, "Failed to load property")}
        </div>
        <Button asChild variant="outline" className="w-fit">
          <Link to="/properties">Back to properties</Link>
        </Button>
      </main>
    )
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6 sm:p-10">
      <div className="h-64 w-full overflow-hidden rounded-xl border bg-muted">
        {property.image_url ? (
          <img src={property.image_url} alt={property.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Property image placeholder
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">{property.title}</h1>
        <FavoriteToggle propertyId={property.id} />
      </div>
      <p className="text-muted-foreground">
        {property.address}, {property.state}
      </p>
      <p className="text-2xl font-semibold">${Number(property.price).toLocaleString()}</p>
      <p className="text-muted-foreground">
        {property.bedrooms} bedrooms • {property.bathrooms} bathrooms • {property.status}
      </p>
      {property.description ? <p>{property.description}</p> : null}
      <Button asChild variant="outline" className="w-fit">
        <Link to="/properties">Back to properties</Link>
      </Button>
    </main>
  )
}

export default PropertyDetailPage
