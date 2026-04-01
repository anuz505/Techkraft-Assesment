import axios from "axios"

type RetryableRequestConfig = {
  _retry?: boolean
}

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000"

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error)
    }

    const originalRequest = error.config as typeof error.config & RetryableRequestConfig
    const status = error.response?.status
    const requestUrl = originalRequest?.url ?? ""
    const isAuthEndpoint =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/logout")

    if (!originalRequest || status !== 401 || isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      await apiClient.post("/auth/refresh")
      return apiClient(originalRequest)
    } catch (refreshError) {
      return Promise.reject(refreshError)
    }
  },
)

export function extractApiError(error: unknown, fallback = "Something went wrong") {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === "string") {
      return detail
    }

    if (Array.isArray(detail) && detail.length > 0) {
      return String(detail[0]?.msg ?? fallback)
    }

    return error.message || fallback
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}
