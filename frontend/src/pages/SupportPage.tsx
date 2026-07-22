import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  HelpCircle, ChevronDown, MessageCircle,
  Send, Plus, Headphones, Mail,
  FileText, CheckCircle2
} from 'lucide-react'
import { supportService } from '@/services/support'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'

export default function SupportPage() {
  const { isAuthenticated } = useAuth()
  const [openFaqId, setOpenFaqId] = useState<number | null>(null)
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketMessage, setTicketMessage] = useState('')

  const { data: faqs, isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: supportService.getFAQs,
  })

  const { data: tickets } = useQuery({
    queryKey: ['tickets'],
    queryFn: supportService.getTickets,
    enabled: isAuthenticated,
  })

  const ticketMutation = useMutation({
    mutationFn: () => supportService.createTicket({
      subject: ticketSubject,
      message: ticketMessage,
    }),
    onSuccess: () => {
      toast.success('Тикет создан! Мы ответим в ближайшее время.')
      setShowTicketForm(false)
      setTicketSubject('')
      setTicketMessage('')
    },
    onError: () => toast.error('Ошибка при создании тикета'),
  })

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-display-sm md:text-display-md font-bold">
              Поддержка
            </h1>
          </div>
          <p className="text-lg text-dark-500 dark:text-dark-400 max-w-2xl">
            Найди ответы на частые вопросы или свяжись с нашей командой поддержки
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="w-5 h-5 text-primary-500" />
                <h2 className="text-lg font-bold">Часто задаваемые вопросы</h2>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 dark:bg-dark-700 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : faqs && Object.keys(faqs).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(faqs).map(([category, faqList]) => (
                    <div key={category}>
                      <h3 className="text-sm font-semibold text-dark-500 uppercase tracking-wider mb-3 mt-6 first:mt-0">
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {(faqList as Array<{id: number; question: string; answer: string}>).map((faq) => (
                          <div key={faq.id} className="rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden">
                            <button
                              onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                            >
                              <span className="font-medium text-sm pr-4">{faq.question}</span>
                              <ChevronDown className={cn(
                                'w-4 h-4 text-dark-400 shrink-0 transition-transform',
                                openFaqId === faq.id && 'rotate-180'
                              )} />
                            </button>
                            <AnimatePresence>
                              {openFaqId === faq.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-4 pb-4 text-sm text-dark-500 dark:text-dark-400 leading-relaxed border-t border-gray-200 dark:border-dark-700 pt-3">
                                    {faq.answer}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-dark-500 py-8">FAQ пока не добавлены</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact card */}
            <div className="glass-card p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Не нашли ответ?</h3>
              <p className="text-sm text-dark-500 mb-4">
                Создайте тикет и наша команда поддержки ответит вам в течение 24 часов
              </p>
              <button
                onClick={() => setShowTicketForm(!showTicketForm)}
                className="btn-primary w-full text-sm group"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                Создать тикет
              </button>
            </div>

            {/* Ticket form */}
            <AnimatePresence>
              {showTicketForm && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass-card p-6"
                >
                  <h3 className="font-semibold mb-4">Новый тикет</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Тема</label>
                      <input
                        type="text"
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        className="input-field"
                        placeholder="Кратко опишите проблему"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Сообщение</label>
                      <textarea
                        value={ticketMessage}
                        onChange={(e) => setTicketMessage(e.target.value)}
                        className="input-field min-h-[120px] resize-none"
                        placeholder="Подробно опишите вашу проблему..."
                        rows={4}
                      />
                    </div>
                    <button
                      onClick={() => ticketMutation.mutate()}
                      disabled={!ticketSubject.trim() || !ticketMessage.trim() || ticketMutation.isPending}
                      className="btn-primary w-full text-sm"
                    >
                      {ticketMutation.isPending ? 'Отправка...' : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Отправить
                        </span>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* My tickets */}
            {isAuthenticated && tickets && tickets.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary-500" />
                  Мои тикеты
                </h3>
                <div className="space-y-2">
                  {tickets.slice(0, 5).map((ticket) => (
                    <div key={ticket.id} className="p-3 rounded-xl bg-gray-50 dark:bg-dark-800">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-sm font-medium line-clamp-1">{ticket.subject}</span>
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full font-medium',
                          ticket.status === 'open' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                          ticket.status === 'resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                          'bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-dark-300'
                        )}>
                          {ticket.status_display}
                        </span>
                      </div>
                      <p className="text-xs text-dark-400">{new Date(ticket.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
