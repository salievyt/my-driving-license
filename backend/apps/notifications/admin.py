from django.contrib import admin
from .models import Notification, NotificationSetting


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'title', 'notification_type',
        'is_read', 'created_at'
    ]
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['user__username', 'title', 'message']
    readonly_fields = ['created_at']


@admin.register(NotificationSetting)
class NotificationSettingAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'email_notifications',
        'push_notifications', 'daily_reminder'
    ]
    search_fields = ['user__username']
