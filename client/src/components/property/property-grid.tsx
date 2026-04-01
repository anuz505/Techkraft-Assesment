import PropertyCard from "@/components/property/property-card"
import type { Property } from "@/types/property"

interface PropertyGridProps {
  properties: Property[]
}

function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
        No properties match your filters.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}

export default PropertyGrid
