import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  Brain, Clock, Target, ChevronRight,
  Star, Lock, Filter, Search
} from 'lucide-react'
import { quizzesService } from '@/services/quizzes'
import type { Quiz } from '@/types'

export default function QuizzesPage() {
  const { data: quizzesData, isLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => quizzesService.getQuizzes(),
  })

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-display-sm md:text-display-md font-bold mb-4">
            Тесты ПДД
          </h1>
          <p className="text-lg text-dark-500 dark:text-dark-400 max-w-2xl">
            Проверь свои знания в формате реального экзамена.
            Мгновенная проверка и подробный разбор каждого вопроса.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-5 bg-gray-200 dark:bg-dark-700 rounded w-2/3 mb-4" />
                <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {quizzesData?.results?.map((quiz: Quiz, i: number) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/quizzes/${quiz.slug}`}
                  className="block group glass-card p-6 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/25">
                      <Brain className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {quiz.title}
                        </h3>
                        {quiz.is_premium && (
                          <div className="badge-warning shrink-0"><Lock className="w-3 h-3" /> Премиум</div>
                        )}
                      </div>
                      <p className="text-sm text-dark-500 dark:text-dark-400 line-clamp-2 mb-4">
                        {quiz.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-dark-400">
                        <span className="flex items-center gap-1">
                          <Target className="w-3.5 h-3.5" />
                          {quiz.questions_count} вопросов
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {quiz.time_limit_minutes} мин
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5" />
                          Проходной {quiz.passing_score}%
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-dark-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all shrink-0 mt-2" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {quizzesData?.results?.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <Brain className="w-16 h-16 text-dark-300 mx-auto mb-4" />
            <p className="text-lg text-dark-500">Тесты не найдены</p>
          </div>
        )}
      </div>
    </div>
  )
}
