import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, Sun, Moon, User, LogOut,
  LayoutDashboard, BookOpen,  Brain, FileText,
  HelpCircle, ChevronDown
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import NotificationBell from '@/components/notifications/NotificationBell'
import { cn } from '@/utils/cn'

const navLinks = [
  { path: '/', label: 'Главная' },
  { path: '/lessons', label: 'Уроки', icon: BookOpen },
  { path: '/quizzes', label: 'Тесты', icon: Brain },
  { path: '/blog', label: 'Блог', icon: FileText },
  { path: '/support', label: 'Поддержка', icon: HelpCircle },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-gray-200/50 dark:border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-lg hidden sm:block">
              <span className="gradient-text">My Driving</span>
              <span className="text-dark-800 dark:text-dark-200"> Study</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path ||
                (link.path !== '/' && location.pathname.startsWith(link.path))
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-dark-100 hover:bg-gray-100 dark:hover:bg-dark-800'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary-500 rounded-full"
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="btn-ghost p-2.5 rounded-xl"
              aria-label="Переключить тему"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Notifications */}
            {isAuthenticated && <NotificationBell />}

            {/* Auth buttons / User menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 btn-ghost rounded-xl"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                    {user.first_name?.[0] || user.username[0]}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {user.first_name || user.username}
                  </span>
                  <ChevronDown className="w-4 h-4 text-dark-400" />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 glass-strong rounded-2xl shadow-xl border border-gray-200/50 dark:border-dark-700/50 overflow-hidden"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <div className="p-3 border-b border-gray-100 dark:border-dark-700">
                        <p className="text-sm font-semibold">{user.first_name || user.username}</p>
                        <p className="text-xs text-dark-500">{user.email}</p>
                      </div>
                      <div className="p-1 space-y-0.5">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Дашборд
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Профиль
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Выйти
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn-ghost">
                  Войти
                </Link>
                <Link to="/register" className="btn-primary text-sm !px-4 !py-2">
                  Регистрация
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden btn-ghost p-2.5 rounded-xl"
              aria-label="Меню"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-100 dark:border-dark-700 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    location.pathname === link.path
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'text-dark-600 dark:text-dark-400 hover:bg-gray-100 dark:hover:bg-dark-800'
                  )}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-dark-700 mt-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 btn-ghost justify-center text-sm"
                  >
                    Войти
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 btn-primary justify-center text-sm !py-2"
                  >
                    Регистрация
                  </Link>
                </div>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
