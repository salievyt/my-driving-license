import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { UserPlus, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface RegisterForm {
  username: string
  email: string
  first_name: string
  last_name: string
  password: string
  password_confirm: string
}

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>()

  const password = watch('password')

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      await registerUser(data)
      toast.success('Регистрация успешна!')
      navigate('/onboarding')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Ошибка регистрации'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 relative">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-20 -right-32 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -left-32 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="glass-card p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Создать аккаунт</h1>
            <p className="text-dark-500 dark:text-dark-400 mt-2">
              Начни подготовку к экзамену уже сегодня
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Имя</label>
                <input
                  {...register('first_name', { required: 'Обязательное поле' })}
                  className={`input-field ${errors.first_name ? 'input-error' : ''}`}
                  placeholder="Иван"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Фамилия</label>
                <input
                  {...register('last_name', { required: 'Обязательное поле' })}
                  className={`input-field ${errors.last_name ? 'input-error' : ''}`}
                  placeholder="Иванов"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Имя пользователя</label>
              <input
                {...register('username', { required: 'Обязательное поле', minLength: { value: 3, message: 'Минимум 3 символа' } })}
                className={`input-field ${errors.username ? 'input-error' : ''}`}
                placeholder="username"
              />
              {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                {...register('email', {
                  required: 'Обязательное поле',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Некорректный email' }
                })}
                className={`input-field ${errors.email ? 'input-error' : ''}`}
                placeholder="email@example.com"
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Обязательное поле',
                    minLength: { value: 8, message: 'Минимум 8 символов' }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className={`input-field pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Подтверждение пароля</label>
              <input
                {...register('password_confirm', {
                  required: 'Обязательное поле',
                  validate: (val) => val === password || 'Пароли не совпадают'
                })}
                type="password"
                className={`input-field ${errors.password_confirm ? 'input-error' : ''}`}
                placeholder="••••••••"
              />
              {errors.password_confirm && <p className="text-sm text-red-500 mt-1">{errors.password_confirm.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full group mt-6"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Регистрация...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Создать аккаунт
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-dark-500">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
