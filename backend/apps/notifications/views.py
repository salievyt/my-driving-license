import random
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Notification, NotificationSetting
from .serializers import (
    NotificationSerializer, NotificationSettingSerializer,
    NotificationMarkReadSerializer
)
from apps.quizzes.models import Question
from apps.quizzes.serializers import QuestionListSerializer


class NotificationViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def list(self, request):
        notifications = self.get_queryset().order_by('-created_at')[:50]
        unread_count = self.get_queryset().filter(is_read=False).count()
        return Response({
            'notifications': NotificationSerializer(notifications, many=True).data,
            'unread_count': unread_count,
            'total_count': self.get_queryset().count()
        })

    @action(detail=False, methods=['post'])
    def mark_read(self, request):
        serializer = NotificationMarkReadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if serializer.validated_data.get('all'):
            self.get_queryset().filter(is_read=False).update(is_read=True)
        elif serializer.validated_data.get('notification_ids'):
            self.get_queryset().filter(
                id__in=serializer.validated_data['notification_ids']
            ).update(is_read=True)

        return Response({'status': 'ok'})

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        count = self.get_queryset().filter(is_read=False).count()
        return Response({'unread_count': count})

    @action(detail=True, methods=['post'])
    def read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(NotificationSerializer(notification).data)


class NotificationSettingViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSettingSerializer

    def get_object(self):
        setting, _ = NotificationSetting.objects.get_or_create(
            user=self.request.user
        )
        return setting

    def list(self, request):
        return Response(self.get_serializer(self.get_object()).data)

    def update(self, request):
        setting = self.get_object()
        serializer = self.get_serializer(setting, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class DailyQuestionView(APIView):
    """Return today's daily question."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()

        # Deterministic question selection based on date
        questions = Question.objects.filter(is_active=True)
        if not questions.exists():
            return Response({'question': None, 'message': 'Нет доступных вопросов'})

        day_of_year = today.timetuple().tm_yday
        random.seed(day_of_year)
        question = questions[random.randint(0, questions.count() - 1)]
        random.seed()

        # Check if user already answered today
        already_answered = Notification.objects.filter(
            user=request.user,
            notification_type='daily_question',
            created_at__date=today,
        ).exists()

        serializer = QuestionListSerializer(question, context={'request': request})
        return Response({
            'question': serializer.data,
            'already_answered': already_answered,
            'date': today.isoformat(),
        })


class DailyQuestionAnswerView(APIView):
    """Submit answer for the daily question."""
    permission_classes = [IsAuthenticated]

    def post(self, request, question_id):
        today = timezone.now().date()

        # Check already answered
        already_answered = Notification.objects.filter(
            user=request.user,
            notification_type='daily_question',
            created_at__date=today,
        ).exists()

        if already_answered:
            return Response({'error': 'Вы уже ответили на вопрос дня'}, status=400)

        try:
            question = Question.objects.get(id=question_id, is_active=True)
        except Question.DoesNotExist:
            return Response({'error': 'Вопрос не найден'}, status=404)

        selected_ids = request.data.get('answer_ids', [])
        if isinstance(selected_ids, int):
            selected_ids = [selected_ids]

        correct_ids = list(
            question.answers.filter(is_correct=True)
            .values_list('id', flat=True)
        )
        is_correct = set(selected_ids) == set(correct_ids) and len(selected_ids) > 0

        # Update profile stats
        profile = request.user.profile
        profile.total_tests_completed += 1  # Counts as a mini-test
        if is_correct:
            profile.total_correct_answers += 1
            xp = 20
        else:
            profile.total_incorrect_answers += 1
            xp = 5
        profile.add_experience(xp)

        # Create notification record to mark as answered
        Notification.objects.create(
            user=request.user,
            title='❓ Вопрос дня' + (' ✅' if is_correct else ' ❌'),
            message=f'{"Верно!" if is_correct else "Неверно."} {question.explanation}' if question.explanation else '',
            notification_type='daily_question',
        )

        return Response({
            'is_correct': is_correct,
            'correct_answer_ids': correct_ids,
            'explanation': question.explanation,
            'xp_earned': xp,
            'streak_days': profile.streak_days,
        })
