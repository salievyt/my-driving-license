import api from '@/lib/api'
import type { SubscriptionPlan, UserSubscription } from '@/types'

export const subscriptionsService = {
  async getPlans() {
    const response = await api.get<SubscriptionPlan[]>('/subscriptions/plans/')
    return response.data
  },

  async getMySubscriptions() {
    const response = await api.get<UserSubscription[]>('/subscriptions/my/')
    return response.data
  },

  async getActiveSubscription() {
    const response = await api.get<UserSubscription | null>(
      '/subscriptions/my/active/'
    )
    return response.data
  },

  async getSubscriptionHistory() {
    const response = await api.get<UserSubscription[]>(
      '/subscriptions/my/history/'
    )
    return response.data
  },
}
