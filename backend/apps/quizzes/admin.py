from django.contrib import admin
from .models import Quiz, Question, Answer, QuizAttempt, UserAnswer


class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 4
    min_num = 2
    fields = ['text', 'is_correct', 'order']


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title',)}
    list_display = [
        'title', 'category', 'questions_count_actual',
        'time_limit_minutes', 'passing_score',
        'is_premium', 'is_published'
    ]
    list_filter = ['is_premium', 'is_published', 'category']
    search_fields = ['title', 'description']

    def questions_count_actual(self, obj):
        return obj.questions.count()
    questions_count_actual.short_description = 'Вопросов'


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    inlines = [AnswerInline]
    list_display = ['short_text', 'quiz', 'difficulty', 'is_active']
    list_filter = ['difficulty', 'is_active', 'category']
    search_fields = ['text']
    list_select_related = ['quiz']

    def short_text(self, obj):
        return obj.text[:80] + '...' if len(obj.text) > 80 else obj.text
    short_text.short_description = 'Вопрос'


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['short_text', 'question', 'is_correct', 'order']
    list_filter = ['is_correct']
    search_fields = ['text']

    def short_text(self, obj):
        return obj.text[:60] + '...' if len(obj.text) > 60 else obj.text
    short_text.short_description = 'Ответ'


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'quiz', 'percentage',
        'is_passed', 'is_completed', 'started_at'
    ]
    list_filter = ['is_passed', 'is_completed', 'started_at']
    search_fields = ['user__username', 'quiz__title']
    readonly_fields = [
        'user', 'quiz', 'score', 'max_score',
        'percentage', 'time_spent_seconds',
        'is_passed', 'started_at', 'completed_at'
    ]
