import { useQuery } from "@tanstack/react-query"
import { getFavorites } from "@/lib/favorites-api"
import { queryKeys } from "@/lib/query-keys"

export function useFavorites(skip = 0, limit = 100) {
  return useQuery({
    queryKey: queryKeys.favorites.list(skip, limit),
    queryFn: () => getFavorites(skip, limit),
  })
}
