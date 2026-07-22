import api from '@/lib/api'
import type { PaginatedResponse, Article, ArticleCategory } from '@/types'

export const blogService = {
  async getCategories() {
    const response = await api.get<ArticleCategory[]>('/blog/categories/')
    return response.data
  },

  async getArticles(params?: Record<string, string>) {
    const response = await api.get<PaginatedResponse<Article>>('/blog/', {
      params,
    })
    return response.data
  },

  async getArticle(slug: string) {
    const response = await api.get<Article>(`/blog/${slug}/`)
    return response.data
  },

  async getComments(slug: string) {
    const response = await api.get(`/blog/${slug}/comments/`)
    return response.data
  },

  async addComment(slug: string, text: string) {
    const response = await api.post(`/blog/${slug}/comments/`, { text })
    return response.data
  },
}
