from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'plans', views.SubscriptionPlanViewSet)
router.register(r'my', views.UserSubscriptionViewSet, basename='user-subscriptions')

urlpatterns = router.urls
