from django.contrib import admin
from .models import UserProgress, WeakTopic, StudySession, Achievement


@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'total_lessons_completed',
        'total_quizzes_passed', 'current_streak',
        'longest_streak', 'study_hours_total'
    ]
    search_fields = ['user__username', 'user__email']
    readonly_fields = [f.name for f in UserProgress._meta.fields if f.name != 'id']


@admin.register(WeakTopic)
class WeakTopicAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'category', 'weakness_percentage',
        'wrong_answers_count', 'total_answers_count'
    ]
    list_filter = ['category']
    search_fields = ['user__username', 'category__title']


@admin.register(StudySession)
class StudySessionAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'date', 'duration_minutes',
        'lessons_completed', 'quizzes_completed',
        'points_earned'
    ]
    list_filter = ['date']
    search_fields = ['user__username']


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'category', 'points_reward', 'earned_at']
    list_filter = ['category', 'earned_at']
    search_fields = ['title', 'user__username']
