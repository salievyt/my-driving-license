import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft, Clock, BookOpen, BarChart3,
  CheckCircle2, Play, Lock
} from 'lucide-react'
import { lessonsService } from '@/services/lessons'
import { getDifficultyLabel, getDifficultyColor, formatMinutes } from '@/utils/format'
import { cn } from '@/utils/cn'

export default function LessonDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', slug],
    queryFn: () => lessonsService.getLesson(slug!),
    enabled: !!slug,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-dark-700 rounded w-1/3 mb-8" />
          <div className="h-64 bg-gray-200 dark:bg-dark-700 rounded-2xl mb-8" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-5/6" />
            <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-4/6" />
          </div>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-dark-500">Урок не найден</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          to="/lessons"
          className="inline-flex items-center gap-2 text-sm font-medium text-dark-500 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к урокам
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0"
                style={{ backgroundColor: lesson.category.color || '#6366f1' }}
              >
                {lesson.category.title[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-dark-500">{lesson.category.title}</span>
                  <span className="text-dark-300">•</span>
                  <span className={cn('text-sm font-medium', getDifficultyColor(lesson.difficulty))}>
                    {getDifficultyLabel(lesson.difficulty)}
                  </span>
                </div>
                <h1 className="text-display-sm md:text-display-md font-bold">{lesson.title}</h1>
              </div>
              {lesson.is_premium && (
                <div className="badge-warning"><Lock className="w-3 h-3" /> Премиум</div>
              )}
            </div>

            <p className="text-lg text-dark-500 dark:text-dark-400 leading-relaxed">
              {lesson.summary}
            </p>

            {/* Meta info */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-dark-500">
                <Clock className="w-4 h-4" />
                {formatMinutes(lesson.duration_minutes)}
              </div>
              <div className="flex items-center gap-2 text-sm text-dark-500">
                <BarChart3 className="w-4 h-4" />
                {lesson.views_count} просмотров
              </div>
              {lesson.user_progress?.is_completed && (
                <div className="badge-success">
                  <CheckCircle2 className="w-3 h-3" />
                  Пройдено
                </div>
              )}
            </div>
          </div>

          {/* Video (if available) */}
          {lesson.video_url && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-10 bg-dark-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all group">
                  <Play className="w-6 h-6 text-white ml-1 group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: lesson.content || '' }}
          />

          {/* Actions */}
          <div className="mt-12 p-6 rounded-2xl glass-strong">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-semibold">Урок завершён?</h3>
                <p className="text-sm text-dark-500">Отметь урок как пройденный и следи за своим прогрессом</p>
              </div>
              <button className="btn-primary" onClick={() => {
                lessonsService.updateProgress(lesson.slug, {
                  is_completed: true,
                  time_spent_minutes: lesson.duration_minutes
                })
              }}>
                <CheckCircle2 className="w-4 h-4" />
                Отметить как пройденный
              </button>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  )
}
