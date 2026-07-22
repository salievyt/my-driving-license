import api from '@/lib/api'
import type { PaginatedResponse, Category, Lesson } from '@/types'

export const lessonsService = {
  async getCategories() {
    const response = await api.get<Category[]>('/lessons/categories/')
    return response.data
  },

  async getLessons(params?: Record<string, string>) {
    const response = await api.get<PaginatedResponse<Lesson>>('/lessons/', {
      params,
    })
    return response.data
  },

  async getLesson(slug: string) {
    const response = await api.get<Lesson>(`/lessons/${slug}/`)
    return response.data
  },

  async updateProgress(lessonSlug: string, data: { is_completed?: boolean; time_spent_minutes?: number }) {
    const response = await api.post('/lessons/progress/update_progress/', {
      lesson_slug: lessonSlug,
      ...data,
    })
    return response.data
  },
}
