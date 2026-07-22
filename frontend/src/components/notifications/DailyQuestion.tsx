import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, CheckCircle2, XCircle, Sparkles, Zap, ArrowRight } from 'lucide-react'
import { onboardingService } from '@/services/onboarding'
import type { Question } from '@/types'
import { cn } from '@/utils/cn'

interface DailyQuestionData {
  question: Question | null
  already_answered: boolean
  date: string
}

export default function DailyQuestion() {
  const [data, setData] = useState<DailyQuestionData | null>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [result, setResult] = useState<{
    is_correct: boolean
    correct_answer_ids: number[]
    explanation: string
    xp_earned: number
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDailyQuestion()
  }, [])

  const loadDailyQuestion = async () => {
    setIsLoading(true)
    try {
      const res = await onboardingService.getDailyQuestion()
      setData(res)
    } catch {
      // Silent fail
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswer = (answerId: number) => {
    if (result) return
    setSelectedIds((prev) =>
      prev.includes(answerId)
        ? prev.filter((id) => id !== answerId)
        : [...prev, answerId]
    )
  }

  const handleSubmit = async () => {
    if (!data?.question || selectedIds.length === 0 || isSubmitting) return
    setIsSubmitting(true)

    try {
      const res = await onboardingService.answerDailyQuestion(
        data.question.id,
        selectedIds
      )
      setResult(res)
    } catch {
      // Silent fail
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="glass-card p-5 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/3 mb-4" />
        <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-1/2" />
      </div>
    )
  }

  if (!data?.question) {
    return (
      <div className="glass-card p-5 text-center">
        <Brain className="w-8 h-8 text-dark-300 mx-auto mb-2" />
        <p className="text-sm text-dark-500">Вопрос дня скоро появится</p>
      </div>
    )
  }

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5"
      >
        <div className="flex items-start gap-3 mb-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
            result.is_correct
              ? 'bg-green-100 dark:bg-green-900/30'
              : 'bg-red-100 dark:bg-red-900/30'
          )}>
            {result.is_correct
              ? <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              : <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            }
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">
              {result.is_correct ? 'Верно! 🎉' : 'Неверно'}
            </h4>
            <p className="text-xs text-dark-500 mt-1">
              {result.explanation || 'Без объяснения'}
            </p>
            <p className="text-xs text-accent-600 dark:text-accent-400 mt-2 font-semibold">
              +{result.xp_earned} XP
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  if (data.already_answered) {
    return (
      <div className="glass-card p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold">Вопрос дня пройден!</p>
            <p className="text-xs text-dark-500">Возвращайся завтра за новым вопросом</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
          <Brain className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <h4 className="text-sm font-semibold">Вопрос дня</h4>
          <p className="text-xs text-dark-400">Ответь и получи +20 XP</p>
        </div>
      </div>

      {/* Question */}
      <p className="text-sm font-medium mb-3">{data.question.text}</p>

      {/* Answers */}
      <div className="space-y-2 mb-4">
        {data.question.answers.map((answer) => (
          <button
            key={answer.id}
            onClick={() => handleAnswer(answer.id)}
            className={cn(
              'w-full text-left p-3 rounded-xl border text-sm transition-all',
              selectedIds.includes(answer.id)
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm'
                : 'border-gray-200 dark:border-dark-700 hover:border-emerald-300 dark:hover:border-emerald-700'
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all',
                selectedIds.includes(answer.id)
                  ? 'border-emerald-500 bg-emerald-500'
                  : 'border-gray-300 dark:border-dark-500'
              )}>
                {selectedIds.includes(answer.id) && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                )}
              </div>
              <span>{answer.text}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={selectedIds.length === 0 || isSubmitting}
        className="w-full btn-primary !py-2.5 text-sm group"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Проверяем...
          </span>
        ) : (
          <span className="flex items-center gap-2 justify-center">
            Ответить
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        )}
      </button>
    </motion.div>
  )
}
