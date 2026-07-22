from django.db import models
from django.utils.translation import gettext_lazy as _
from ckeditor.fields import RichTextField


class Category(models.Model):
    title = models.CharField(_('Название'), max_length=200)
    slug = models.SlugField(_('Slug'), max_length=250, unique=True)
    description = models.TextField(_('Описание'), blank=True)
    icon = models.CharField(_('Иконка'), max_length=50, blank=True)
    color = models.CharField(_('Цвет'), max_length=7, default='#6366f1', help_text='HEX цвет')
    order = models.PositiveIntegerField(_('Порядок'), default=0)
    is_active = models.BooleanField(_('Активна'), default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Категория')
        verbose_name_plural = _('Категории')
        ordering = ['order', 'title']

    def __str__(self):
        return self.title


class Tag(models.Model):
    name = models.CharField(_('Название'), max_length=100)
    slug = models.SlugField(max_length=120, unique=True)

    class Meta:
        verbose_name = _('Тег')
        verbose_name_plural = _('Теги')

    def __str__(self):
        return self.name


class Lesson(models.Model):
    class Difficulty(models.TextChoices):
        BEGINNER = 'beginner', _('Начальный')
        INTERMEDIATE = 'intermediate', _('Средний')
        ADVANCED = 'advanced', _('Продвинутый')

    category = models.ForeignKey(
        Category, on_delete=models.CASCADE,
        related_name='lessons', verbose_name=_('Категория')
    )
    tags = models.ManyToManyField(
        Tag, blank=True, related_name='lessons'
    )
    title = models.CharField(_('Название'), max_length=300)
    slug = models.SlugField(max_length=350, unique=True)
    summary = models.TextField(_('Краткое описание'), max_length=500)
    content = RichTextField(_('Содержание'))
    difficulty = models.CharField(
        _('Сложность'), max_length=20,
        choices=Difficulty.choices, default=Difficulty.BEGINNER
    )
    duration_minutes = models.PositiveIntegerField(
        _('Длительность (мин)'), default=10
    )
    cover_image = models.ImageField(
        _('Изображение'), upload_to='lessons/covers/',
        blank=True, null=True
    )
    video_url = models.URLField(_('Видео URL'), blank=True)
    is_premium = models.BooleanField(_('Премиум'), default=False)
    is_published = models.BooleanField(_('Опубликован'), default=True)
    order = models.PositiveIntegerField(_('Порядок'), default=0)
    views_count = models.PositiveIntegerField(_('Просмотров'), default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Урок')
        verbose_name_plural = _('Уроки')
        ordering = ['category', 'order', 'title']

    def __str__(self):
        return self.title


class LessonProgress(models.Model):
    user = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE,
        related_name='lesson_progress'
    )
    lesson = models.ForeignKey(
        Lesson, on_delete=models.CASCADE,
        related_name='user_progress'
    )
    is_completed = models.BooleanField(_('Завершён'), default=False)
    completed_at = models.DateTimeField(_('Завершён в'), null=True, blank=True)
    time_spent_minutes = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = _('Прогресс урока')
        verbose_name_plural = _('Прогресс уроков')
        unique_together = ['user', 'lesson']

    def __str__(self):
        return f'{self.user.username} — {self.lesson.title}'
