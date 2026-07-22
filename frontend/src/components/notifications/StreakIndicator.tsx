import { motion } from 'framer-motion'
import { Flame, Zap, Trophy } from 'lucide-react'
import { cn } from '@/utils/cn'

interface StreakIndicatorProps {
  currentStreak: number
  longestStreak: number
  lastStudyDate: string | null
  className?: string
}

const streakMilestones = [
  { days: 3, label: 'Новичок', icon: '🔥' },
  { days: 7, label: 'Неделя', icon: '⭐', },
  { days: 14, label: 'Дисциплина', icon: '💪' },
  { days: 30, label: 'Месяц', icon: '🏆' },
  { days: 60, label: 'Эксперт', icon: '👑' },
  { days: 100, label: 'Легенда', icon: '💎' },
]

export default function StreakIndicator({
  currentStreak,
  longestStreak,
  lastStudyDate,
  className,
}: StreakIndicatorProps) {
  // Find next milestone
  const nextMilestone = streakMilestones.find((m) => m.days > currentStreak)
  const progressToNext = nextMilestone
    ? Math.min(100, (currentStreak / nextMilestone.days) * 100)
    : 100

  // Determine flame intensity
  const getFlameColor = () => {
    if (currentStreak >= 30) return 'text-orange-500 dark:text-orange-400'
    if (currentStreak >= 7) return 'text-amber-500 dark:text-amber-400'
    if (currentStreak >= 3) return 'text-yellow-500 dark:text-yellow-400'
    return 'text-gray-400 dark:text-gray-500'
  }

  const getFlameSize = () => {
    if (currentStreak >= 30) return 'w-8 h-8'
    if (currentStreak >= 7) return 'w-7 h-7'
    if (currentStreak >= 3) return 'w-6 h-6'
    return 'w-5 h-5'
  }

  return (
    <div className={cn('glass-card p-5', className)}>
      <div className="flex items-start gap-4">
        {/* Flame icon */}
        <motion.div
          animate={
            currentStreak > 0
              ? {
                  scale: [1, 1.1, 1],
                  transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                }
              : {}
          }
          className={cn(
            'w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shrink-0',
            currentStreak > 0
              ? 'from-orange-500 to-red-500 shadow-lg shadow-orange-500/25'
              : 'from-gray-300 to-gray-400 dark:from-dark-600 dark:to-dark-500'
          )}
        >
          <Flame className={cn('text-white', getFlameSize())} />
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold">{currentStreak}</span>
            <span className="text-sm text-dark-500">дней подряд</span>
          </div>

          {currentStreak > 0 && (
            <>
              {/* Progress to next milestone */}
              {nextMilestone && progressToNext < 100 && (
                <div className="mb-1.5">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-dark-400">
                      До «{nextMilestone.label}»: {nextMilestone.days - currentStreak} дней
                    </span>
                    <span className="text-dark-400">{Math.round(progressToNext)}%</span>
                  </div>
                  <div className="progress-bar h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToNext}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                    />
                  </div>
                </div>
              )}

              {progressToNext >= 100 && (
                <div className="flex items-center gap-1.5 text-xs text-accent-600 dark:text-accent-400 font-semibold">
                  <Trophy className="w-3.5 h-3.5" />
                  Максимальный уровень!
                </div>
              )}

              {/* Milestones */}
              <div className="flex items-center gap-1 mt-2">
                {streakMilestones.map((milestone) => {
                  const reached = currentStreak >= milestone.days
                  return (
                    <div
                      key={milestone.days}
                      className={cn(
                        'w-7 h-5 rounded-md flex items-center justify-center text-xs transition-all',
                        reached
                          ? 'bg-primary-100 dark:bg-primary-900/30 scale-110'
                          : 'bg-gray-100 dark:bg-dark-800 opacity-50'
                      )}
                      title={`${milestone.label} — ${milestone.days} дней`}
                    >
                      {milestone.icon}
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {currentStreak === 0 && (
            <p className="text-xs text-dark-400">
              Начни заниматься, чтобы зажечь огонь!
            </p>
          )}

          {longestStreak > currentStreak && (
            <p className="text-xs text-dark-400 mt-1">
              🏆 Рекорд: {longestStreak} дней
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
