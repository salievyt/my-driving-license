from django.db import models
from django.utils.translation import gettext_lazy as _


class UserProgress(models.Model):
    user = models.OneToOneField(
        'accounts.User', on_delete=models.CASCADE,
        related_name='learning_progress'
    )
    total_lessons_completed = models.PositiveIntegerField(
        _('Уроков пройдено'), default=0
    )
    total_quizzes_passed = models.PositiveIntegerField(
        _('Тестов сдано'), default=0
    )
    total_quizzes_attempted = models.PositiveIntegerField(
        _('Тестов пройдено всего'), default=0
    )
    current_streak = models.PositiveIntegerField(
        _('Текущая серия'), default=0
    )
    longest_streak = models.PositiveIntegerField(
        _('Максимальная серия'), default=0
    )
    last_study_date = models.DateField(
        _('Последняя дата обучения'), null=True, blank=True
    )
    study_hours_total = models.FloatField(
        _('Всего часов обучения'), default=0
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Прогресс обучения')
        verbose_name_plural = _('Прогресс обучения')

    def __str__(self):
        return f'Прогресс {self.user.username}'


class WeakTopic(models.Model):
    user = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE,
        related_name='weak_topics'
    )
    category = models.ForeignKey(
        'lessons.Category', on_delete=models.CASCADE,
        verbose_name=_('Категория')
    )
    wrong_answers_count = models.PositiveIntegerField(
        _('Неправильных ответов'), default=0
    )
    total_answers_count = models.PositiveIntegerField(
        _('Всего ответов'), default=0
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Слабая тема')
        verbose_name_plural = _('Слабые темы')
        unique_together = ['user', 'category']

    def __str__(self):
        return f'{self.user.username} — {self.category.title}'

    @property
    def weakness_percentage(self):
        if self.total_answers_count == 0:
            return 0
        return round((self.wrong_answers_count / self.total_answers_count) * 100, 1)


class StudySession(models.Model):
    user = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE,
        related_name='study_sessions'
    )
    date = models.DateField(_('Дата'), auto_now_add=True)
    duration_minutes = models.PositiveIntegerField(
        _('Длительность'), default=0
    )
    lessons_completed = models.PositiveIntegerField(default=0)
    quizzes_completed = models.PositiveIntegerField(default=0)
    questions_answered = models.PositiveIntegerField(default=0)
    points_earned = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = _('Сессия обучения')
        verbose_name_plural = _('Сессии обучения')
        ordering = ['-date']

    def __str__(self):
        return f'{self.user.username} — {self.date} ({self.duration_minutes}мин)'


class Achievement(models.Model):
    user = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE,
        related_name='achievements'
    )
    title = models.CharField(_('Название'), max_length=200)
    description = models.TextField(_('Описание'), blank=True)
    icon = models.CharField(_('Иконка'), max_length=50, default='🏆')
    category = models.CharField(
        _('Категория'), max_length=50,
        choices=[
            ('streak', 'Серия'),
            ('score', 'Баллы'),
            ('lessons', 'Уроки'),
            ('quizzes', 'Тесты'),
            ('special', 'Особое'),
        ],
        default='special'
    )
    points_reward = models.PositiveIntegerField(
        _('Награда опытом'), default=0
    )
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Достижение')
        verbose_name_plural = _('Достижения')
        ordering = ['-earned_at']

    def __str__(self):
        return f'{self.title} — {self.user.username}'
