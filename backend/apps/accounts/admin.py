from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, Profile, UserBadge


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = [
        'username', 'email', 'role', 'get_full_name',
        'is_active', 'date_joined'
    ]
    list_filter = ['role', 'is_active', 'is_staff', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-date_joined']

    fieldsets = BaseUserAdmin.fieldsets + (
        (_('Дополнительно'), {
            'fields': ('role', 'avatar', 'phone', 'email_verified')
        }),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        (_('Дополнительно'), {
            'fields': ('role', 'phone', 'email'),
        }),
    )


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'level', 'experience_points',
        'streak_days', 'accuracy', 'total_tests_completed'
    ]
    list_filter = ['level', 'last_active_date']
    search_fields = ['user__username', 'user__email']
    readonly_fields = [
        'level', 'experience_points', 'streak_days',
        'total_tests_completed', 'total_correct_answers',
        'total_incorrect_answers', 'last_active_date'
    ]


@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'earned_at']
    list_filter = ['earned_at']
    search_fields = ['name', 'user__username']
