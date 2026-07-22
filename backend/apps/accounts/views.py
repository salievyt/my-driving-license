from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate
from .serializers import (
    RegisterSerializer, LoginSerializer,
    UserSerializer, UserDetailSerializer,
    ProfileSerializer, ProfileUpdateSerializer,
    UserBadgeSerializer
)
from .models import Profile, UserBadge

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        if user is None:
            return Response(
                {'error': 'Неверное имя пользователя или пароль'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Выход выполнен'})
        except Exception:
            return Response({'error': 'Ошибка выхода'}, status=400)


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserDetailSerializer

    def get_object(self):
        return self.request.user


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer

    def get_object(self):
        return self.request.user.profile


class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = ProfileUpdateSerializer

    def get_object(self):
        return self.request.user.profile


class UserBadgeListView(generics.ListAPIView):
    serializer_class = UserBadgeSerializer

    def get_queryset(self):
        return UserBadge.objects.filter(user=self.request.user)
