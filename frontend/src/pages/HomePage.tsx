import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Brain, Sparkles, Shield, Infinity,
  BarChart3, Award, BookOpen, CheckCircle2,
  Zap, Target, Users, Star,  ChevronRight, User
} from 'lucide-react'

const stats = [
  { value: '50 000+', label: 'Учеников' },
  { value: '5 000+', label: 'Вопросов ПДД' },
  { value: '96%', label: 'Успешная сдача' },
  { value: '4.9', label: 'Рейтинг', suffix: <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> },
]

const features = [
  {
    icon: Brain,
    title: 'Интерактивные тесты',
    description: 'Проходи тесты в формате реального экзамена с мгновенной проверкой и подробными объяснениями.',
    color: 'from-primary-500 to-primary-600',
    gradient: 'from-primary-500/20 to-primary-600/10',
  },
  {
    icon: Target,
    title: 'Умное повторение',
    description: 'Система анализирует твои ошибки и предлагает повторить самые сложные темы.',
    color: 'from-accent-500 to-emerald-600',
    gradient: 'from-accent-500/20 to-emerald-500/10',
  },
  {
    icon: BarChart3,
    title: 'Прогресс и статистика',
    description: 'Отслеживай свой рост, уровень подготовки и улучшай результаты день за днём.',
    color: 'from-purple-500 to-purple-600',
    gradient: 'from-purple-500/20 to-purple-600/10',
  },
  {
    icon: Award,
    title: 'Геймификация',
    description: 'Получай бейджи, уровни и награды за успехи. Учись с азартом и интересом.',
    color: 'from-amber-500 to-orange-600',
    gradient: 'from-amber-500/20 to-orange-500/10',
  },
  {
    icon: Shield,
    title: 'Актуальная база ПДД',
    description: 'Все вопросы соответствуют последним изменениям в правилах дорожного движения.',
    color: 'from-blue-500 to-blue-600',
    gradient: 'from-blue-500/20 to-blue-600/10',
  },
  {
    icon: Infinity,
    title: 'Безлимитная практика',
    description: 'Неограниченное количество пробных тестов. Тренируйся сколько нужно для уверенности.',
    color: 'from-rose-500 to-pink-600',
    gradient: 'from-rose-500/20 to-pink-500/10',
  },
]

const pricingPlans = [
  {
    name: 'Базовый',
    price: '0',
    description: 'Начни обучение бесплатно',
    features: [
      '20 вопросов в день',
      'Базовая статистика',
      'Доступ к 5 урокам',
      'Пробный тест',
    ],
    cta: 'Начать бесплатно',
    popular: false,
  },
  {
    name: 'Премиум',
    price: '499',
    period: 'в месяц',
    description: 'Полный доступ ко всем возможностям',
    features: [
      'Безлимитные тесты',
      'Все уроки и материалы',
      'Детальная аналитика',
      'Приоритетная поддержка',
      'Сертификат о прохождении',
      'Умное повторение ошибок',
    ],
    cta: 'Попробовать Премиум',
    popular: true,
  },
  {
    name: 'Годовой',
    price: '3 990',
    period: 'в год',
    description: 'Максимальная выгода',
    features: [
      'Всё из Премиум',
      'Экономия 40%',
      'Индивидуальный план',
      'Консультация инструктора',
      'Эксклюзивные материалы',
    ],
    cta: 'Выбрать годовой',
    popular: false,
  },
]

