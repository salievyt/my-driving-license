import api from '@/lib/api'
import type { PaginatedResponse, Quiz, QuizAttempt } from '@/types'

export const quizzesService = {
  async getQuizzes(params?: Record<string, string>) {
    const response = await api.get<PaginatedResponse<Quiz>>('/quizzes/', {
      params,
    })
    return response.data
  },

  async getQuiz(slug: string) {
    const response = await api.get<Quiz>(`/quizzes/${slug}/`)
    return response.data
  },

  async startQuiz(slug: string) {
    const response = await api.post(`/quizzes/${slug}/start/`)
    return response.data
  },

  async submitQuiz(slug: string, data: {
    attempt_id: number
    answers: Record<string, number[]>
    time_spent_seconds: number
  }) {
    const response = await api.post<QuizAttempt>(
      `/quizzes/${slug}/submit/`,
      data
    )
    return response.data
  },

  async getAttempts() {
    const response = await api.get('/quizzes/attempts/')
    return response.data
  },

  async getAttemptDetails(id: number) {
    const response = await api.get(`/quizzes/attempts/${id}/details/`)
    return response.data
  },
}
