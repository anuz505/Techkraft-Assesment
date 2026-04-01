import { apiClient } from "@/lib/api-client"
import type { Favorite, FavoriteCheckResponse, FavoriteCreateInput } from "@/types/favorite"

export async function getFavorites(skip = 0, limit = 100): Promise<Favorite[]> {
  const { data } = await apiClient.get<Favorite[]>("/favorites", {
    params: {
      skip,
      limit,
    },
  })
  return data
}

export async function checkFavorite(propertyId: string): Promise<FavoriteCheckResponse> {
  const { data } = await apiClient.get<FavoriteCheckResponse>(`/favorites/check/${propertyId}`)
  return data
}

export async function addFavorite(input: FavoriteCreateInput): Promise<Favorite> {
  const { data } = await apiClient.post<Favorite>("/favorites", input)
  return data
}

export async function removeFavoriteByProperty(propertyId: string): Promise<void> {
  await apiClient.delete(`/favorites/property/${propertyId}`)
}
