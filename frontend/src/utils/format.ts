import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns'
import { ru } from 'date-fns/locale'

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  if (isToday(d)) return 'Сегодня'
  if (isYesterday(d)) return 'Вчера'
  return format(d, 'dd.MM.yyyy', { locale: ru })
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'dd.MM.yyyy HH:mm', { locale: ru })
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: ru,
  })
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} мин`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours} ч ${mins} мин` : `${hours} ч`
}

export function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    beginner: 'Начальный',
    intermediate: 'Средний',
    advanced: 'Продвинутый',
    easy: 'Лёгкий',
    medium: 'Средний',
    hard: 'Сложный',
  }
  return labels[difficulty] || difficulty
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    beginner: 'text-green-600 dark:text-green-400',
    easy: 'text-green-600 dark:text-green-400',
    intermediate: 'text-amber-600 dark:text-amber-400',
    medium: 'text-amber-600 dark:text-amber-400',
    advanced: 'text-red-600 dark:text-red-400',
    hard: 'text-red-600 dark:text-red-400',
  }
  return colors[difficulty] || ''
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    open: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    in_progress: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    closed: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  }
  return colors[status] || ''
}
