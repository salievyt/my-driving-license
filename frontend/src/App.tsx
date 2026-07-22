import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import Layout from '@/components/layout/Layout'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import LessonsPage from '@/pages/LessonsPage'
import LessonDetailPage from '@/pages/LessonDetailPage'
import QuizzesPage from '@/pages/QuizzesPage'
import QuizDetailPage from '@/pages/QuizDetailPage'
import DashboardPage from '@/pages/DashboardPage'
import BlogPage from '@/pages/BlogPage'
import ArticleDetailPage from '@/pages/ArticleDetailPage'
import SupportPage from '@/pages/SupportPage'
import ProfilePage from '@/pages/ProfilePage'
import OnboardingPage from '@/pages/OnboardingPage'
import PrivacyPage from '@/pages/PrivacyPage'
import TermsPage from '@/pages/TermsPage'
import OfferPage from '@/pages/OfferPage'
import NotFoundPage from '@/pages/NotFoundPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public routes with layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/lessons/:slug" element={<LessonDetailPage />} />
          <Route path="/quizzes" element={<QuizzesPage />} />
          <Route path="/quizzes/:slug" element={<QuizDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<ArticleDetailPage />} />
          <Route path="/support" element={<SupportPage />} />

          {/* Legal pages */}
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/offer" element={<OfferPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />

        {/* Full-screen protected routes (no layout) */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}
