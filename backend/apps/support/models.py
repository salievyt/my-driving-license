from django.db import models
from django.utils.translation import gettext_lazy as _


class FAQ(models.Model):
    class Category(models.TextChoices):
        GENERAL = 'general', _('Общие вопросы')
        ACCOUNT = 'account', _('Аккаунт')
        SUBSCRIPTION = 'subscription', _('Подписка')
        TEST = 'test', _('Тестирование')
        TECHNICAL = 'technical', _('Технические вопросы')

    question = models.CharField(_('Вопрос'), max_length=300)
    answer = models.TextField(_('Ответ'))
    category = models.CharField(
        _('Категория'), max_length=20,
        choices=Category.choices, default=Category.GENERAL
    )
    order = models.PositiveIntegerField(_('Порядок'), default=0)
    is_active = models.BooleanField(_('Активен'), default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('FAQ')
        verbose_name_plural = _('FAQ')
        ordering = ['category', 'order']

    def __str__(self):
        return self.question


class SupportTicket(models.Model):
    class Status(models.TextChoices):
        OPEN = 'open', _('Открыт')
        IN_PROGRESS = 'in_progress', _('В работе')
        RESOLVED = 'resolved', _('Решён')
        CLOSED = 'closed', _('Закрыт')

    class Priority(models.TextChoices):
        LOW = 'low', _('Низкий')
        MEDIUM = 'medium', _('Средний')
        HIGH = 'high', _('Высокий')

    user = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE,
        related_name='support_tickets'
    )
    subject = models.CharField(_('Тема'), max_length=300)
    message = models.TextField(_('Сообщение'))
    status = models.CharField(
        _('Статус'), max_length=20,
        choices=Status.choices, default=Status.OPEN
    )
    priority = models.CharField(
        _('Приоритет'), max_length=10,
        choices=Priority.choices, default=Priority.MEDIUM
    )
    category = models.CharField(
        _('Категория'), max_length=50, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(
        _('Решён в'), null=True, blank=True
    )

    class Meta:
        verbose_name = _('Тикет поддержки')
        verbose_name_plural = _('Тикеты поддержки')
        ordering = ['-created_at']

    def __str__(self):
        return f'[{self.get_status_display()}] {self.subject}'


class TicketMessage(models.Model):
    ticket = models.ForeignKey(
        SupportTicket, on_delete=models.CASCADE,
        related_name='messages'
    )
    author = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE
    )
    message = models.TextField(_('Сообщение'))
    is_staff_reply = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Сообщение тикета')
        verbose_name_plural = _('Сообщения тикетов')
        ordering = ['created_at']

    def __str__(self):
        return f'{self.author.username}: {self.message[:50]}...'
