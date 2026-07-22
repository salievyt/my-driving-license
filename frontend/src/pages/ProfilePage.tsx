import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  User, Settings, Award, BadgeCheck,
  Mail, Phone, Calendar, Camera,
  Save, BarChart3, Target, Star
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/auth'
import { progressService } from '@/services/progress'
import { formatDate } from '@/utils/format'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState(user?.first_name || '')
  const [lastName, setLastName] = useState(user?.last_name || '')
  const [phone, setPhone] = useState(user?.phone || '')

  const { data: achievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: progressService.getAchievements,
  })

  const { data: badges } = useQuery({
    queryKey: ['badges'],
    queryFn: authService.getBadges,
  })

  const handleSave = async () => {
    try {
      await updateUser({
        first_name: firstName,
        last_name: lastName,
        phone,
      })
      toast.success('Профиль обновлён')
      setIsEditing(false)
    } catch {
      toast.error('Ошибка при обновлении профиля')
    }
  }

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Profile Header */}
          <div className="glass-card p-8 md:p-10 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                  {user?.first_name?.[0] || user?.username[0]}
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-white dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                  <Camera className="w-4 h-4 text-dark-500" />
                </button>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">
                      {user?.first_name} {user?.last_name}
                    </h1>
                    <p className="text-dark-500">
                      @{user?.username}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="btn-ghost"
                  >
                    <Settings className="w-4 h-4" />
                    {isEditing ? 'Отмена' : 'Редактировать'}
                  </button>
                </div>

                <div className="flex flex-wrap gap-4 mt-4 text-sm text-dark-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Зарегистрирован {formatDate(user?.date_joined || '')}
                  </span>
                </div>

                {user?.profile && (
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1 text-sm">
                      <BarChart3 className="w-4 h-4 text-primary-500" />
                      <span className="font-semibold">{user.profile.level}</span>
                      <span className="text-dark-400">уровень</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Target className="w-4 h-4 text-accent-500" />
                      <span className="font-semibold">{user.profile.accuracy}%</span>
                      <span className="text-dark-400">точность</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="font-semibold">{user.profile.streak_days}</span>
                      <span className="text-dark-400">дней подряд</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Edit form */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-700"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Имя</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Фамилия</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Телефон</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-field"
                      placeholder="+7 (___) ___-__-__"
                    />
                  </div>
                </div>
                <button onClick={handleSave} className="btn-primary mt-4">
                  <Save className="w-4 h-4" />
                  Сохранить изменения
                </button>
              </motion.div>
            )}
          </div>

          {/* Badges & Achievements */}
          <div className="glass-card p-6 md:p-8 mb-8">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Достижения и бейджи
            </h2>

            {badges?.length > 0 || achievements?.achievements?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {(badges || achievements?.badges || []).map((badge: { id: number; name: string; description: string; icon: string; earned_at: string }) => (
                  <div key={badge.id} className="p-4 rounded-xl bg-gray-50 dark:bg-dark-800 text-center group hover:shadow-md transition-shadow">
                    <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform inline-block">
                      {badge.icon || '🏆'}
                    </span>
                    <span className="text-xs font-medium block leading-tight">{badge.name}</span>
                    <span className="text-[10px] text-dark-400 block mt-1">
                      {badge.description}
                    </span>
                  </div>
                ))}
                {(achievements?.achievements || []).map((achievement: { id: number; title: string; description: string; icon: string; earned_at: string }) => (
                  <div key={achievement.id} className="p-4 rounded-xl bg-gray-50 dark:bg-dark-800 text-center group hover:shadow-md transition-shadow">
                    <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform inline-block">
                      {achievement.icon || '🏆'}
                    </span>
                    <span className="text-xs font-medium block leading-tight">{achievement.title}</span>
                    <span className="text-[10px] text-dark-400 block mt-1">
                      {formatDate(achievement.earned_at)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BadgeCheck className="w-12 h-12 text-dark-300 mx-auto mb-2" />
                <p className="text-dark-500">Проходи тесты и уроки чтобы получать достижения</p>
              </div>
            )}
          </div>

          {/* Stats */}
          {user?.profile && (
            <div className="glass-card p-6 md:p-8">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-500" />
                Статистика
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                  <div className="text-xl font-bold gradient-text">{user.profile.total_tests_completed}</div>
                  <div className="text-xs text-dark-500 mt-1">Тестов пройдено</div>
                </div>
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">{user.profile.total_correct_answers}</div>
                  <div className="text-xs text-dark-500 mt-1">Верных ответов</div>
                </div>
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20">
                  <div className="text-xl font-bold text-red-600 dark:text-red-400">{user.profile.total_incorrect_answers}</div>
                  <div className="text-xs text-dark-500 mt-1">Ошибок</div>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                  <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{user.profile.accuracy}%</div>
                  <div className="text-xs text-dark-500 mt-1">Точность</div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
