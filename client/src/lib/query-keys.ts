export const queryKeys = {
  properties: {
    all: ["properties"] as const,
    list: (params: Record<string, unknown>) => ["properties", "list", params] as const,
    detail: (propertyId: string) => ["properties", "detail", propertyId] as const,
  },
  favorites: {
    all: ["favorites"] as const,
    list: (skip: number, limit: number) => ["favorites", "list", skip, limit] as const,
    check: (propertyId: string) => ["favorites", "check", propertyId] as const,
  },
}
