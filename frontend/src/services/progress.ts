import api from '@/lib/api'
import type { ProgressDashboard, StudySession } from '@/types'

export const progressService = {
  async getDashboard() {
    const response = await api.get<ProgressDashboard>('/progress/dashboard/')
    return response.data
  },

  async getProgress() {
    const response = await api.get('/progress/')
    return response.data
  },

  async getWeakTopics() {
    const response = await api.get('/progress/weak_topics/')
    return response.data
  },

  async getStudySessions() {
    const response = await api.get('/progress/study_sessions/')
    return response.data
  },

  async getAchievements() {
    const response = await api.get('/progress/achievements/')
    return response.data
  },

  async logSession(data: Omit<StudySession, 'id' | 'date' | 'points_earned'>) {
    const response = await api.post('/progress/log_session/', data)
    return response.data
  },
}
