import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, CheckCheck, Clock, Sparkles, Flame, Award, Brain, Calendar, ChevronRight } from 'lucide-react'
import { notificationsService } from '@/services/notifications'
import type { Notification } from '@/types'
import { cn } from '@/utils/cn'

const notificationIcons: Record<string, typeof Bell> = {
  reminder: Clock,
  achievement: Award,
  streak: Flame,
  daily_question: Brain,
  milestone: Sparkles,
  weekly: Calendar,
  system: Bell,
  tip: Sparkles,
}

const notificationColors: Record<string, string> = {
  reminder: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  achievement: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  streak: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  daily_question: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  milestone: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  weekly: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  system: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  tip: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadNotifications()

    // Auto-refresh every 60 seconds
    const interval = setInterval(loadNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  const loadNotifications = async () => {
    try {
      const data = await notificationsService.getNotifications()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unread_count || 0)
    } catch {
      // Silent fail
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationsService.markRead()
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      )
      setUnreadCount(0)
    } catch {
      // Silent fail
    }
  }

  const handleMarkRead = async (id: number) => {
    try {
      await notificationsService.markRead([id])
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      )
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch {
      // Silent fail
    }
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative btn-ghost p-2.5 rounded-xl"
        aria-label="Уведомления"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-red-500/30"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 glass-strong rounded-2xl shadow-xl border border-gray-200/50 dark:border-dark-700/50 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-dark-700">
              <h3 className="font-semibold text-sm">Уведомления</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Прочитать всё
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : notifications.length > 0 ? (
                notifications.slice(0, 20).map((notification) => {
                  const Icon = notificationIcons[notification.notification_type] || Bell
                  const colorClass = notificationColors[notification.notification_type] || 'bg-gray-100'
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        'flex items-start gap-3 p-4 border-b border-gray-50 dark:border-dark-800 transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-800/50',
                        !notification.is_read && 'bg-primary-50/50 dark:bg-primary-900/10'
                      )}
                      onClick={() => handleMarkRead(notification.id)}
                    >
                      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', colorClass)}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'text-sm leading-snug',
                          !notification.is_read && 'font-semibold'
                        )}>
                          {notification.title}
                        </p>
                        {notification.message && (
                          <p className="text-xs text-dark-500 dark:text-dark-400 mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                        )}
                        <p className="text-[10px] text-dark-400 mt-1">
                          {notification.time_ago}
                        </p>
                      </div>
                      {notification.link && (
                        <ChevronRight className="w-4 h-4 text-dark-300 shrink-0 mt-2" />
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="p-8 text-center">
                  <Bell className="w-10 h-10 text-dark-300 mx-auto mb-2" />
                  <p className="text-sm text-dark-500 dark:text-dark-400">Нет уведомлений</p>
                  <p className="text-xs text-dark-400 mt-1">Мы уведомим тебя о важном</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <Link
              to="/profile"
              className="block p-3 text-center text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-dark-800 border-t border-gray-100 dark:border-dark-700"
              onClick={() => setIsOpen(false)}
            >
              Настроить уведомления
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
