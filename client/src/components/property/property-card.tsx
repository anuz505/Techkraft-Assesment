import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import FavoriteToggle from "@/components/property/favorite-toggle"
import type { Property } from "@/types/property"

interface PropertyCardProps {
  property: Property
}

function formatPrice(value: string) {
  const numeric = Number(value)
  if (Number.isNaN(numeric)) {
    return value
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numeric)
}

function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="h-full overflow-hidden">
      <div className="relative h-44 w-full bg-muted">
        {property.image_url ? (
          <img
            src={property.image_url}
            alt={property.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Property image placeholder
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle>{property.title}</CardTitle>
        <CardDescription>
          {property.address}, {property.state}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-2xl font-semibold">{formatPrice(property.price)}</p>
        <p className="text-sm text-muted-foreground">
          {property.bedrooms} bed • {property.bathrooms} bath • {property.status}
        </p>
        {property.description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">{property.description}</p>
        ) : null}
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2">
        <Button asChild variant="outline">
          <Link to={`/properties/${property.id}`}>View details</Link>
        </Button>
        <FavoriteToggle propertyId={property.id} />
      </CardFooter>
    </Card>
  )
}

export default PropertyCard
