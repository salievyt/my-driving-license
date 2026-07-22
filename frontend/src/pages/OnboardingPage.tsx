import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Sparkles, Target, Clock, ArrowRight,
  BookOpen, Brain, CheckCircle2, BarChart3,
  Zap, ChevronRight, GraduationCap
} from 'lucide-react'
import { onboardingService } from '@/services/onboarding'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'
import type { Question } from '@/types'

// Step 1 data types
interface OnboardingData {
  experience_level: 'beginner' | 'intermediate' | 'advanced'
  study_goal: 'exam' | 'full' | 'refresh'
  study_goal_minutes: number
}

// Diagnostic result type
interface DiagnosticResult {
  score: number
  max_score: number
  percentage: number
  is_passed: boolean
  results: Array<{
    question_id: number
    question_text: string
    selected_answer_ids: number[]
    correct_answer_ids: number[]
    is_correct: boolean
    explanation: string
  }>
  level: number
  experience_points: number
}

const experienceLevels = [
  {
    id: 'beginner' as const,
    title: 'Новичок',
    desc: 'Только начинаю изучать ПДД',
    icon: BookOpen,
    gradient: 'from-primary-500 to-primary-600',
  },
  {
    id: 'intermediate' as const,
    title: 'Средний',
    desc: 'Уже знаком с основными правилами',
    icon: GraduationCap,
    gradient: 'from-accent-500 to-emerald-600',
  },
  {
    id: 'advanced' as const,
    title: 'Продвинутый',
    desc: 'Уверенно знаю большую часть',
    icon: Zap,
    gradient: 'from-amber-500 to-orange-600',
  },
]

const studyGoals = [
  {
    id: 'exam' as const,
    title: 'Сдать экзамен',
    desc: 'Целенаправленная подготовка к экзамену в ГИБДД',
    icon: Target,
  },
  {
    id: 'full' as const,
    title: 'Полный курс',
    desc: 'Хочу изучить все темы с нуля до продвинутого уровня',
    icon: BookOpen,
  },
  {
    id: 'refresh' as const,
    title: 'Повторить',
    desc: 'Уже есть опыт, хочу освежить знания перед экзаменом',
    icon: Brain,
  },
]

