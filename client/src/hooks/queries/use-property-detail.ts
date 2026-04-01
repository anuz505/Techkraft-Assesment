import { useQuery } from "@tanstack/react-query"
import { getPropertyById } from "@/lib/properties-api"
import { queryKeys } from "@/lib/query-keys"

export function usePropertyDetail(propertyId: string) {
  return useQuery({
    queryKey: queryKeys.properties.detail(propertyId),
    queryFn: () => getPropertyById(propertyId),
    enabled: !!propertyId,
  })
}
