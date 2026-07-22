from rest_framework import serializers
from .models import SubscriptionPlan, UserSubscription


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    savings_percent = serializers.SerializerMethodField()

    class Meta:
        model = SubscriptionPlan
        fields = [
            'id', 'name', 'slug', 'description',
            'price', 'old_price', 'duration_days',
            'has_premium_lessons', 'has_unlimited_quizzes',
            'has_detailed_statistics', 'has_certificate',
            'has_priority_support', 'savings_percent',
            'order', 'is_active'
        ]

    def get_savings_percent(self, obj):
        if obj.old_price:
            return int((1 - float(obj.price) / float(obj.old_price)) * 100)
        return 0


class UserSubscriptionSerializer(serializers.ModelSerializer):
    plan = SubscriptionPlanSerializer(read_only=True)
    days_remaining = serializers.ReadOnlyField()

    class Meta:
        model = UserSubscription
        fields = [
            'id', 'plan', 'is_active', 'start_date',
            'end_date', 'days_remaining', 'auto_renew'
        ]
        read_only_fields = ['id', 'start_date']
