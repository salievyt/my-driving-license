from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import Category, Tag, Lesson, LessonProgress
from .serializers import (
    CategorySerializer, TagSerializer,
    LessonListSerializer, LessonDetailSerializer,
    LessonProgressSerializer, LessonProgressUpdateSerializer
)
from apps.core.permissions import IsAdminOrReadOnly


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = 'slug'


class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Lesson.objects.filter(is_published=True)
    lookup_field = 'slug'
    filter_backends = [
        DjangoFilterBackend, filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = ['category__slug', 'difficulty', 'is_premium', 'tags__slug']
    search_fields = ['title', 'summary', 'content']
    ordering_fields = ['order', 'created_at', 'views_count', 'duration_minutes']
    ordering = ['category', 'order']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LessonDetailSerializer
        return LessonListSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class LessonProgressViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    permission_classes = [IsAuthenticated]
    serializer_class = LessonProgressSerializer

    def get_queryset(self):
        return LessonProgress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def update_progress(self, request):
        lesson_slug = request.data.get('lesson_slug')
        try:
            lesson = Lesson.objects.get(slug=lesson_slug)
        except Lesson.DoesNotExist:
            return Response({'error': 'Урок не найден'}, status=404)

        progress, created = LessonProgress.objects.get_or_create(
            user=request.user, lesson=lesson
        )

        serializer = LessonProgressUpdateSerializer(
            progress, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)

        if 'is_completed' in serializer.validated_data:
            progress.is_completed = serializer.validated_data['is_completed']
            if progress.is_completed and not created:
                from django.utils import timezone
                progress.completed_at = timezone.now()

        if 'time_spent_minutes' in serializer.validated_data:
            progress.time_spent_minutes += serializer.validated_data['time_spent_minutes']

        progress.save()

        return Response(LessonProgressSerializer(progress).data)
