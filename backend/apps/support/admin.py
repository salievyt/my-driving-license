from django.contrib import admin
from .models import FAQ, SupportTicket, TicketMessage


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'category', 'order', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['question', 'answer']


@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = [
        'subject', 'user', 'status', 'priority',
        'created_at', 'resolved_at'
    ]
    list_filter = ['status', 'priority', 'created_at']
    search_fields = ['subject', 'message', 'user__username']


@admin.register(TicketMessage)
class TicketMessageAdmin(admin.ModelAdmin):
    list_display = ['ticket', 'author', 'is_staff_reply', 'created_at']
    list_filter = ['is_staff_reply', 'created_at']
    search_fields = ['message']
