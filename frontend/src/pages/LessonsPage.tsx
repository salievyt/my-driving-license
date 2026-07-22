import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  BookOpen, Clock, Filter, Search,
  ChevronRight, Lock
} from 'lucide-react'
import { lessonsService } from '@/services/lessons'
import type { Category, Lesson } from '@/types'
import { getDifficultyLabel, getDifficultyColor, formatMinutes } from '@/utils/format'

export default function LessonsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: lessonsService.getCategories,
  })

  const { data: lessonsData, isLoading } = useQuery({
    queryKey: ['lessons', selectedCategory],
    queryFn: () => lessonsService.getLessons(
      selectedCategory !== 'all' ? { category__slug: selectedCategory } : {}
    ),
  })

  const filteredLessons = lessonsData?.results?.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.summary.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-display-sm md:text-display-md font-bold mb-4">
            Уроки ПДД
          </h1>
          <p className="text-lg text-dark-500 dark:text-dark-400 max-w-2xl">
            Изучай правила дорожного движения по структурированным урокам.
            Все материалы актуальны на 2026 год.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск уроков..."
              className="input-field pl-12"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                : 'glass-strong hover:bg-gray-100 dark:hover:bg-dark-700'
            }`}
          >
            Все уроки
          </button>
          {categories?.map((category: Category) => (
            <button
              key={category.slug}
              onClick={() => setSelectedCategory(category.slug)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category.slug
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'glass-strong hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
              style={selectedCategory === category.slug ? {} : {
                borderLeftColor: category.color,
                borderLeftWidth: '3px',
              }}
            >
              {category.title}
            </button>
          ))}
        </div>

        {/* Lesson Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-3/4 mb-4" />
                <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons?.map((lesson: Lesson, i: number) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/lessons/${lesson.slug}`}
                  className="block group glass-card p-6 h-full hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0"
                      style={{ backgroundColor: lesson.category.color || '#6366f1' }}
                    >
                      {lesson.category.title[0]}
                    </div>
                    {lesson.is_premium && (
                      <div className="badge-warning shrink-0">
                        <Lock className="w-3 h-3" />
                        Премиум
                      </div>
                    )}
                  </div>

                  <h3 className="font-semibold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-dark-500 dark:text-dark-400 line-clamp-2 mb-4">
                    {lesson.summary}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-dark-400 mt-auto">
                    <span className={`flex items-center gap-1 ${getDifficultyColor(lesson.difficulty)}`}>
                      <BookOpen className="w-3.5 h-3.5" />
                      {getDifficultyLabel(lesson.difficulty)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatMinutes(lesson.duration_minutes)}
                    </span>
                    {lesson.is_completed && (
                      <span className="badge-success ml-auto">Пройдено</span>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {filteredLessons?.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-dark-300 mx-auto mb-4" />
            <p className="text-lg text-dark-500">Уроки не найдены</p>
            <p className="text-sm text-dark-400 mt-1">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>
    </div>
  )
}
