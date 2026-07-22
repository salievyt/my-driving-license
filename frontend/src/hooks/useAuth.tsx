import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { authService } from '@/services/auth'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  register: (data: {
    username: string
    email: string
    password: string
    password_confirm: string
    first_name: string
    last_name: string
  }) => Promise<void>
  logout: () => Promise<void>
  updateUser: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadUser = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      setIsLoading(false)
      return
    }
    try {
      const userData = await authService.getMe()
      setUser(userData)
    } catch {
      authService.clearTokens()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const login = useCallback(async (username: string, password: string) => {
    const response = await authService.login({ username, password })
    authService.saveTokens(response.tokens)
    setUser(response.user)
  }, [])

  const register = useCallback(async (data: {
    username: string
    email: string
    password: string
    password_confirm: string
    first_name: string
    last_name: string
  }) => {
    const response = await authService.register(data)
    authService.saveTokens(response.tokens)
    setUser(response.user)
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // ignore
    }
    authService.clearTokens()
    setUser(null)
  }, [])

  const updateUser = useCallback(async (data: Partial<User>) => {
    const updated = await authService.updateProfile(data)
    setUser(updated)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
