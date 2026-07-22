import api from '@/lib/api'
import type { User, AuthTokens, LoginRequest, RegisterRequest } from '@/types'

export const authService = {
  async login(data: LoginRequest) {
    const response = await api.post<{ user: User; tokens: AuthTokens }>(
      '/auth/login/',
      data
    )
    return response.data
  },

  async register(data: RegisterRequest) {
    const response = await api.post<{ user: User; tokens: AuthTokens }>(
      '/auth/register/',
      data
    )
    return response.data
  },

  async logout() {
    const refresh = localStorage.getItem('refresh_token')
    await api.post('/auth/logout/', { refresh })
  },

  async getMe() {
    const response = await api.get<User>('/auth/me/')
    return response.data
  },

  async updateProfile(data: Partial<User>) {
    const response = await api.patch<User>('/auth/me/', data)
    return response.data
  },

  async getBadges() {
    const response = await api.get('/auth/badges/')
    return response.data
  },

  saveTokens(tokens: AuthTokens) {
    localStorage.setItem('access_token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
  },

  clearTokens() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },

  getAccessToken() {
    return localStorage.getItem('access_token')
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token')
  },
}
