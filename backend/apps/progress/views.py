from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import UserProgress, WeakTopic, StudySession, Achievement
from .serializers import (
    UserProgressSerializer, WeakTopicSerializer,
    StudySessionSerializer, AchievementSerializer,
    ProgressDashboardSerializer
)
from apps.accounts.serializers import UserBadgeSerializer


class ProgressViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProgress.objects.filter(user=self.request.user)

    def list(self, request):
        progress, _ = UserProgress.objects.get_or_create(user=request.user)
        return Response(UserProgressSerializer(progress).data)

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        progress, _ = UserProgress.objects.get_or_create(user=request.user)
        profile = request.user.profile

        weak_topics = WeakTopic.objects.filter(
            user=request.user
        ).order_by('-weakness_percentage')[:5]

        recent_sessions = StudySession.objects.filter(
            user=request.user
        )[:10]

        achievements = Achievement.objects.filter(user=request.user)

        data = ProgressDashboardSerializer({
            'overall_progress': progress,
            'weak_topics': weak_topics,
            'recent_sessions': recent_sessions,
            'achievements': achievements,
            'level': profile.level,
            'experience_points': profile.experience_points,
            'next_level_xp': profile.next_level_xp,
            'accuracy': profile.accuracy,
        }).data

        return Response(data)

    @action(detail=False, methods=['get'])
    def weak_topics(self, request):
        topics = WeakTopic.objects.filter(
            user=request.user
        ).order_by('-weakness_percentage')
        return Response(WeakTopicSerializer(topics, many=True).data)

    @action(detail=False, methods=['get'])
    def study_sessions(self, request):
        sessions = StudySession.objects.filter(
            user=request.user
        ).order_by('-date')[:30]
        return Response(StudySessionSerializer(sessions, many=True).data)

    @action(detail=False, methods=['get'])
    def achievements(self, request):
        achievements = Achievement.objects.filter(user=request.user)
        badges = request.user.badges.all()
        return Response({
            'achievements': AchievementSerializer(achievements, many=True).data,
            'badges': UserBadgeSerializer(badges, many=True).data,
        })

    @action(detail=False, methods=['post'])
    def log_session(self, request):
        serializer = StudySessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        session = serializer.save(user=request.user)

        # Update user progress
        progress, _ = UserProgress.objects.get_or_create(user=request.user)
        progress.total_lessons_completed += session.lessons_completed
        progress.total_quizzes_attempted += session.quizzes_completed
        progress.total_quizzes_passed += session.quizzes_completed
        progress.study_hours_total += session.duration_minutes / 60

        today = timezone.now().date()
        if progress.last_study_date == today - timezone.timedelta(days=1):
            progress.current_streak += 1
            if progress.current_streak > progress.longest_streak:
                progress.longest_streak = progress.current_streak
        elif progress.last_study_date != today:
            progress.current_streak = 1

        progress.last_study_date = today
        progress.save()

        # Award XP
        profile = request.user.profile
        xp_reward = session.duration_minutes * 5 + session.questions_answered * 2
        profile.add_experience(xp_reward)

        return Response(
            StudySessionSerializer(session).data,
            status=status.HTTP_201_CREATED
        )
