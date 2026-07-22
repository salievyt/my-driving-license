from rest_framework import serializers
from .models import Category, Tag, Lesson, LessonProgress


class CategorySerializer(serializers.ModelSerializer):
    lessons_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'title', 'slug', 'description',
            'icon', 'color', 'order', 'lessons_count'
        ]

    def get_lessons_count(self, obj):
        return obj.lessons.filter(is_published=True).count()


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']


class LessonListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'slug', 'summary', 'category',
            'tags', 'difficulty', 'duration_minutes',
            'cover_image', 'is_premium', 'views_count',
            'order', 'is_completed', 'created_at'
        ]

    def get_is_completed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                return obj.user_progress.get(
                    user=request.user, is_completed=True
                ).exists()
            except:
                pass
        return False


class LessonDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    user_progress = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'slug', 'summary', 'content',
            'category', 'tags', 'difficulty', 'duration_minutes',
            'cover_image', 'video_url', 'is_premium',
            'is_published', 'views_count', 'order',
            'user_progress', 'created_at', 'updated_at'
        ]

    def get_user_progress(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                progress = obj.user_progress.get(user=request.user)
                return {
                    'is_completed': progress.is_completed,
                    'time_spent_minutes': progress.time_spent_minutes
                }
            except LessonProgress.DoesNotExist:
                pass
        return {'is_completed': False, 'time_spent_minutes': 0}


class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ['id', 'lesson', 'is_completed', 'time_spent_minutes']
        read_only_fields = ['user']


class LessonProgressUpdateSerializer(serializers.Serializer):
    is_completed = serializers.BooleanField(required=False)
    time_spent_minutes = serializers.IntegerField(required=False, min_value=0)
