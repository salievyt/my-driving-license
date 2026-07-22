from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone


class Quiz(models.Model):
    title = models.CharField(_('Название'), max_length=300)
    slug = models.SlugField(max_length=350, unique=True)
    description = models.TextField(_('Описание'), blank=True)
    category = models.ForeignKey(
        'lessons.Category', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='quizzes'
    )
    questions_count = models.PositiveIntegerField(
        _('Количество вопросов'), default=20
    )
    time_limit_minutes = models.PositiveIntegerField(
        _('Лимит времени'), default=20, help_text='0 — без лимита'
    )
    passing_score = models.PositiveIntegerField(
        _('Проходной балл %'), default=70
    )
    is_premium = models.BooleanField(_('Премиум'), default=False)
    is_published = models.BooleanField(_('Опубликован'), default=True)
    attempts_allowed = models.PositiveIntegerField(
        _('Допустимо попыток'), default=0, help_text='0 — без ограничений'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Тест')
        verbose_name_plural = _('Тесты')
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Question(models.Model):
    class Difficulty(models.TextChoices):
        EASY = 'easy', _('Лёгкий')
        MEDIUM = 'medium', _('Средний')
        HARD = 'hard', _('Сложный')

    quiz = models.ForeignKey(
        Quiz, on_delete=models.CASCADE,
        related_name='questions', verbose_name=_('Тест'),
        null=True, blank=True
    )
    text = models.TextField(_('Текст вопроса'))
    image = models.ImageField(
        _('Изображение'), upload_to='questions/',
        blank=True, null=True
    )
    explanation = models.TextField(
        _('Объяснение'), blank=True,
        help_text='Пояснение после ответа'
    )
    difficulty = models.CharField(
        _('Сложность'), max_length=10,
        choices=Difficulty.choices, default=Difficulty.MEDIUM
    )
    category = models.ForeignKey(
        'lessons.Category', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='questions'
    )
    tags = models.ManyToManyField(
        'lessons.Tag', blank=True, related_name='questions'
    )
    order = models.PositiveIntegerField(_('Порядок'), default=0)
    is_active = models.BooleanField(_('Активен'), default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Вопрос')
        verbose_name_plural = _('Вопросы')
        ordering = ['order', 'id']

    def __str__(self):
        return self.text[:100]

    def clean(self):
        if self.quiz and self.category:
            self.category = self.quiz.category


class Answer(models.Model):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE,
        related_name='answers', verbose_name=_('Вопрос')
    )
    text = models.CharField(_('Текст ответа'), max_length=500)
    is_correct = models.BooleanField(_('Правильный'), default=False)
    order = models.PositiveIntegerField(_('Порядок'), default=0)

    class Meta:
        verbose_name = _('Ответ')
        verbose_name_plural = _('Ответы')
        ordering = ['question', 'order']

    def __str__(self):
        return f'{self.text[:50]}...' if len(self.text) > 50 else self.text


class QuizAttempt(models.Model):
    user = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE,
        related_name='quiz_attempts'
    )
    quiz = models.ForeignKey(
        Quiz, on_delete=models.CASCADE,
        related_name='attempts'
    )
    score = models.PositiveIntegerField(_('Баллы'), default=0)
    max_score = models.PositiveIntegerField(_('Макс. баллов'), default=0)
    percentage = models.FloatField(_('Процент'), default=0)
    answers = models.JSONField(_('Ответы'), default=dict)
    time_spent_seconds = models.PositiveIntegerField(
        _('Затрачено секунд'), default=0
    )
    is_passed = models.BooleanField(_('Сдан'), default=False)
    is_completed = models.BooleanField(_('Завершён'), default=False)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(
        _('Завершён в'), null=True, blank=True
    )

    class Meta:
        verbose_name = _('Попытка теста')
        verbose_name_plural = _('Попытки тестов')
        ordering = ['-started_at']

    def __str__(self):
        return f'{self.user.username} — {self.quiz.title} ({self.percentage}%)'


class UserAnswer(models.Model):
    attempt = models.ForeignKey(
        QuizAttempt, on_delete=models.CASCADE,
        related_name='user_answers'
    )
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE
    )
    selected_answers = models.ManyToManyField(
        Answer, related_name='user_selections'
    )
    is_correct = models.BooleanField(_('Верно'), default=False)
    answered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Ответ пользователя')
        verbose_name_plural = _('Ответы пользователей')

    def __str__(self):
        return f'{self.attempt.user.username} — Q{self.question.id}'
