from django.contrib import admin
from .models import Article, ArticleCategory, ArticleComment


@admin.register(ArticleCategory)
class ArticleCategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title',)}
    list_display = ['title', 'articles_count', 'is_active']
    search_fields = ['title']

    def articles_count(self, obj):
        return obj.articles.filter(is_published=True).count()
    articles_count.short_description = 'Статей'


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title',)}
    list_display = [
        'title', 'author', 'category',
        'is_published', 'views_count',
        'reading_time_minutes', 'created_at'
    ]
    list_filter = ['is_published', 'category', 'created_at']
    search_fields = ['title', 'content', 'summary']
    readonly_fields = ['views_count', 'created_at']
    date_hierarchy = 'created_at'


@admin.register(ArticleComment)
class ArticleCommentAdmin(admin.ModelAdmin):
    list_display = ['author', 'article', 'is_approved', 'created_at']
    list_filter = ['is_approved', 'created_at']
    search_fields = ['text', 'author__username']
