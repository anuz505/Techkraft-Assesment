export interface Favorite {
  id: string
  user_id: string
  property_id: string
  created_at: string
  updated_at: string
}

export interface FavoriteCreateInput {
  property_id: string
}

export interface FavoriteCheckResponse {
  is_favorited: boolean
}
