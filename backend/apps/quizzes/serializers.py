from rest_framework import serializers
from .models import Quiz, Question, Answer, QuizAttempt, UserAnswer


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text', 'order', 'is_correct']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if request and request.method == 'GET' and 'answer' in request.path:
            pass
        return data


class AnswerPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text', 'order']


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = [
            'id', 'text', 'image', 'explanation',
            'difficulty', 'order', 'answers'
        ]


class QuestionListSerializer(serializers.ModelSerializer):
    answers = AnswerPublicSerializer(many=True, read_only=True)
    has_image = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = [
            'id', 'text', 'has_image', 'difficulty', 'order', 'answers'
        ]

    def get_has_image(self, obj):
        return bool(obj.image)


class QuizListSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    attempts_count = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = [
            'id', 'title', 'slug', 'description',
            'category_name', 'questions_count',
            'time_limit_minutes', 'passing_score',
            'is_premium', 'attempts_count', 'created_at'
        ]

    def get_category_name(self, obj):
        return obj.category.title if obj.category else None

    def get_attempts_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.attempts.filter(user=request.user).count()
        return 0


class QuizDetailSerializer(serializers.ModelSerializer):
    questions = QuestionListSerializer(many=True, read_only=True)
    category = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = [
            'id', 'title', 'slug', 'description',
            'category', 'questions_count',
            'time_limit_minutes', 'passing_score',
            'is_premium', 'questions', 'created_at'
        ]

    def get_category(self, obj):
        if obj.category:
            from apps.lessons.serializers import CategorySerializer
            return CategorySerializer(obj.category).data
        return None


class QuizAttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.SerializerMethodField()
    quiz_slug = serializers.SerializerMethodField()

    class Meta:
        model = QuizAttempt
        fields = [
            'id', 'quiz', 'quiz_title', 'quiz_slug',
            'score', 'max_score', 'percentage',
            'time_spent_seconds', 'is_passed', 'is_completed',
            'started_at', 'completed_at'
        ]
        read_only_fields = [
            'id', 'user', 'score', 'max_score', 'percentage',
            'is_passed', 'started_at', 'completed_at', 'answers'
        ]

    def get_quiz_title(self, obj):
        return obj.quiz.title

    def get_quiz_slug(self, obj):
        return obj.quiz.slug


class QuizSubmitSerializer(serializers.Serializer):
    answers = serializers.JSONField()
    time_spent_seconds = serializers.IntegerField(min_value=0)


class DiagnosticSubmitSerializer(serializers.Serializer):
    answers = serializers.JSONField()
    experience_level = serializers.ChoiceField(
        choices=['beginner', 'intermediate', 'advanced'], required=False
    )
    study_goal = serializers.ChoiceField(
        choices=['exam', 'full', 'refresh'], required=False
    )
    study_goal_minutes = serializers.IntegerField(min_value=5, max_value=120, required=False)


class UserAnswerSerializer(serializers.ModelSerializer):
    question_text = serializers.SerializerMethodField()
    correct_answer_ids = serializers.SerializerMethodField()
    selected_answer_ids = serializers.SerializerMethodField()

    class Meta:
        model = UserAnswer
        fields = [
            'id', 'question', 'question_text',
            'selected_answer_ids', 'correct_answer_ids',
            'is_correct', 'answered_at'
        ]

    def get_question_text(self, obj):
        return obj.question.text

    def get_correct_answer_ids(self, obj):
        return list(obj.question.answers.filter(is_correct=True).values_list('id', flat=True))

    def get_selected_answer_ids(self, obj):
        return list(obj.selected_answers.values_list('id', flat=True))
