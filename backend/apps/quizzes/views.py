import random
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.utils import timezone
from .models import Quiz, Question, Answer, QuizAttempt, UserAnswer
from .serializers import (
    QuizListSerializer, QuizDetailSerializer,
    QuizAttemptSerializer, QuizSubmitSerializer,
    UserAnswerSerializer, DiagnosticSubmitSerializer
)
from apps.core.permissions import IsAdminOrReadOnly


class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Quiz.objects.filter(is_published=True)
    lookup_field = 'slug'
    filter_backends = [
        DjangoFilterBackend, filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = ['category__slug', 'is_premium']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title', 'questions_count']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return QuizDetailSerializer
        return QuizListSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=False, methods=['get'])
    def diagnostic(self, request):
        """Return 5 random diagnostic questions from different categories for onboarding."""
        count = request.query_params.get('count', 5)
        try:
            count = min(int(count), 10)
        except (ValueError, TypeError):
            count = 5

        questions = Question.objects.filter(is_active=True).order_by('?')[:count]

        from .serializers import QuestionListSerializer
        serializer = QuestionListSerializer(questions, many=True, context={'request': request})
        return Response({
            'questions': serializer.data,
            'total': len(serializer.data),
        })

    @action(detail=False, methods=['post'])
    def diagnostic_submit(self, request):
        """Submit diagnostic test answers from onboarding and return results."""
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Необходимо авторизоваться'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = DiagnosticSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        answers_data = serializer.validated_data['answers']
        question_ids = list(answers_data.keys())
        questions = Question.objects.filter(id__in=question_ids, is_active=True)

        score = 0
        max_score = len(questions)
        results = []

        for question in questions:
            selected_ids = answers_data.get(str(question.id), [])
            if isinstance(selected_ids, int):
                selected_ids = [selected_ids]

            correct_ids = list(
                question.answers.filter(is_correct=True)
                .values_list('id', flat=True)
            )
            is_correct = set(selected_ids) == set(correct_ids) and len(selected_ids) > 0

            if is_correct:
                score += 1

            results.append({
                'question_id': question.id,
                'question_text': question.text,
                'selected_answer_ids': selected_ids,
                'correct_answer_ids': correct_ids,
                'is_correct': is_correct,
                'explanation': question.explanation,
            })

        percentage = round((score / max_score) * 100, 1) if max_score > 0 else 0
        is_passed = percentage >= 70

        # Update profile onboarding status
        profile = request.user.profile
        profile.onboarding_completed = True
        profile.total_tests_completed += 1
        profile.total_correct_answers += score
        profile.total_incorrect_answers += (max_score - score)

        # Save onboarding data (Step 1) — before XP to avoid double save
        if 'experience_level' in serializer.validated_data:
            profile.experience_level = serializer.validated_data['experience_level']
        if 'study_goal' in serializer.validated_data:
            profile.study_goal = serializer.validated_data['study_goal']
        if 'study_goal_minutes' in serializer.validated_data:
            profile.study_goal_minutes = serializer.validated_data['study_goal_minutes']
        profile.save(update_fields=[
            'onboarding_completed', 'total_tests_completed',
            'total_correct_answers', 'total_incorrect_answers',
            'experience_level', 'study_goal', 'study_goal_minutes',
        ])

        # Award XP (calls save() internally)
        profile.add_experience(score * 10)

        return Response({
            'score': score,
            'max_score': max_score,
            'percentage': percentage,
            'is_passed': is_passed,
            'results': results,
            'level': profile.level,
            'experience_points': profile.experience_points,
        })

    @action(detail=True, methods=['post'])
    def start(self, request, slug=None):
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Необходимо авторизоваться'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        quiz = self.get_object()

        attempt = QuizAttempt.objects.create(
            user=request.user,
            quiz=quiz,
            max_score=quiz.questions.count()
        )

        return Response({
            'attempt_id': attempt.id,
            'quiz': QuizDetailSerializer(quiz, context=self.get_serializer_context()).data,
            'started_at': attempt.started_at
        })

    @action(detail=True, methods=['post'])
    def submit(self, request, slug=None):
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Необходимо авторизоваться'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        quiz = self.get_object()
        attempt_id = request.data.get('attempt_id')

        try:
            attempt = QuizAttempt.objects.get(
                id=attempt_id, user=request.user, quiz=quiz,
                is_completed=False
            )
        except QuizAttempt.DoesNotExist:
            return Response(
                {'error': 'Попытка не найдена или уже завершена'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = QuizSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        answers_data = serializer.validated_data['answers']
        questions = quiz.questions.filter(is_active=True)
        score = 0
        max_score = questions.count()

        for question in questions:
            selected_ids = answers_data.get(str(question.id), [])
            if isinstance(selected_ids, int):
                selected_ids = [selected_ids]

            correct_ids = list(
                question.answers.filter(is_correct=True)
                .values_list('id', flat=True)
            )
            is_correct = set(selected_ids) == set(correct_ids) and len(selected_ids) > 0

            if is_correct:
                score += 1

            user_answer = UserAnswer.objects.create(
                attempt=attempt,
                question=question,
                is_correct=is_correct
            )
            user_answer.selected_answers.add(
                *Answer.objects.filter(id__in=selected_ids)
            )

        percentage = round((score / max_score) * 100, 1) if max_score > 0 else 0

        attempt.score = score
        attempt.max_score = max_score
        attempt.percentage = percentage
        attempt.answers = answers_data
        attempt.time_spent_seconds = serializer.validated_data['time_spent_seconds']
        attempt.is_passed = percentage >= quiz.passing_score
        attempt.is_completed = True
        attempt.completed_at = timezone.now()
        attempt.save()

        # Update user progress
        profile = request.user.profile
        profile.total_tests_completed += 1
        profile.total_correct_answers += score
        profile.total_incorrect_answers += (max_score - score)
        profile.add_experience(score * 10)

        # Update weak topics
        self._update_weak_topics(request.user, attempt)

        # Check for badges
        self._check_badges(request.user, quiz, attempt)

        return Response(QuizAttemptSerializer(attempt).data)

    def _update_weak_topics(self, user, attempt):
        """Update WeakTopic records based on wrong answers in this attempt."""
        from apps.progress.models import WeakTopic
        from django.db.models import F

        # Process wrong answers — increment both counters
        user_answers = UserAnswer.objects.filter(
            attempt=attempt, is_correct=False
        ).select_related('question__category')

        for user_answer in user_answers:
            category = user_answer.question.category
            if not category:
                continue

            WeakTopic.objects.get_or_create(
                user=user,
                category=category,
                defaults={'wrong_answers_count': 0, 'total_answers_count': 0}
            )
            WeakTopic.objects.filter(user=user, category=category).update(
                wrong_answers_count=F('wrong_answers_count') + 1,
                total_answers_count=F('total_answers_count') + 1,
            )

        # Process correct answers — increment only total_answers_count
        correct_answers = UserAnswer.objects.filter(
            attempt=attempt, is_correct=True
        ).select_related('question__category')

        for user_answer in correct_answers:
            category = user_answer.question.category
            if not category:
                continue

            WeakTopic.objects.get_or_create(
                user=user,
                category=category,
                defaults={'wrong_answers_count': 0, 'total_answers_count': 0}
            )
            WeakTopic.objects.filter(user=user, category=category).update(
                total_answers_count=F('total_answers_count') + 1,
            )

    def _check_badges(self, user, quiz, attempt):
        """Check and award badges based on performance."""
        from apps.accounts.models import UserBadge

        # Perfect score badge
        if attempt.percentage == 100:
            UserBadge.objects.get_or_create(
                user=user,
                name='Идеальный тест',
                defaults={
                    'description': 'Пройди тест без единой ошибки',
                    'icon': '✨',
                }
            )

        # Speed demon badge (completed under 5 min with pass)
        if attempt.time_spent_seconds < 300 and attempt.is_passed:
            UserBadge.objects.get_or_create(
                user=user,
                name='Скорость',
                defaults={
                    'description': 'Пройди тест быстрее 5 минут',
                    'icon': '⚡',
                }
            )

        # First attempt badge
        UserBadge.objects.get_or_create(
            user=user,
            name='Первый тест',
            defaults={
                'description': 'Пройди первый тест',
                'icon': '🎯',
            }
        )


class QuizAttemptViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return QuizAttempt.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        return QuizAttemptSerializer

    @action(detail=True, methods=['get'])
    def details(self, request, pk=None):
        attempt = self.get_object()
        user_answers = UserAnswer.objects.filter(attempt=attempt)
        return Response({
            'attempt': QuizAttemptSerializer(attempt).data,
            'answers': UserAnswerSerializer(user_answers, many=True).data
        })
