import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Search } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 bg-grid opacity-30" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center px-4 relative"
      >
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-8 shadow-xl">
          <Search className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-display-lg md:text-display-xl font-bold gradient-text mb-4">
          404
        </h1>
        <p className="text-xl text-dark-500 dark:text-dark-400 mb-8">
          Страница не найдена
        </p>
        <Link
          to="/"
          className="btn-primary inline-flex group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          На главную
        </Link>
      </motion.div>
    </div>
  )
}
