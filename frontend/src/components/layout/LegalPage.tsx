import { motion } from 'framer-motion'
import { Shield, FileText, ScrollText } from 'lucide-react'
import type { ReactNode } from 'react'

const iconMap: Record<string, typeof Shield> = {
  privacy: Shield,
  terms: FileText,
  offer: ScrollText,
}

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'offer'
  title: string
  updatedDate: string
  children: ReactNode
}

export default function LegalPage({ type, title, updatedDate, children }: LegalPageProps) {
  const Icon = iconMap[type] || FileText

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="glass-card p-8 md:p-10 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shrink-0">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-display-sm md:text-display-md font-bold mb-2">
                  {title}
                </h1>
                <p className="text-sm text-dark-500 dark:text-dark-400">
                  Последнее обновление: {updatedDate}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-dark-600 dark:text-dark-300 leading-relaxed">
              {children}
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-sm text-dark-400">
            Если у вас остались вопросы,{' '}
            <a
              href="/support"
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              свяжитесь с поддержкой
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
