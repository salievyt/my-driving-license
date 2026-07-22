from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)


def health_check(request):
    return JsonResponse({'status': 'ok', 'version': '1.0.0'})


urlpatterns = [
    # Health
    path('api/v1/health/', health_check, name='health-check'),

    # Admin
    path('admin/', admin.site.urls),

    # API
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/lessons/', include('apps.lessons.urls')),
    path('api/v1/quizzes/', include('apps.quizzes.urls')),
    path('api/v1/progress/', include('apps.progress.urls')),
    path('api/v1/subscriptions/', include('apps.subscriptions.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),
    path('api/v1/blog/', include('apps.blog.urls')),
    path('api/v1/support/', include('apps.support.urls')),

    # API Docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

    import debug_toolbar
    urlpatterns = [path('__debug__/', include(debug_toolbar.urls))] + urlpatterns
