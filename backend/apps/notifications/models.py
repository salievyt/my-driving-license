from django.db import models
from django.utils.translation import gettext_lazy as _


class Notification(models.Model):
    class Type(models.TextChoices):
        REMINDER = 'reminder', _('Напоминание')
        ACHIEVEMENT = 'achievement', _('Достижение')
        STREAK = 'streak', _('Серия')
        DAILY_QUESTION = 'daily_question', _('Вопрос дня')
        MILESTONE = 'milestone', _('Майлстоун')
        WEEKLY = 'weekly', _('Еженедельная сводка')
        SUBSCRIPTION = 'subscription', _('Подписка')
        SYSTEM = 'system', _('Системное')
        TIP = 'tip', _('Совет')

    user = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE,
        related_name='notifications'
    )
    title = models.CharField(_('Заголовок'), max_length=200)
    message = models.TextField(_('Сообщение'), blank=True)
    notification_type = models.CharField(
        _('Тип'), max_length=20,
        choices=Type.choices, default=Type.SYSTEM
    )
    link = models.CharField(
        _('Ссылка'), max_length=500, blank=True,
        help_text='URL для перехода'
    )
    is_read = models.BooleanField(_('Прочитано'), default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Уведомление')
        verbose_name_plural = _('Уведомления')
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} — {self.user.username}'


class NotificationSetting(models.Model):
    user = models.OneToOneField(
        'accounts.User', on_delete=models.CASCADE,
        related_name='notification_settings'
    )
    email_notifications = models.BooleanField(
        _('Email уведомления'), default=True
    )
    push_notifications = models.BooleanField(
        _('Push уведомления'), default=True
    )
    daily_reminder = models.BooleanField(
        _('Ежедневное напоминание'), default=True
    )
    reminder_time = models.TimeField(
        _('Время напоминания'), default='10:00'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Настройка уведомлений')
        verbose_name_plural = _('Настройки уведомлений')

    def __str__(self):
        return f'Настройки {self.user.username}'
