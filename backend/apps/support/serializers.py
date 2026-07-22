from rest_framework import serializers
from .models import FAQ, SupportTicket, TicketMessage


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = [
            'id', 'question', 'answer',
            'category', 'order', 'is_active'
        ]


class TicketMessageSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_avatar = serializers.SerializerMethodField()

    class Meta:
        model = TicketMessage
        fields = [
            'id', 'author', 'author_name', 'author_avatar',
            'message', 'is_staff_reply', 'created_at'
        ]
        read_only_fields = ['id', 'author', 'created_at']

    def get_author_name(self, obj):
        return obj.author.get_full_name() or obj.author.username

    def get_author_avatar(self, obj):
        if obj.author.avatar:
            return obj.author.avatar.url
        return None


class SupportTicketSerializer(serializers.ModelSerializer):
    messages = TicketMessageSerializer(many=True, read_only=True)
    status_display = serializers.SerializerMethodField()
    priority_display = serializers.SerializerMethodField()

    class Meta:
        model = SupportTicket
        fields = [
            'id', 'subject', 'message', 'status', 'status_display',
            'priority', 'priority_display', 'category',
            'messages', 'created_at', 'updated_at', 'resolved_at'
        ]
        read_only_fields = [
            'id', 'user', 'status', 'created_at',
            'updated_at', 'resolved_at', 'messages'
        ]

    def get_status_display(self, obj):
        return obj.get_status_display()

    def get_priority_display(self, obj):
        return obj.get_priority_display()


class SupportTicketCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicket
        fields = ['subject', 'message', 'priority', 'category']


class TicketMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketMessage
        fields = ['message']
