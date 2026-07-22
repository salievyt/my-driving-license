from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.NotificationViewSet, basename='notifications')
router.register(r'settings', views.NotificationSettingViewSet, basename='notification-settings')

urlpatterns = router.urls + [
    path('daily-question/', views.DailyQuestionView.as_view(), name='daily-question'),
    path('daily-question/<int:question_id>/answer/',
         views.DailyQuestionAnswerView.as_view(), name='daily-question-answer'),
]
