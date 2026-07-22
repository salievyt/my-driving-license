from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Profile, UserBadge

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'avatar', 'phone', 'date_joined'
        ]
        read_only_fields = ['id', 'date_joined']


class UserDetailSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    badges = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'avatar', 'phone', 'date_joined',
            'profile', 'badges'
        ]
        read_only_fields = ['id', 'date_joined']

    def get_profile(self, obj):
        return ProfileSerializer(obj.profile).data

    def get_badges(self, obj):
        return UserBadgeSerializer(obj.badges.all(), many=True).data


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password',
            'password_confirm', 'first_name', 'last_name'
        ]

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError('Пароли не совпадают')
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        # Profile, UserProgress, and NotificationSetting
        # are auto-created via post_save signal
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class ProfileSerializer(serializers.ModelSerializer):
    accuracy = serializers.ReadOnlyField()

    class Meta:
        model = Profile
        fields = [
            'level', 'experience_points', 'streak_days',
            'total_tests_completed', 'total_correct_answers',
            'total_incorrect_answers', 'accuracy',
            'bio', 'last_active_date',
            'experience_level', 'study_goal', 'study_goal_minutes',
        ]
        read_only_fields = [
            'level', 'experience_points', 'streak_days',
            'total_tests_completed', 'total_correct_answers',
            'total_incorrect_answers', 'accuracy', 'last_active_date'
        ]


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'experience_level', 'study_goal', 'study_goal_minutes']


class OnboardingStep1Serializer(serializers.Serializer):
    experience_level = serializers.ChoiceField(
        choices=['beginner', 'intermediate', 'advanced']
    )
    study_goal = serializers.ChoiceField(
        choices=['exam', 'full', 'refresh']
    )
    study_goal_minutes = serializers.IntegerField(min_value=5, max_value=120, default=15)


class UserBadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserBadge
        fields = ['id', 'name', 'description', 'icon', 'earned_at']
