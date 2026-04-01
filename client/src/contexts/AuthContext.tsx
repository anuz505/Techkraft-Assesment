import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  logoutRequest,
  meRequest,
  refreshRequest,
  signInRequest,
  signUpRequest,
} from "@/lib/auth-api"
import { extractApiError } from "@/lib/api-client"
import type { SignInInput, SignUpInput, User } from "@/types/auth"

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  signIn: (input: SignInInput) => Promise<void>
  signUp: (input: SignUpInput) => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const bootstrapSession = useCallback(async () => {
    try {
      await refreshRequest()
      const profile = await meRequest()
      setUser(profile)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void bootstrapSession()
  }, [bootstrapSession])

  const signIn = useCallback(async (input: SignInInput) => {
    setError(null)
    await signInRequest(input)
    const profile = await meRequest()
    setUser(profile)
  }, [])

  const signUp = useCallback(async (input: SignUpInput) => {
    setError(null)
    await signUpRequest(input)
    await signInRequest({ username: input.username, password: input.password })
    const profile = await meRequest()
    setUser(profile)
  }, [])

  const signOut = useCallback(async () => {
    try {
      await logoutRequest()
    } finally {
      setUser(null)
    }
  }, [])

  const wrappedSignIn = useCallback(
    async (input: SignInInput) => {
      try {
        await signIn(input)
      } catch (err) {
        setUser(null)
        setError(extractApiError(err, "Unable to sign in"))
        throw err
      }
    },
    [signIn],
  )

  const wrappedSignUp = useCallback(
    async (input: SignUpInput) => {
      try {
        await signUp(input)
      } catch (err) {
        setUser(null)
        setError(extractApiError(err, "Unable to sign up"))
        throw err
      }
    },
    [signUp],
  )

  const wrappedSignOut = useCallback(async () => {
    try {
      await signOut()
    } catch (err) {
      setError(extractApiError(err, "Unable to sign out"))
      throw err
    }
  }, [signOut])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      signIn: wrappedSignIn,
      signUp: wrappedSignUp,
      signOut: wrappedSignOut,
      clearError,
    }),
    [clearError, error, isLoading, user, wrappedSignIn, wrappedSignOut, wrappedSignUp],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}
