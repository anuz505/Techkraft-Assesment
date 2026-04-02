import { apiClient } from "@/lib/api-client"
import type {
  Property,
  PropertyCreateInput,
  PropertyListParams,
  PropertyUpdateInput,
} from "@/types/property"

function appendIfDefined(params: URLSearchParams, key: string, value: unknown) {
  if (value === undefined || value === null || value === "") {
    return
  }
  params.append(key, String(value))
}

export async function getProperties(params: PropertyListParams = {}): Promise<Property[]> {
  const searchParams = new URLSearchParams()

  appendIfDefined(searchParams, "query", params.query)
  appendIfDefined(searchParams, "status", params.status)
  appendIfDefined(searchParams, "state", params.state)
  appendIfDefined(searchParams, "min_price", params.minPrice)
  appendIfDefined(searchParams, "max_price", params.maxPrice)
  appendIfDefined(searchParams, "skip", params.skip ?? 0)
  appendIfDefined(searchParams, "limit", params.limit ?? 12)

  const { data } = await apiClient.get<Property[]>(`/properties/?${searchParams.toString()}`)
  return data
}

export async function getPropertyById(propertyId: string): Promise<Property> {
  const { data } = await apiClient.get<Property>(`/properties/${propertyId}`)
  return data
}

export async function createProperty(input: PropertyCreateInput): Promise<Property> {
  const { data } = await apiClient.post<Property>("/properties/", input)
  return data
}

export async function updateProperty(propertyId: string, input: PropertyUpdateInput): Promise<Property> {
  const { data } = await apiClient.put<Property>(`/properties/${propertyId}`, input)
  return data
}

export async function deleteProperty(propertyId: string): Promise<void> {
  await apiClient.delete(`/properties/${propertyId}`)
}
