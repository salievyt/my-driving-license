import { useState, useCallback, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  Brain, Clock, ArrowLeft, ArrowRight,
  CheckCircle2, XCircle, AlertCircle,
  BarChart3, RotateCcw, Trophy
} from 'lucide-react'
import { quizzesService } from '@/services/quizzes'
import type { Question, QuizAttempt } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { formatSeconds } from '@/utils/format'
import { cn } from '@/utils/cn'

export default function QuizDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', slug],
    queryFn: () => quizzesService.getQuiz(slug!),
    enabled: !!slug,
  })

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number[]>>({})
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [isStarted, setIsStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [result, setResult] = useState<QuizAttempt | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const questions = quiz?.questions || []
  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  // Timer
  useEffect(() => {
    if (!isStarted || !quiz || result) return
    if (!timeLeft) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isStarted, quiz, result])

  const startQuiz = async () => {
    if (!isAuthenticated) {
      toast.error('Необходимо авторизоваться')
      navigate('/login')
      return
    }

    try {
      const data = await quizzesService.startQuiz(slug!)
      setAttemptId(data.attempt_id)
      setIsStarted(true)
      setTimeLeft((quiz?.time_limit_minutes || 20) * 60)
      setShowResults(false)
    } catch {
      toast.error('Ошибка при запуске теста')
    }
  }

  const handleAnswerSelect = (answerId: number) => {
    setSelectedAnswers((prev) => {
      const current = prev[currentQuestion.id] || []
      if (current.includes(answerId)) {
        return {
          ...prev,
          [currentQuestion.id]: current.filter((id) => id !== answerId),
        }
      }
      return {
        ...prev,
        [currentQuestion.id]: [...current, answerId],
      }
    })
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = useCallback(async () => {
    if (!attemptId || !quiz || isSubmitting) return
    setIsSubmitting(true)

    try {
      const timeSpent = (quiz.time_limit_minutes * 60) - timeLeft
      const data = await quizzesService.submitQuiz(quiz.slug, {
        attempt_id: attemptId,
        answers: Object.fromEntries(
          Object.entries(selectedAnswers).map(([k, v]) => [k, v])
        ),
        time_spent_seconds: Math.max(timeSpent, 0),
      })
      setResult(data)
      setShowResults(true)
      setIsStarted(false)
    } catch {
      toast.error('Ошибка при отправке теста')
    } finally {
      setIsSubmitting(false)
    }
  }, [attemptId, quiz, selectedAnswers, timeLeft])

  const answeredCount = Object.keys(selectedAnswers).length

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-dark-700 rounded w-1/3 mb-8" />
          <div className="h-96 bg-gray-200 dark:bg-dark-700 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-dark-500">Тест не найден</p>
      </div>
    )
  }

  // Results view
  if (showResults && result) {
    return (
      <div className="min-h-screen py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-10 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-6 shadow-xl">
              {result.is_passed ? (
                <Trophy className="w-10 h-10 text-white" />
              ) : (
                <AlertCircle className="w-10 h-10 text-white" />
              )}
            </div>

            <h2 className="text-2xl font-bold mb-2">
              {result.is_passed ? 'Поздравляем! Тест сдан!' : 'Попробуй ещё раз'}
            </h2>
            <p className="text-dark-500 mb-8">
              {result.is_passed
                ? 'Отличный результат! Ты готов к экзамену.'
                : 'Не расстраивайся, проанализируй ошибки и попробуй снова.'}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                <div className="text-2xl font-bold gradient-text">
                  {result.percentage}%
                </div>
                <div className="text-xs text-dark-500 mt-1">Результат</div>
              </div>
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {result.score}
                </div>
                <div className="text-xs text-dark-500 mt-1">Верно</div>
              </div>
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {result.max_score - result.score}
                </div>
                <div className="text-xs text-dark-500 mt-1">Ошибки</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={startQuiz} className="btn-primary">
                <RotateCcw className="w-4 h-4" />
                Пройти ещё раз
              </button>
              <Link to="/quizzes" className="btn-secondary">
                Другие тесты
              </Link>
              <Link to="/dashboard" className="btn-secondary">
                <BarChart3 className="w-4 h-4" />
                Статистика
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/quizzes"
            className="inline-flex items-center gap-2 text-sm font-medium text-dark-500 hover:text-primary-600 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к тестам
          </Link>
          <h1 className="text-display-sm font-bold">{quiz.title}</h1>
        </div>

        {/* Not started - intro card */}
        {!isStarted && !result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 md:p-10 text-center max-w-lg mx-auto"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">{quiz.title}</h2>
            <p className="text-dark-500 mb-6">{quiz.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-800">
                <div className="text-lg font-bold">{quiz.questions_count}</div>
                <div className="text-xs text-dark-500">Вопросов</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-800">
                <div className="text-lg font-bold">{quiz.time_limit_minutes} мин</div>
                <div className="text-xs text-dark-500">Лимит времени</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-800">
                <div className="text-lg font-bold">{quiz.passing_score}%</div>
                <div className="text-xs text-dark-500">Проходной</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-800">
                <div className="text-lg font-bold">{quiz.attempts_count}</div>
                <div className="text-xs text-dark-500">Попыток</div>
              </div>
            </div>

            <button onClick={startQuiz} className="btn-primary w-full group">
              Начать тест
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {/* Quiz in progress */}
        {isStarted && currentQuestion && (
          <div className="space-y-6">
            {/* Progress bar & timer */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Brain className="w-4 h-4 text-primary-500" />
                  <span className="font-medium">
                    Вопрос {currentQuestionIndex + 1} из {questions.length}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-dark-500">
                    Отвечено: {answeredCount}/{questions.length}
                  </span>
                  {timeLeft > 0 && (
                    <span className={cn(
                      'flex items-center gap-1 font-mono font-medium',
                      timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-dark-600'
                    )}>
                      <Clock className="w-4 h-4" />
                      {formatSeconds(timeLeft)}
                    </span>
                  )}
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-8"
              >
                <div className="mb-2">
                  <span className={cn(
                    'badge',
                    currentQuestion.difficulty === 'easy' ? 'badge-success' :
                    currentQuestion.difficulty === 'hard' ? 'badge-danger' : 'badge-warning'
                  )}>
                    {currentQuestion.difficulty === 'easy' ? 'Лёгкий' :
                     currentQuestion.difficulty === 'hard' ? 'Сложный' : 'Средний'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-6">{currentQuestion.text}</h3>

                {/* Answers */}
                <div className="space-y-3">
                  {currentQuestion.answers.map((answer) => {
                    const isSelected = selectedAnswers[currentQuestion.id]?.includes(answer.id) || false
                    return (
                      <button
                        key={answer.id}
                        onClick={() => handleAnswerSelect(answer.id)}
                        className={cn(
                          'w-full text-left p-4 rounded-xl border-2 transition-all duration-200',
                          isSelected
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-700'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all',
                            isSelected
                              ? 'border-primary-500 bg-primary-500'
                              : 'border-gray-300 dark:border-dark-500'
                          )}>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </div>
                          <span className="font-medium">{answer.text}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={goToPrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="btn-ghost disabled:opacity-30"
              >
                <ArrowLeft className="w-4 h-4" />
                Назад
              </button>

              <div className="flex gap-3">
                {isLastQuestion ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="btn-primary"
                  >
                    {isSubmitting ? 'Отправка...' : 'Завершить тест'}
                  </button>
                ) : (
                  <button
                    onClick={goToNextQuestion}
                    className="btn-primary"
                    disabled={!selectedAnswers[currentQuestion.id]?.length}
                  >
                    Далее
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
