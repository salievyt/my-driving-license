from django.contrib import admin
from .models import Category, Tag, Lesson, LessonProgress


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title',)}
    list_display = ['title', 'order', 'is_active', 'lessons_count']
    list_filter = ['is_active']
    search_fields = ['title']

    def lessons_count(self, obj):
        return obj.lessons.filter(is_published=True).count()
    lessons_count.short_description = 'Уроков'


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    list_display = ['name', 'slug']
    search_fields = ['name']


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title',)}
    list_display = [
        'title', 'category', 'difficulty',
        'is_premium', 'is_published', 'views_count', 'order'
    ]
    list_filter = ['category', 'difficulty', 'is_premium', 'is_published']
    search_fields = ['title', 'summary', 'content']
    readonly_fields = ['views_count']
    fieldsets = (
        ('Основное', {
            'fields': (
                'category', 'tags', 'title', 'slug',
                'summary', 'content'
            )
        }),
        ('Медиа', {
            'fields': ('cover_image', 'video_url'),
            'classes': ('collapse',)
        }),
        ('Настройки', {
            'fields': (
                'difficulty', 'duration_minutes',
                'is_premium', 'is_published', 'order'
            )
        }),
        ('Статистика', {
            'fields': ('views_count',),
            'classes': ('collapse',)
        }),
    )


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'lesson', 'is_completed', 'time_spent_minutes']
    list_filter = ['is_completed']
    search_fields = ['user__username', 'lesson__title']
