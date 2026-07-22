from rest_framework import serializers
from .models import UserProgress, WeakTopic, StudySession, Achievement


class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = [
            'total_lessons_completed', 'total_quizzes_passed',
            'total_quizzes_attempted', 'current_streak',
            'longest_streak', 'last_study_date',
            'study_hours_total'
        ]
        read_only_fields = fields


class WeakTopicSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    category_slug = serializers.SerializerMethodField()

    class Meta:
        model = WeakTopic
        fields = [
            'id', 'category', 'category_name', 'category_slug',
            'wrong_answers_count', 'total_answers_count',
            'weakness_percentage'
        ]

    def get_category_name(self, obj):
        return obj.category.title

    def get_category_slug(self, obj):
        return obj.category.slug


class StudySessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudySession
        fields = [
            'id', 'date', 'duration_minutes',
            'lessons_completed', 'quizzes_completed',
            'questions_answered', 'points_earned'
        ]
        read_only_fields = ['id', 'date']


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = [
            'id', 'title', 'description', 'icon',
            'category', 'points_reward', 'earned_at'
        ]


class ProgressDashboardSerializer(serializers.Serializer):
    overall_progress = UserProgressSerializer()
    weak_topics = WeakTopicSerializer(many=True)
    recent_sessions = StudySessionSerializer(many=True)
    achievements = AchievementSerializer(many=True)
    level = serializers.IntegerField()
    experience_points = serializers.IntegerField()
    next_level_xp = serializers.IntegerField()
    accuracy = serializers.FloatField()
