from rest_framework import serializers
from .models import Article, ArticleCategory, ArticleComment


class ArticleCategorySerializer(serializers.ModelSerializer):
    articles_count = serializers.SerializerMethodField()

    class Meta:
        model = ArticleCategory
        fields = [
            'id', 'title', 'slug', 'description',
            'icon', 'articles_count'
        ]

    def get_articles_count(self, obj):
        return obj.articles.filter(is_published=True).count()


class ArticleListSerializer(serializers.ModelSerializer):
    category = ArticleCategorySerializer(read_only=True)
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'summary',
            'category', 'author_name', 'cover_image',
            'reading_time_minutes', 'views_count',
            'created_at'
        ]

    def get_author_name(self, obj):
        return obj.author.get_full_name() or obj.author.username


class ArticleDetailSerializer(serializers.ModelSerializer):
    category = ArticleCategorySerializer(read_only=True)
    author_name = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'summary', 'content',
            'category', 'author_name', 'cover_image',
            'reading_time_minutes', 'views_count',
            'is_published', 'comments_count',
            'created_at', 'updated_at'
        ]

    def get_author_name(self, obj):
        return obj.author.get_full_name() or obj.author.username

    def get_comments_count(self, obj):
        return obj.comments.filter(is_approved=True).count()


class ArticleCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = ArticleComment
        fields = [
            'id', 'article', 'author', 'author_name',
            'text', 'created_at'
        ]
        read_only_fields = ['id', 'author', 'created_at']

    def get_author_name(self, obj):
        return obj.author.get_full_name() or obj.author.username
