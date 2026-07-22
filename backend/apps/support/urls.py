from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'faq', views.FAQViewSet, basename='faq')
router.register(r'tickets', views.SupportTicketViewSet, basename='support-tickets')

urlpatterns = router.urls
