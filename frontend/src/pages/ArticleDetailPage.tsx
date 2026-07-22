import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  ArrowLeft, Clock, Eye, User,
  MessageCircle, Send
} from 'lucide-react'
import { blogService } from '@/services/blog'
import { useAuth } from '@/hooks/useAuth'
import { formatDate, formatMinutes } from '@/utils/format'

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const [commentText, setCommentText] = useState('')

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => blogService.getArticle(slug!),
    enabled: !!slug,
  })

  const { data: comments } = useQuery({
    queryKey: ['article-comments', slug],
    queryFn: () => blogService.getComments(slug!),
    enabled: !!slug,
  })

  const commentMutation = useMutation({
    mutationFn: (text: string) => blogService.addComment(slug!, text),
    onSuccess: () => {
      toast.success('Комментарий добавлен')
      setCommentText('')
      queryClient.invalidateQueries({ queryKey: ['article-comments', slug] })
    },
    onError: () => toast.error('Ошибка при добавлении комментария'),
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
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-dark-500">Статья не найдена</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-dark-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к блогу
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Cover image */}
          {article.cover_image && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-8 bg-gray-100 dark:bg-dark-800">
              <img
                src={article.cover_image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="badge-primary">{article.category.title}</span>
            <span className="flex items-center gap-1 text-sm text-dark-500">
              <User className="w-4 h-4" />
              {article.author_name}
            </span>
            <span className="flex items-center gap-1 text-sm text-dark-500">
              <Clock className="w-4 h-4" />
              {article.reading_time_minutes} мин чтения
            </span>
            <span className="flex items-center gap-1 text-sm text-dark-500">
              <Eye className="w-4 h-4" />
              {article.views_count}
            </span>
          </div>

          <h1 className="text-display-sm md:text-display-md font-bold mb-2">
            {article.title}
          </h1>
          <p className="text-dark-500 mb-4">{formatDate(article.created_at)}</p>

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none mt-8"
            dangerouslySetInnerHTML={{ __html: article.content || '' }}
          />

          {/* Comments */}
          <section className="mt-16 pt-8 border-t border-gray-200 dark:border-dark-700">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Комментарии
            </h2>

            {isAuthenticated && (
              <div className="flex gap-3 mb-8">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Написать комментарий..."
                  className="input-field flex-1"
                />
                <button
                  onClick={() => commentMutation.mutate(commentText)}
                  disabled={!commentText.trim() || commentMutation.isPending}
                  className="btn-primary !px-4"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}

            {comments?.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment: { id: number; author_name: string; text: string; created_at: string }) => (
                  <div key={comment.id} className="p-4 rounded-xl bg-gray-50 dark:bg-dark-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{comment.author_name}</span>
                      <span className="text-xs text-dark-400">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="text-sm text-dark-600 dark:text-dark-300">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-dark-500 py-8">Комментариев пока нет</p>
            )}
          </section>
        </motion.article>
      </div>
    </div>
  )
}
