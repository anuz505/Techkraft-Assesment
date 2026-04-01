import { useQuery } from "@tanstack/react-query"
import { checkFavorite } from "@/lib/favorites-api"
import { queryKeys } from "@/lib/query-keys"

export function useFavoriteCheck(propertyId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.favorites.check(propertyId),
    queryFn: () => checkFavorite(propertyId),
    enabled: !!propertyId && enabled,
  })
}