const studyMinutes = [5, 10, 15, 20, 30, 45, 60]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // State
  const [step, setStep] = useState<1 | 2>(1)
  const [data, setData] = useState<OnboardingData>({
    experience_level: 'beginner',
    study_goal: 'exam',
    study_goal_minutes: 15,
  })

  // Diagnostic test state
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number[]>>({})
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<DiagnosticResult | null>(null)

  const currentQuestion = questions[currentQuestionIndex]
  const answeredCount = Object.keys(selectedAnswers).length
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  // Load diagnostic questions when entering step 2
  useEffect(() => {
    if (step === 2 && questions.length === 0) {
      loadQuestions()
    }
  }, [step])

  const loadQuestions = async () => {
    setIsLoadingQuestions(true)
    try {
      const res = await onboardingService.getDiagnosticQuestions(5)
      setQuestions(res.questions || [])
    } catch {
      toast.error('Ошибка загрузки вопросов')
    } finally {
      setIsLoadingQuestions(false)
    }
  }

  const handleAnswerSelect = (answerId: number) => {
    if (!currentQuestion) return
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

  const handleSubmitDiagnostic = async () => {
    setIsSubmitting(true)
    try {
      const res = await onboardingService.submitDiagnostic({
        answers: Object.fromEntries(
          Object.entries(selectedAnswers).map(([k, v]) => [k, v])
        ),
        experience_level: data.experience_level,
        study_goal: data.study_goal,
        study_goal_minutes: data.study_goal_minutes,
      })
      setResult(res)
    } catch {
      toast.error('Ошибка при отправке теста')
    } finally {
      setIsSubmitting(false)
    }
  }

  const finishOnboarding = () => {
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-20 -left-32 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-32 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300',
                step === s
                  ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-500/25 scale-110'
                  : result
                    ? 'bg-accent-500 text-white'
                    : step > s
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 dark:bg-dark-700 text-dark-400'
              )}>
                {result && s === 2 ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : step > s ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  s
                )}
              </div>
              <span className={cn(
                'text-sm font-medium hidden sm:block',
                step === s
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-dark-400'
              )}>
                {s === 1 ? 'Настройка' : 'Диагностика'}
              </span>
              {s < 2 && (
                <ChevronRight className="w-4 h-4 text-dark-300" />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Experience & Goal */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="glass-card p-8 md:p-10"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/25">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold mb-2">
                  Привет, {user?.first_name || 'будущий водитель'}! 👋
                </h1>
                <p className="text-dark-500 dark:text-dark-400">
                  Настрой обучение под себя — это займёт всего минуту
                </p>
              </div>

              {/* Experience Level */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-dark-500 uppercase tracking-wider mb-3">
                  Твой уровень подготовки
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {experienceLevels.map((level) => {
                    const isSelected = data.experience_level === level.id
                    const Icon = level.icon
                    return (
                      <button
                        key={level.id}
                        onClick={() => setData({ ...data, experience_level: level.id })}
                        className={cn(
                          'relative p-4 rounded-2xl border-2 text-left transition-all duration-200',
                          isSelected
                            ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/30 dark:to-primary-800/20 shadow-lg shadow-primary-500/10'
                            : 'border-gray-200 dark:border-dark-700 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-md'
                        )}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center shadow">
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                        <div className={cn(
                          'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3',
                          isSelected ? level.gradient : 'bg-gray-100 dark:bg-dark-700'
                        )}>
                          <Icon className={cn(
                            'w-5 h-5',
                            isSelected ? 'text-white' : 'text-dark-500'
                          )} />
                        </div>
                        <div className="text-sm font-semibold mb-0.5">{level.title}</div>
                        <div className="text-xs text-dark-500">{level.desc}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Study Goal */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-dark-500 uppercase tracking-wider mb-3">
                  Твоя цель
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {studyGoals.map((goal) => {
                    const isSelected = data.study_goal === goal.id
                    const Icon = goal.icon
                    return (
                      <button
                        key={goal.id}
                        onClick={() => setData({ ...data, study_goal: goal.id })}
                        className={cn(
                          'relative p-4 rounded-2xl border-2 text-left transition-all duration-200',
                          isSelected
                            ? 'border-accent-500 bg-gradient-to-br from-accent-50 to-accent-100/50 dark:from-accent-900/30 dark:to-accent-800/20 shadow-lg shadow-accent-500/10'
                            : 'border-gray-200 dark:border-dark-700 hover:border-accent-200 dark:hover:border-accent-800 hover:shadow-md'
                        )}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent-500 flex items-center justify-center shadow">
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                        <div className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center mb-3',
                          isSelected
                            ? 'bg-gradient-to-br from-accent-500 to-emerald-600'
                            : 'bg-gray-100 dark:bg-dark-700'
                        )}>
                          <Icon className={cn(
                            'w-5 h-5',
                            isSelected ? 'text-white' : 'text-dark-500'
                          )} />
                        </div>
                        <div className="text-sm font-semibold mb-0.5">{goal.title}</div>
                        <div className="text-xs text-dark-500">{goal.desc}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Daily minutes */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-dark-500 uppercase tracking-wider mb-3">
                  Сколько минут в день готов заниматься?
                </h3>
                <div className="flex flex-wrap gap-2">
                  {studyMinutes.map((m) => (
                    <button
                      key={m}
                      onClick={() => setData({ ...data, study_goal_minutes: m })}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                        data.study_goal_minutes === m
                          ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                          : 'glass-strong hover:bg-gray-100 dark:hover:bg-dark-700'
                      )}
                    >
                      {m} мин
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="btn-primary w-full group"
              >
                <span className="flex items-center gap-2">
                  Пройти диагностику
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </motion.div>
          )}

          {/* STEP 2: Diagnostic Test */}
          {step === 2 && !result && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {isLoadingQuestions ? (
                <div className="glass-card p-10 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Brain className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Подбираем вопросы...</h2>
                  <p className="text-dark-500">Сейчас мы оценим твой уровень знаний</p>
                </div>
              ) : questions.length > 0 && currentQuestion ? (
                <div className="space-y-4">
                  {/* Progress */}
                  <div className="glass-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Brain className="w-4 h-4 text-primary-500" />
                        <span className="font-medium">
                          Вопрос {currentQuestionIndex + 1} из {questions.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <BarChart3 className="w-4 h-4 text-accent-500" />
                        <span className="text-dark-500">
                          Отвечено: {answeredCount}/{questions.length}
                        </span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${((answeredCount) / questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentQuestion.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      className="glass-card p-6 md:p-8"
                    >
                      <h3 className="text-lg font-semibold mb-6">{currentQuestion.text}</h3>

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
                                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md'
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

                      {/* Navigation */}
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-dark-700">
                        <button
                          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                          disabled={currentQuestionIndex === 0}
                          className="btn-ghost disabled:opacity-30"
                        >
                          Назад
                        </button>

                        {isLastQuestion ? (
                          <button
                            onClick={handleSubmitDiagnostic}
                            disabled={isSubmitting || answeredCount === 0}
                            className="btn-primary group"
                          >
                            {isSubmitting ? (
                              <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Анализируем...
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                Завершить
                                <CheckCircle2 className="w-4 h-4" />
                              </span>
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={goToNextQuestion}
                            disabled={!selectedAnswers[currentQuestion.id]?.length}
                            className="btn-primary group"
                          >
                            <span className="flex items-center gap-2">
                              Далее
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : (
                <div className="glass-card p-10 text-center">
                  <p className="text-dark-500">Нет доступных вопросов для диагностики</p>
                  <button onClick={finishOnboarding} className="btn-primary mt-4">
                    Перейти к обучению
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* RESULTS */}
          {result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="glass-card p-8 md:p-10"
            >
              <div className="text-center mb-8">
                <div className={cn(
                  'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl',
                  result.is_passed
                    ? 'bg-gradient-to-br from-accent-500 to-emerald-600'
                    : 'bg-gradient-to-br from-amber-500 to-orange-600'
                )}>
                  {result.is_passed ? (
                    <Sparkles className="w-10 h-10 text-white" />
                  ) : (
                    <Target className="w-10 h-10 text-white" />
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {result.is_passed
                    ? 'Отличный результат! 🎉'
                    : 'Хорошая отправная точка! 💪'}
                </h2>
                <p className="text-dark-500">
                  {result.is_passed
                    ? 'Ты уже хорошо знаешь ПДД. Пройди полный тест для закрепления.'
                    : 'Мы нашли темы, над которыми стоит поработать. Не волнуйся, мы поможем!'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-center">
                  <div className="text-3xl font-bold gradient-text">{result.percentage}%</div>
                  <div className="text-xs text-dark-500 mt-1">Точность</div>
                </div>
                <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">{result.score}</div>
                  <div className="text-xs text-dark-500 mt-1">Верно</div>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-center">
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{result.max_score - result.score}</div>
                  <div className="text-xs text-dark-500 mt-1">На доработку</div>
                </div>
              </div>

              {/* Results breakdown */}
              <div className="space-y-3 mb-8">
                {result.results.map((r) => (
                  <div
                    key={r.question_id}
                    className={cn(
                      'p-4 rounded-2xl border',
                      r.is_correct
                        ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10'
                        : 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                        r.is_correct
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      )}>
                        {r.is_correct
                          ? <CheckCircle2 className="w-4 h-4 text-white" />
                          : <span className="text-white text-sm font-bold">✕</span>
                        }
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{r.question_text}</p>
                        {!r.is_correct && r.explanation && (
                          <p className="text-xs text-dark-500 mt-1 leading-relaxed">
                            {r.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="glass-strong rounded-2xl p-5 mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-primary-500" />
                  <span className="font-semibold">Твой план обучения</span>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent-500 shrink-0" />
                    <span>Цель: <strong>
                      {data.study_goal === 'exam' ? 'Сдать экзамен' :
                       data.study_goal === 'full' ? 'Полный курс' : 'Повторение'}
                    </strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent-500 shrink-0" />
                    <span>Уровень: <strong>
                      {data.experience_level === 'beginner' ? 'Новичок' :
                       data.experience_level === 'intermediate' ? 'Средний' : 'Продвинутый'}
                    </strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent-500 shrink-0" />
                    <span>Ежедневно: <strong>{data.study_goal_minutes} минут</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent-500 shrink-0" />
                    <span>Получено опыта: <strong>+{result.experience_points} XP</strong></span>
                  </li>
                </ul>
              </div>

              <button
                onClick={finishOnboarding}
                className="btn-primary w-full group"
              >
                <span className="flex items-center gap-2">
                  Начать обучение
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
