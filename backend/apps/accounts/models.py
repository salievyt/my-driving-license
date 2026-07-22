from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = 'student', _('Студент')
        INSTRUCTOR = 'instructor', _('Инструктор')
        ADMIN = 'admin', _('Администратор')

    role = models.CharField(
        _('Роль'), max_length=20,
        choices=Role.choices, default=Role.STUDENT
    )
    avatar = models.ImageField(
        _('Аватар'), upload_to='avatars/',
        blank=True, null=True
    )
    phone = models.CharField(
        _('Телефон'), max_length=20, blank=True
    )
    email_verified = models.BooleanField(
        _('Email подтвержден'), default=False
    )

    class Meta:
        verbose_name = _('Пользователь')
        verbose_name_plural = _('Пользователи')

    def __str__(self):
        return self.get_full_name() or self.email or self.username


class Profile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE,
        related_name='profile'
    )
    bio = models.TextField(_('О себе'), blank=True)
    level = models.PositiveIntegerField(_('Уровень'), default=1)
    experience_points = models.PositiveIntegerField(
        _('Опыт'), default=0
    )
    streak_days = models.PositiveIntegerField(
        _('Дней подряд'), default=0
    )
    last_active_date = models.DateField(
        _('Последняя активность'), null=True, blank=True
    )
    total_tests_completed = models.PositiveIntegerField(
        _('Тестов пройдено'), default=0
    )
    total_correct_answers = models.PositiveIntegerField(
        _('Правильных ответов'), default=0
    )
    total_incorrect_answers = models.PositiveIntegerField(
        _('Неправильных ответов'), default=0
    )
    experience_level = models.CharField(
        _('Уровень опыта'), max_length=20,
        choices=[
            ('beginner', 'Новичок'),
            ('intermediate', 'Средний'),
            ('advanced', 'Продвинутый'),
        ],
        blank=True, default='beginner'
    )
    study_goal = models.CharField(
        _('Цель обучения'), max_length=20,
        choices=[
            ('exam', 'Сдать экзамен'),
            ('full', 'Полный курс'),
            ('refresh', 'Повторить знания'),
        ],
        blank=True, default='exam'
    )
    study_goal_minutes = models.PositiveIntegerField(
        _('Цель обучения (мин/день)'), default=15
    )
    onboarding_completed = models.BooleanField(
        _('Onboarding завершён'), default=False
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Профиль')
        verbose_name_plural = _('Профили')

    def __str__(self):
        return f'Профиль {self.user.username}'

    @property
    def accuracy(self):
        total = self.total_correct_answers + self.total_incorrect_answers
        if total == 0:
            return 0
        return round((self.total_correct_answers / total) * 100, 1)

    @property
    def next_level_xp(self):
        return self.level * 1000

    def add_experience(self, points):
        self.experience_points += points
        while self.experience_points >= self.next_level_xp:
            self.experience_points -= self.next_level_xp
            self.level += 1
        self.save()


class UserBadge(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE,
        related_name='badges'
    )
    name = models.CharField(_('Название'), max_length=100)
    description = models.TextField(_('Описание'), blank=True)
    icon = models.CharField(_('Иконка'), max_length=50, blank=True)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Бейдж')
        verbose_name_plural = _('Бейджи')
        ordering = ['-earned_at']

    def __str__(self):
        return f'{self.name} — {self.user.username}'
