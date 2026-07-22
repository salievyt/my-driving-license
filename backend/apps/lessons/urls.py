from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'tags', views.TagViewSet)
router.register(r'', views.LessonViewSet)
router.register(r'progress', views.LessonProgressViewSet, basename='lesson-progress')

urlpatterns = router.urls
