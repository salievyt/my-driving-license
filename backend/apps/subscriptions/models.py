from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone


class SubscriptionPlan(models.Model):
    name = models.CharField(_('Название'), max_length=200)
    slug = models.SlugField(max_length=250, unique=True)
    description = models.TextField(_('Описание'), blank=True)
    price = models.DecimalField(
        _('Цена'), max_digits=10, decimal_places=2
    )
    old_price = models.DecimalField(
        _('Старая цена'), max_digits=10, decimal_places=2,
        blank=True, null=True, help_text='Для отображения скидки'
    )
    duration_days = models.PositiveIntegerField(
        _('Длительность (дни)'), default=30
    )
    has_premium_lessons = models.BooleanField(
        _('Премиум уроки'), default=False
    )
    has_unlimited_quizzes = models.BooleanField(
        _('Безлимитные тесты'), default=True
    )
    has_detailed_statistics = models.BooleanField(
        _('Детальная статистика'), default=False
    )
    has_certificate = models.BooleanField(
        _('Сертификат'), default=False
    )
    has_priority_support = models.BooleanField(
        _('Приоритетная поддержка'), default=False
    )
    is_active = models.BooleanField(_('Активен'), default=True)
    order = models.PositiveIntegerField(_('Порядок'), default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Тарифный план')
        verbose_name_plural = _('Тарифные планы')
        ordering = ['order', 'price']

    def __str__(self):
        return f'{self.name} — {self.price}₽'

    @property
    def price_per_month(self):
        months = self.duration_days / 30
        if months == 0:
            return self.price
        return round(self.price / months, 2)


class UserSubscription(models.Model):
    user = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE,
        related_name='subscriptions'
    )
    plan = models.ForeignKey(
        SubscriptionPlan, on_delete=models.SET_NULL,
        null=True, related_name='user_subscriptions'
    )
    is_active = models.BooleanField(_('Активна'), default=True)
    start_date = models.DateTimeField(
        _('Дата начала'), auto_now_add=True
    )
    end_date = models.DateTimeField(_('Дата окончания'))
    auto_renew = models.BooleanField(
        _('Автопродление'), default=False
    )
    payment_method = models.CharField(
        _('Способ оплаты'), max_length=50, blank=True
    )
    payment_id = models.CharField(
        _('ID платежа'), max_length=255, blank=True
    )

    class Meta:
        verbose_name = _('Подписка пользователя')
        verbose_name_plural = _('Подписки пользователей')
        ordering = ['-start_date']

    def __str__(self):
        return f'{self.user.username} — {self.plan.name}'

    @property
    def days_remaining(self):
        if self.end_date < timezone.now():
            return 0
        return (self.end_date - timezone.now()).days
