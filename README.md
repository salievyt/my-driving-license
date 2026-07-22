# My Driving Study

**Современная EdTech-платформа для подготовки к теоретическому экзамену в автошколе.**

> Не очередной сайт с билетами ПДД. Это премиальный digital-продукт с геймификацией, умной аналитикой и дизайном, который не стыдно показать.

---

## 📖 О чём этот проект

Я сам готовился к сдаче на права и перепробовал всё существующее — от распечатанных билетов до мобильных приложений. Везде одно и то же: серый дизайн, куча рекламы, никакой мотивации. 

**My Driving Study** — это попытка сделать подготовку к экзамену такой, какой она должна быть в 2026 году: красивой, удобной и вовлекающей.

Это не MVP, сделанный за выходные. Это полноценная платформа с:
- Интерактивными тестами в формате реального экзамена
- Умной системой повторения сложных вопросов
- Геймификацией (уровни, XP, бейджи, серии)
- Персонализированной траекторией обучения
- Onboarding-флоу с диагностикой знаний
- Retention-механиками (вопрос дня, streak, еженедельные сводки)
- Премиальной дизайн-системой (glassmorphism, градиенты, микроанимации)

---

## 🛠 Технологический стек

```
Frontend:   React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion
Backend:    Django 5 + Django REST Framework + PostgreSQL
Auth:       JWT (djangorestframework-simplejwt)
Admin:      Jazzmin (кастомная админ-панель)
Deploy:     Docker + Nginx + Gunicorn + Celery + Redis
SSL:        Let's Encrypt / Certbot
```

### Frontend

| Технология | Зачем |
|:---|:---|
| React 19 | Компонентная архитектура |
| TypeScript | Типобезопасность |
| Vite | Мгновенная сборка, HMR |
| Tailwind CSS | Дизайн-система + dark/light темы |
| Framer Motion | Плавные анимации |
| React Query (TanStack) | Кэширование и синхронизация данных |
| React Hook Form | Формы с валидацией |
| React Router v7 | Клиентский роутинг |
| Axios | HTTP-клиент с перехватом JWT |
| Lucide React | Иконки |

### Backend

| Компонент | Описание |
|:---|:---|
| Django 5 | Core framework |
| DRF | REST API с viewsets и роутерами |
| SimpleJWT | JWT аутентификация с refresh-токенами |
| Jazzmin | Современная админ-панель |
| django-filter | Фильтрация, поиск, сортировка |
| drf-spectacular | Swagger/OpenAPI документация |
| Celery | Асинхронные задачи (уведомления, напоминания) |
| PostgreSQL | Основная база данных |

---

## 📁 Структура проекта

```
├── backend/                          # Django backend
│   ├── config/
│   │   ├── settings/
│   │   │   ├── base.py               # Общие настройки
│   │   │   ├── development.py        # Dev-специфичные
│   │   │   ├── production.py         # Prod-специфичные
│   │   │   └── jazzmin.py            # Конфиг админки
│   │   ├── urls.py                   # Корневой роутинг
│   │   ├── wsgi.py
│   │   └── celery.py                 # Celery конфиг
│   ├── apps/
│   │   ├── accounts/                 # Пользователи, JWT, профили, бейджи
│   │   ├── lessons/                  # Уроки, категории
│   │   ├── quizzes/                  # Тесты, вопросы, ответы, попытки
│   │   ├── progress/                 # Прогресс, weak topics, достижения
│   │   ├── subscriptions/            # Тарифные планы
│   │   ├── notifications/            # Уведомления + retention-команды
│   │   ├── blog/                     # Статьи и комментарии
│   │   ├── support/                  # FAQ и тикеты
│   │   └── core/                     # Pagination, permissions
│   ├── Dockerfile                    # Multi-stage production
│   ├── docker-entrypoint.sh          # Миграции при старте
│   └── requirements/
│
├── frontend/                         # React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/               # Header, Footer, Layout, LegalPage
│   │   │   └── notifications/        # NotificationBell, DailyQuestion, Streak
│   │   ├── pages/                    # 17 страниц (Home → 404)
│   │   ├── hooks/                    # useAuth, useTheme
│   │   ├── services/                 # API clients (8 сервисов)
│   │   ├── types/                    # TypeScript интерфейсы
│   │   ├── lib/                      # Axios instance с JWT
│   │   ├── utils/                    # Форматирование, cn()
│   │   └── styles/                   # Tailwind + glass-компоненты
│   ├── Dockerfile                    # Multi-stage (Node build → Nginx)
│   ├── Dockerfile.dev                # Dev с hot-reload
│   └── nginx.conf
│
├── nginx.conf                        # Production reverse proxy
├── nginx.dev.conf                    # Dev reverse proxy
├── docker-compose.yml                # 8 сервисов: db, redis, backend, celery,
│                                     #   celery-beat, frontend, nginx, certbot
├── docker-compose.dev.yml            # Dev overrides
├── Makefile                          # dev, build, up, down, migrate, certbot...
└── .env.prod.example                 # Все переменные окружения
```

