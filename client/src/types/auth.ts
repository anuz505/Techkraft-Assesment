export type UserRole = "user" | "admin"

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface SignInInput {
  username: string
  password: string
}

export interface SignUpInput {
  username: string
  email: string
  password: string
  role?: UserRole
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
}