const testimonials = [
  {
    name: 'Анна К.',
    text: 'Сдала теорию с первого раза! Платформа реально помогла — удобные тесты и понятные объяснения ошибок.',
    rating: 5,
    role: 'Студентка',
  },
  {
    name: 'Максим Д.',
    text: 'Отличная альтернатива скучным учебникам. Геймификация и статистика мотивируют заниматься каждый день.',
    rating: 5,
    role: 'Курсант автошколы',
  },
  {
    name: 'Елена В.',
    text: 'Премиум стоит каждой копейки. Детальный разбор ошибок помог закрыть пробелы в сложных темах.',
    rating: 5,
    role: 'Будущий водитель',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 via-transparent to-transparent dark:from-primary-500/10" />
        <div className="absolute top-20 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 -right-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 text-sm font-medium text-primary-700 dark:text-primary-300 mb-8">
              <Sparkles className="w-4 h-4" />
              Новая версия платформы 2026
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-display-md sm:text-display-lg md:text-display-xl font-bold tracking-tight text-balance"
            >
              Подготовка к экзамену в автошколе,
              <br />
              <span className="gradient-text">которая работает</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg md:text-xl text-dark-600 dark:text-dark-400 max-w-2xl mx-auto leading-relaxed"
            >
              Интерактивные тесты, умное повторение, персональная статистика и геймификация.
              Занимайся с удовольствием и сдавай теорию с первого раза.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="btn-primary text-lg !px-8 !py-4 group"
              >
                Начать обучение
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/lessons"
                className="btn-secondary text-lg !px-8 !py-4"
              >
                Смотреть уроки
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="glass-card p-6 text-center">
                  <div className="text-2xl md:text-3xl font-bold gradient-text flex items-center justify-center gap-1">
                    {stat.value}
                    {stat.suffix}
                  </div>
                  <div className="text-sm text-dark-500 dark:text-dark-400 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/3 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-display-sm sm:text-display-md font-bold mb-4">
              Всё для успешной сдачи
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-dark-500 dark:text-dark-400 max-w-2xl mx-auto">
              Мы объединили современные технологии обучения и проверенные методики подготовки
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group relative glass-card p-8 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5`}>
                  <feature.icon className={`w-6 h-6 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-dark-500 dark:text-dark-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 md:py-32 bg-gray-50/50 dark:bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-display-sm sm:text-display-md font-bold mb-4">
              Как это работает
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-dark-500 dark:text-dark-400">
              Всего 4 шага до уверенной сдачи экзамена
            </motion.p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Регистрация', desc: 'Создай аккаунт за 30 секунд и получи доступ к базовым материалам', icon: User },
              { step: '02', title: 'Изучай уроки', desc: 'Проходи структурированные уроки по всем темам ПДД', icon: BookOpen },
              { step: '03', title: 'Практикуйся', desc: 'Решай тесты, анализируй ошибки и повторяй сложные темы', icon: Target },
              { step: '04', title: 'Сдай экзамен', desc: 'Будь уверен в своих знаниях и получи права с первой попытки', icon: CheckCircle2 },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="relative inline-flex mb-6">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl shadow-primary-500/25">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-dark-800 border-2 border-primary-500 flex items-center justify-center text-sm font-bold text-primary-600">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-dark-500 dark:text-dark-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-display-sm sm:text-display-md font-bold mb-4">
              Что говорят ученики
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-dark-500 dark:text-dark-400">
              Тысячи учеников уже сдали экзамен с нашей помощью
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-dark-600 dark:text-dark-300 mb-6 leading-relaxed">
                  "{t.text}"
                </p>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-dark-500">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-24 md:py-32 bg-gray-50/50 dark:bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-display-sm sm:text-display-md font-bold mb-4">
              Выбери свой план
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-dark-500 dark:text-dark-400">
              Начни бесплатно или получи полный доступ к премиум-возможностям
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative glass-card p-8 ${
                  plan.popular
                    ? 'ring-2 ring-primary-500 shadow-xl shadow-primary-500/10 scale-105'
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-500 to-primary-700 text-white text-xs font-bold px-4 py-1 rounded-full">
                    ПОПУЛЯРНЫЙ
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-dark-500 mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-dark-500">{plan.period}</span>
                    )}
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-accent-500 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.popular
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-accent-500/10" />
        <div className="absolute inset-0 bg-grid opacity-30" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-display-sm sm:text-display-md font-bold mb-6">
              Готов начать обучение?
            </h2>
            <p className="text-lg text-dark-500 dark:text-dark-400 mb-10 max-w-2xl mx-auto">
              Присоединяйся к тысячам учеников, которые уже готовятся к экзамену с My Driving Study.
              Первый урок — бесплатно!
            </p>
            <Link
              to="/register"
              className="btn-primary text-lg !px-10 !py-4 group inline-flex"
            >
              Начать бесплатно
              <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
