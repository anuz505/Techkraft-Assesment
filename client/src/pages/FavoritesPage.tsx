import { useQueries } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import PropertyGrid from "@/components/property/property-grid"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/hooks/queries/use-favorites"
import { getPropertyById } from "@/lib/properties-api"
import { queryKeys } from "@/lib/query-keys"

function FavoritesPage() {
  const { data: favorites = [], isLoading, isError } = useFavorites()

  const propertyQueries = useQueries({
    queries: favorites.map((favorite) => ({
      queryKey: queryKeys.properties.detail(favorite.property_id),
      queryFn: () => getPropertyById(favorite.property_id),
    })),
  })

  const favoriteProperties = propertyQueries
    .map((query) => query.data)
    .filter((property): property is NonNullable<typeof property> => !!property)

  const detailsLoading = propertyQueries.some((query) => query.isLoading)

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 p-6 sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">TechKraft</p>
          <h1 className="text-3xl font-semibold">My favorites</h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/properties">Browse properties</Link>
        </Button>
      </div>

      {isLoading || detailsLoading ? (
        <p className="text-muted-foreground">Loading favorites...</p>
      ) : null}

      {isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load favorites.
        </div>
      ) : null}

      {!isLoading && !isError && favoriteProperties.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          You do not have any saved properties yet.
        </div>
      ) : null}

      {!isLoading && !isError && favoriteProperties.length > 0 ? (
        <PropertyGrid properties={favoriteProperties} />
      ) : null}
    </main>
  )
}

export default FavoritesPage
