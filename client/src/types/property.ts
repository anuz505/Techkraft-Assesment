export type PropertyStatus = "available" | "sold"

export interface Property {
  id: string
  title: string
  address: string
  state: string
  price: string
  bedrooms: number
  bathrooms: number
  image_url: string | null
  description: string | null
  status: PropertyStatus
  created_at: string
  updated_at: string
}

export interface PropertyFilters {
  query?: string
  status?: PropertyStatus | ""
  state?: string
  minPrice?: number | null
  maxPrice?: number | null
}

export interface PropertyListParams extends PropertyFilters {
  skip?: number
  limit?: number
}

export interface PropertyUpsertInput {
  title: string
  address: string
  state: string
  price: number
  bedrooms: number
  bathrooms: number
  image_url?: string | null
  description?: string | null
  status: PropertyStatus
}

export type PropertyCreateInput = PropertyUpsertInput
export type PropertyUpdateInput = Partial<PropertyUpsertInput>