---

## 🚀 Быстрый старт

### Локальная разработка

```bash
# 1. Клонировать
git clone https://github.com/salievyt/my-driving-license.git
cd my-driving-license

# 2. Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements/development.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver

# 3. Frontend (в новом терминале)
cd frontend
npm install
npm run dev
```

Фронтенд будет на `http://localhost:5173`, бэкенд на `http://localhost:8000`.

### Через Docker

```bash
# Production сборка
make build
make up

# Dev режим с hot-reload
make dev

# Остановить
make down

# Миграции
make migrate

# SSL сертификаты
make certbot
```

---

## 🧠 Что внутри

### Пользовательские сценарии

1. **Onboarding**: регистрация → выбор уровня и цели → диагностический тест (5 вопросов) → персонализированный план
2. **Обучение**: уроки по категориям → тесты с таймером → разбор ошибок → повторение слабых тем
3. **Retention**: вопрос дня → streak + XP → уведомления → еженедельная сводка → бейджи
4. **Monetization**: бесплатный доступ → paywall → выбор тарифа → Премиум

### Геймификация

| Механика | Описание |
|:---|:---|
| Уровни | Опыт за тесты и уроки |
| XP | За каждый правильный ответ + бонусы |
| Streak | Серия дней — мотивация не пропускать |
| Бейджи | 10+ достижений за milestones |
| Вопрос дня | +20 XP ежедневно |
| Майлстоуны | 3/7/14/30/60/100 дней — XP + награды |

### Retention-система

```
09:00  →  Вопрос дня (всем пользователям)
18:00  →  Напоминание (кто не занимался сегодня)
22:00  →  Проверка streak-майлстоунов
Вс 20:00 →  Еженедельная сводка прогресса
```

---

## 🎨 Особенности дизайна

- **Glassmorphism** — матовые карточки с backdrop-blur
- **Градиенты** — мягкие переходы для акцентов
- **Микроанимации** — Framer Motion spring-анимации
- **Тёмная/светлая тема** — с переключением и сохранением в localStorage
- **Mobile-first** — адаптивно от 320px
- **Типографика** — Inter + системные шрифты

---

## 📊 API

Полная документация доступна после запуска:
- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`
- OpenAPI Schema: `http://localhost:8000/api/schema/`

### Основные endpoints

```
POST   /api/v1/auth/register/         # Регистрация
POST   /api/v1/auth/login/            # Вход
GET    /api/v1/auth/me/               # Текущий пользователь

GET    /api/v1/lessons/               # Список уроков
GET    /api/v1/lessons/{slug}/        # Детали урока

GET    /api/v1/quizzes/               # Список тестов
GET    /api/v1/quizzes/{slug}/        # Детали теста с вопросами
POST   /api/v1/quizzes/{slug}/start/  # Начать тест
POST   /api/v1/quizzes/{slug}/submit/ # Сдать тест

GET    /api/v1/progress/dashboard/    # Дашборд прогресса

GET    /api/v1/notifications/         # Уведомления
GET    /api/v1/notifications/daily-question/  # Вопрос дня

GET    /api/v1/blog/                  # Статьи
GET    /api/v1/support/faq/           # FAQ
```

---

## 🚢 Production на VPS

```bash
# 1. Установить зависимости
# Docker, Docker Compose, Git

# 2. Клонировать
git clone https://github.com/salievyt/my-driving-license.git
cd my-driving-license

# 3. Настроить окружение
cp .env.prod.example .env
# Отредактировать .env (SECRET_KEY, DB_PASSWORD, EMAIL и т.д.)

# 4. Запустить
make build
make up

# 5. SSL сертификаты
make certbot
```

Сайт будет доступен по HTTPS, админка на `/admin/`.

---

## 📄 Лицензия

MIT — делайте что хотите, но если сделаете крутой продукт — дайте знать.

---

## 🤝 Контакты

Проект растёт, и я открыт к фидбеку. Если есть идеи, баги или предложения — создавайте issue или пишите напрямую.

---

*Сделано с кофе и любовью к хорошему UX.  
— Команда My Driving Study*
