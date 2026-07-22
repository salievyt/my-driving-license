from django.contrib import admin
from .models import SubscriptionPlan, UserSubscription


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'price', 'duration_days',
        'has_premium_lessons', 'has_unlimited_quizzes',
        'has_detailed_statistics', 'is_active', 'order'
    ]
    list_filter = ['is_active', 'has_premium_lessons']
    search_fields = ['name', 'description']


@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'plan', 'is_active',
        'start_date', 'end_date',
        'auto_renew', 'payment_method'
    ]
    list_filter = ['is_active', 'auto_renew', 'start_date']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['start_date']
