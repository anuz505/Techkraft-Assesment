import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProperty, deleteProperty, updateProperty } from "@/lib/properties-api"
import { queryKeys } from "@/lib/query-keys"
import type { PropertyCreateInput, PropertyUpdateInput } from "@/types/property"

export function usePropertyMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (input: PropertyCreateInput) => createProperty(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ propertyId, input }: { propertyId: string; input: PropertyUpdateInput }) =>
      updateProperty(propertyId, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.detail(variables.propertyId) })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (propertyId: string) => deleteProperty(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })
    },
  })

  return {
    createProperty: createMutation.mutateAsync,
    updateProperty: updateMutation.mutateAsync,
    deleteProperty: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    deletingPropertyId: deleteMutation.variables,
  }
}