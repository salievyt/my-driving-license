from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import Article, ArticleCategory, ArticleComment
from .serializers import (
    ArticleListSerializer, ArticleDetailSerializer,
    ArticleCategorySerializer, ArticleCommentSerializer
)
from apps.core.permissions import IsAdminOrReadOnly


class ArticleCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ArticleCategory.objects.filter(is_active=True)
    serializer_class = ArticleCategorySerializer
    lookup_field = 'slug'


class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Article.objects.filter(is_published=True)
    lookup_field = 'slug'
    filter_backends = [
        DjangoFilterBackend, filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = ['category__slug']
    search_fields = ['title', 'summary', 'content']
    ordering_fields = ['created_at', 'views_count']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ArticleDetailSerializer
        return ArticleListSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['get', 'post'])
    def comments(self, request, slug=None):
        article = self.get_object()

        if request.method == 'GET':
            comments = article.comments.filter(is_approved=True)
            return Response(
                ArticleCommentSerializer(comments, many=True).data
            )

        if not request.user.is_authenticated:
            return Response(
                {'error': 'Необходимо авторизоваться'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = ArticleCommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(article=article, author=request.user)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )
