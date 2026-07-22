import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  BarChart3, BookOpen, Brain, Clock,
  TrendingUp, Award, Target, Zap,
  Flame, Star, ArrowRight, CheckCircle2
} from 'lucide-react'
import { progressService } from '@/services/progress'
import { useAuth } from '@/hooks/useAuth'
import { formatDate, formatMinutes } from '@/utils/format'
import { cn } from '@/utils/cn'
import DailyQuestion from '@/components/notifications/DailyQuestion'
import StreakIndicator from '@/components/notifications/StreakIndicator'

export default function DashboardPage() {
  const { user } = useAuth()

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: progressService.getDashboard,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-dark-700 rounded w-1/4 mb-8" />
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-6 h-24" />
            ))}
          </div>
          <div className="h-64 bg-gray-200 dark:bg-dark-700 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-display-sm md:text-display-md font-bold mb-2">
            Привет, {user?.first_name || user?.username}!
          </h1>
          <p className="text-lg text-dark-500">
            Вот твой прогресс обучения. Продолжай в том же духе!
          </p>
        </motion.div>

        {/* Level & XP Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 md:p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-xl shrink-0">
              <span className="text-3xl font-bold text-white">{dashboard?.level || 0}</span>
            </div>
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-lg font-bold">{dashboard?.level || 0} уровень</span>
                  <span className="text-dark-400 ml-2">
                    ({dashboard?.experience_points || 0} / {dashboard?.next_level_xp || 1000} XP)
                  </span>
                </div>
                <span className="text-sm font-medium text-accent-600 dark:text-accent-400">
                  +{dashboard?.accuracy || 0}% точность
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${((dashboard?.experience_points || 0) / (dashboard?.next_level_xp || 1000)) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Тестов пройдено',
              value: dashboard?.overall_progress.total_quizzes_attempted || 0,
              icon: Brain,
              color: 'from-primary-500 to-primary-600',
              bg: 'bg-primary-50 dark:bg-primary-900/20',
            },
            {
              label: 'Серия дней',
              value: dashboard?.overall_progress.current_streak || 0,
              icon: Flame,
              color: 'from-orange-500 to-red-500',
              bg: 'bg-orange-50 dark:bg-orange-900/20',
            },
            {
              label: 'Уроков пройдено',
              value: dashboard?.overall_progress.total_lessons_completed || 0,
              icon: BookOpen,
              color: 'from-blue-500 to-blue-600',
              bg: 'bg-blue-50 dark:bg-blue-900/20',
            },
            {
              label: 'Часов обучения',
              value: formatMinutes(Math.round((dashboard?.overall_progress.study_hours_total || 0) * 60)),
              icon: Clock,
              color: 'from-purple-500 to-purple-600',
              bg: 'bg-purple-50 dark:bg-purple-900/20',
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-dark-500 mt-1">{stat.label}</p>
                </div>
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.bg)}>
                  <stat.icon className={cn('w-5 h-5 bg-gradient-to-br bg-clip-text text-transparent', stat.color)} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Retention row — Streak + Daily Question */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <StreakIndicator
              currentStreak={dashboard?.overall_progress.current_streak || 0}
              longestStreak={dashboard?.overall_progress.longest_streak || 0}
              lastStudyDate={dashboard?.overall_progress.last_study_date ?? null}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <DailyQuestion />
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Weak Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-bold">Слабые темы</h2>
              </div>
              {dashboard?.weak_topics?.length ? (
                <div className="space-y-4">
                  {dashboard.weak_topics.map((topic) => (
                    <div key={topic.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{topic.category_name}</span>
                        <span className="text-sm text-red-500 font-medium">{topic.weakness_percentage}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${topic.weakness_percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-accent-500 mx-auto mb-2" />
                  <p className="text-dark-500">Слабых тем пока нет</p>
                </div>
              )}
              <Link to="/lessons" className="btn-ghost w-full mt-4 justify-center text-sm">
                Изучать уроки
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold">Достижения</h2>
              </div>
              {dashboard?.achievements?.length ? (
                <div className="grid grid-cols-2 gap-3">
                  {dashboard.achievements.slice(0, 6).map((achievement) => (
                    <div key={achievement.id} className="p-3 rounded-xl bg-gray-50 dark:bg-dark-800 text-center">
                      <span className="text-2xl block mb-1">{achievement.icon}</span>
                      <span className="text-xs font-medium block leading-tight">{achievement.title}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-dark-300 mx-auto mb-2" />
                  <p className="text-dark-500">Пройди тесты чтобы получить достижения</p>
                </div>
              )}
              <Link to="/profile" className="btn-ghost w-full mt-4 justify-center text-sm">
                Все достижения
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Recent Sessions */}
        {dashboard?.recent_sessions && dashboard.recent_sessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                <h2 className="text-lg font-bold">Недавние сессии</h2>
              </div>
              <div className="space-y-3">
                {dashboard.recent_sessions.slice(0, 5).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{formatDate(session.date)}</p>
                        <p className="text-xs text-dark-500">
                          {session.lessons_completed > 0 && `${session.lessons_completed} уроков `}
                          {session.quizzes_completed > 0 && `${session.quizzes_completed} тестов`}
                          {' · '}{session.duration_minutes} мин
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-accent-600 dark:text-accent-400">
                      +{session.points_earned} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
