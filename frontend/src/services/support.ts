import api from '@/lib/api'
import type { FAQ, SupportTicket } from '@/types'

export const supportService = {
  async getFAQs() {
    const response = await api.get<Record<string, FAQ[]>>('/support/faq/')
    return response.data
  },

  async getTickets() {
    const response = await api.get<SupportTicket[]>('/support/tickets/')
    return response.data
  },

  async createTicket(data: {
    subject: string
    message: string
    priority?: string
    category?: string
  }) {
    const response = await api.post<SupportTicket>('/support/tickets/', data)
    return response.data
  },

  async getTicket(id: number) {
    const response = await api.get<SupportTicket>(`/support/tickets/${id}/`)
    return response.data
  },

  async sendMessage(ticketId: number, message: string) {
    const response = await api.post(
      `/support/tickets/${ticketId}/send_message/`,
      { message }
    )
    return response.data
  },

  async closeTicket(ticketId: number) {
    const response = await api.post(`/support/tickets/${ticketId}/close/`)
    return response.data
  },
}
