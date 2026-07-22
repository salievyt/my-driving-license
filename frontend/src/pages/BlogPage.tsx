import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  FileText, Clock, Eye, ArrowRight,
  Calendar
} from 'lucide-react'
import { blogService } from '@/services/blog'
import type { Article } from '@/types'
import { formatDate, formatMinutes } from '@/utils/format'

export default function BlogPage() {
  const { data: articlesData, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => blogService.getArticles(),
  })

  const { data: categories } = useQuery({
    queryKey: ['article-categories'],
    queryFn: blogService.getCategories,
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
            Блог о ПДД
          </h1>
          <p className="text-lg text-dark-500 dark:text-dark-400 max-w-2xl">
            Полезные статьи, советы и новости из мира правил дорожного движения и обучения вождению.
          </p>
        </motion.div>

        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/blog?category=${cat.slug}`}
                className="px-4 py-2 rounded-xl text-sm font-medium glass-strong hover:bg-gray-100 dark:hover:bg-dark-700 whitespace-nowrap transition-colors"
              >
                {cat.icon && <span className="mr-1">{cat.icon}</span>}
                {cat.title}
              </Link>
            ))}
          </div>
        )}

        {/* Articles grid */}
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
            {articlesData?.results?.map((article: Article, i: number) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/blog/${article.slug}`}
                  className="block group glass-card overflow-hidden hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
                >
                  {article.cover_image && (
                    <div className="aspect-video bg-gray-100 dark:bg-dark-800 overflow-hidden">
                      <img
                        src={article.cover_image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="badge-primary text-xs">
                        {article.category.title}
                      </span>
                      <span className="text-xs text-dark-400">{formatDate(article.created_at)}</span>
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-dark-500 dark:text-dark-400 line-clamp-3 mb-4">
                      {article.summary}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-dark-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.reading_time_minutes} мин
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {article.views_count}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {articlesData?.results?.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-dark-300 mx-auto mb-4" />
            <p className="text-lg text-dark-500">Статьи пока не опубликованы</p>
          </div>
        )}
      </div>
    </div>
  )
}
