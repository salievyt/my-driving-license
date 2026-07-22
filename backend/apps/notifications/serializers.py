from rest_framework import serializers
from .models import Notification, NotificationSetting


class NotificationSerializer(serializers.ModelSerializer):
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'message', 'notification_type',
            'link', 'is_read', 'time_ago', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def get_time_ago(self, obj):
        from django.utils import timezone
        delta = timezone.now() - obj.created_at
        if delta.days > 0:
            return f'{delta.days} дн. назад'
        if delta.seconds >= 3600:
            return f'{delta.seconds // 3600} ч. назад'
        if delta.seconds >= 60:
            return f'{delta.seconds // 60} мин. назад'
        return 'только что'


class NotificationSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationSetting
        fields = [
            'email_notifications', 'push_notifications',
            'daily_reminder', 'reminder_time'
        ]


class NotificationMarkReadSerializer(serializers.Serializer):
    notification_ids = serializers.ListField(
        child=serializers.IntegerField(), required=False
    )
    all = serializers.BooleanField(default=False)
