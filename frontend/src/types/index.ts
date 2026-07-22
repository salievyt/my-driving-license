// User Types
export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: 'student' | 'instructor' | 'admin'
  avatar: string | null
  phone: string
  date_joined: string
  profile: Profile
  badges: Badge[]
}

export interface Profile {
  level: number
  experience_points: number
  streak_days: number
  total_tests_completed: number
  total_correct_answers: number
  total_incorrect_answers: number
  accuracy: number
  bio: string
  last_active_date: string | null
  experience_level: 'beginner' | 'intermediate' | 'advanced'
  study_goal: 'exam' | 'full' | 'refresh'
  study_goal_minutes: number
  onboarding_completed: boolean
}

export interface Badge {
  id: number
  name: string
  description: string
  icon: string
  earned_at: string
}

// Auth Types
export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  password_confirm: string
  first_name: string
  last_name: string
}

// Lesson Types
export interface Category {
  id: number
  title: string
  slug: string
  description: string
  icon: string
  color: string
  order: number
  lessons_count: number
}

export interface Tag {
  id: number
  name: string
  slug: string
}

export interface Lesson {
  id: number
  title: string
  slug: string
  summary: string
  content?: string
  category: Category
  tags: Tag[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration_minutes: number
  cover_image: string | null
  video_url: string
  is_premium: boolean
  views_count: number
  order: number
  is_completed: boolean
  user_progress?: {
    is_completed: boolean
    time_spent_minutes: number
  }
  created_at: string
  updated_at?: string
}

// Quiz Types
export interface Answer {
  id: number
  text: string
  order: number
  is_correct?: boolean
}

export interface Question {
  id: number
  text: string
  image: string | null
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  order: number
  answers: Answer[]
  has_image?: boolean
}

export interface Quiz {
  id: number
  title: string
  slug: string
  description: string
  category: Category | null
  questions_count: number
  time_limit_minutes: number
  passing_score: number
  is_premium: boolean
  questions?: Question[]
  attempts_count: number
  created_at: string
}

export interface QuizAttempt {
  id: number
  quiz: number
  quiz_title: string
  quiz_slug: string
  score: number
  max_score: number
  percentage: number
  time_spent_seconds: number
  is_passed: boolean
  is_completed: boolean
  started_at: string
  completed_at: string | null
}

// Progress Types
export interface UserProgress {
  total_lessons_completed: number
  total_quizzes_passed: number
  total_quizzes_attempted: number
  current_streak: number
  longest_streak: number
  last_study_date: string | null
  study_hours_total: number
}

export interface WeakTopic {
  id: number
  category: number
  category_name: string
  category_slug: string
  wrong_answers_count: number
  total_answers_count: number
  weakness_percentage: number
}

export interface StudySession {
  id: number
  date: string
  duration_minutes: number
  lessons_completed: number
  quizzes_completed: number
  questions_answered: number
  points_earned: number
}

export interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  category: string
  points_reward: number
  earned_at: string
}

export interface ProgressDashboard {
  overall_progress: UserProgress
  weak_topics: WeakTopic[]
  recent_sessions: StudySession[]
  achievements: Achievement[]
  level: number
  experience_points: number
  next_level_xp: number
  accuracy: number
}

// Subscription Types
export interface SubscriptionPlan {
  id: number
  name: string
  slug: string
  description: string
  price: string
  old_price: string | null
  duration_days: number
  has_premium_lessons: boolean
  has_unlimited_quizzes: boolean
  has_detailed_statistics: boolean
  has_certificate: boolean
  has_priority_support: boolean
  savings_percent: number
  order: number
  is_active: boolean
}

export interface UserSubscription {
  id: number
  plan: SubscriptionPlan
  is_active: boolean
  start_date: string
  end_date: string
  days_remaining: number
  auto_renew: boolean
}

// Notification Types
export interface Notification {
  id: number
  title: string
  message: string
  notification_type: string
  link: string
  is_read: boolean
  time_ago: string
  created_at: string
}

export interface NotificationSettings {
  email_notifications: boolean
  push_notifications: boolean
  daily_reminder: boolean
  reminder_time: string
}

// Blog Types
export interface ArticleCategory {
  id: number
  title: string
  slug: string
  description: string
  icon: string
  articles_count: number
}

export interface Article {
  id: number
  title: string
  slug: string
  summary: string
  content?: string
  category: ArticleCategory
  author_name: string
  cover_image: string | null
  reading_time_minutes: number
  views_count: number
  is_published?: boolean
  comments_count?: number
  created_at: string
  updated_at?: string
}

export interface ArticleComment {
  id: number
  article: number
  author: number
  author_name: string
  text: string
  created_at: string
}

// Support Types
export interface FAQ {
  id: number
  question: string
  answer: string
  category: string
  order: number
  is_active: boolean
}

export interface SupportTicket {
  id: number
  subject: string
  message: string
  status: string
  status_display: string
  priority: string
  priority_display: string
  category: string
  messages: TicketMessage[]
  created_at: string
  updated_at: string
  resolved_at: string | null
}

export interface TicketMessage {
  id: number
  author: number
  author_name: string
  author_avatar: string | null
  message: string
  is_staff_reply: boolean
  created_at: string
}

// API Types
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ApiError {
  error: string
  [key: string]: unknown
}
