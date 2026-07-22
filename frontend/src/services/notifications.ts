import api from '@/lib/api'
import type { Notification, NotificationSettings } from '@/types'

export const notificationsService = {
  async getNotifications() {
    const response = await api.get<{
      notifications: Notification[]
      unread_count: number
      total_count: number
    }>('/notifications/')
    return response.data
  },

  async markRead(notificationIds?: number[]) {
    await api.post('/notifications/mark_read/', {
      notification_ids: notificationIds,
      all: !notificationIds,
    })
  },

  async getUnreadCount() {
    const response = await api.get<{ unread_count: number }>(
      '/notifications/unread_count/'
    )
    return response.data
  },

  async getSettings() {
    const response = await api.get<NotificationSettings>(
      '/notifications/settings/'
    )
    return response.data
  },

  async updateSettings(data: Partial<NotificationSettings>) {
    const response = await api.put<NotificationSettings>(
      '/notifications/settings/',
      data
    )
    return response.data
  },
}
