import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addFavorite, removeFavoriteByProperty } from "@/lib/favorites-api"
import { queryKeys } from "@/lib/query-keys"

export function useFavoriteMutations() {
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: (propertyId: string) => addFavorite({ property_id: propertyId }),
    onSuccess: (_data, propertyId) => {
      queryClient.setQueryData(queryKeys.favorites.check(propertyId), { is_favorited: true })
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all })
    },
  })

  const removeMutation = useMutation({
    mutationFn: (propertyId: string) => removeFavoriteByProperty(propertyId),
    onSuccess: (_data, propertyId) => {
      queryClient.setQueryData(queryKeys.favorites.check(propertyId), { is_favorited: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all })
    },
  })

  return {
    addFavorite: addMutation.mutateAsync,
    removeFavorite: removeMutation.mutateAsync,
    isMutating: addMutation.isPending || removeMutation.isPending,
  }
}
