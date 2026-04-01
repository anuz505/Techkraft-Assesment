import { apiClient } from "@/lib/api-client"
import type { SignInInput, SignUpInput, TokenResponse, User } from "@/types/auth"

export async function signInRequest(input: SignInInput): Promise<TokenResponse> {
  const body = new URLSearchParams()
  body.set("username", input.username)
  body.set("password", input.password)

  const { data } = await apiClient.post<TokenResponse>("/auth/login", body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })

  return data
}

export async function signUpRequest(input: SignUpInput): Promise<User> {
  const { data } = await apiClient.post<User>("/auth/", input)
  return data
}

export async function refreshRequest(): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>("/auth/refresh")
  return data
}

export async function logoutRequest(): Promise<void> {
  await apiClient.post("/auth/logout")
}

export async function meRequest(): Promise<User> {
  const { data } = await apiClient.get<User>("/auth/me")
  return data
}
