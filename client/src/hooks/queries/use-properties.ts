import { useQuery } from "@tanstack/react-query"
import { getProperties } from "@/lib/properties-api"
import { queryKeys } from "@/lib/query-keys"
import type { PropertyListParams } from "@/types/property"

export function useProperties(params: PropertyListParams) {
  return useQuery({
    queryKey: queryKeys.properties.list(params as Record<string, unknown>),
    queryFn: () => getProperties(params),
  })
}
