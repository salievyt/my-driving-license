import api from '@/lib/api'

export const onboardingService = {
  async getDiagnosticQuestions(count = 5) {
    const response = await api.get('/quizzes/diagnostic/', {
      params: { count },
    })
    return response.data
  },

  async submitDiagnostic(data: {
    answers: Record<string, number[]>
    experience_level?: string
    study_goal?: string
    study_goal_minutes?: number
  }) {
    const response = await api.post('/quizzes/diagnostic_submit/', data)
    return response.data
  },

  // Daily Question
  async getDailyQuestion() {
    const response = await api.get('/notifications/daily-question/')
    return response.data
  },

  async answerDailyQuestion(questionId: number, answerIds: number[]) {
    const response = await api.post(
      `/notifications/daily-question/${questionId}/answer/`,
      { answer_ids: answerIds }
    )
    return response.data
  },
}
