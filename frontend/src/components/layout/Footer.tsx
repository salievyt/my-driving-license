import { Link } from 'react-router-dom'

const footerLinks = {
  product: {
    title: 'Продукт',
    links: [
      { label: 'Уроки', path: '/lessons' },
      { label: 'Тесты', path: '/quizzes' },
      { label: 'Тарифы', path: '/#pricing' },
      { label: 'Блог', path: '/blog' },
    ],
  },
  support: {
    title: 'Поддержка',
    links: [
      { label: 'FAQ', path: '/support' },
      { label: 'Помощь', path: '/support' },
      { label: 'Контакты', path: '/support' },
    ],
  },
  legal: {
    title: 'Правовая информация',
    links: [
      { label: 'Конфиденциальность', path: '/privacy' },
      { label: 'Условия использования', path: '/terms' },
      { label: 'Публичная оферта', path: '/offer' },
    ],
  },
}

export default function Footer() {
  return (
    <footer className="relative border-t border-gray-200 dark:border-dark-800 bg-gray-50/50 dark:bg-dark-900/50">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-500/5 dark:to-primary-500/2 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-bold text-lg">
                <span className="gradient-text">My Driving</span>
                <span className="text-dark-800 dark:text-dark-200"> Study</span>
              </span>
            </Link>
            <p className="text-sm text-dark-500 dark:text-dark-400 leading-relaxed">
              Современная платформа для подготовки к теоретическому экзамену в автошколе.
              Учись эффективно с интерактивными тестами и умной системой повторения.
            </p>
          </div>

          {/* Link columns */}
          {Object.values(footerLinks).map((group) => (
            <div key={group.title}>
              <h3 className="font-semibold text-sm text-dark-900 dark:text-dark-100 mb-3">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-dark-500 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-dark-400">
            &copy; {new Date().getFullYear()} My Driving Study. Все права защищены.
          </p>
          <div className="flex items-center gap-4 text-sm text-dark-400">
            <span>Сделано с ❤️ для будущих водителей</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
