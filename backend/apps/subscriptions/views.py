from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import SubscriptionPlan, UserSubscription
from .serializers import (
    SubscriptionPlanSerializer, UserSubscriptionSerializer
)


class SubscriptionPlanViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SubscriptionPlan.objects.filter(is_active=True)
    serializer_class = SubscriptionPlanSerializer
    lookup_field = 'slug'
    ordering = ['order']


class UserSubscriptionViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSubscriptionSerializer

    def get_queryset(self):
        return UserSubscription.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def active(self, request):
        subscription = UserSubscription.objects.filter(
            user=request.user, is_active=True,
            end_date__gte=__import__('django').utils.timezone.now()
        ).first()

        if subscription:
            return Response(UserSubscriptionSerializer(subscription).data)
        return Response(None)

    @action(detail=False, methods=['get'])
    def history(self, request):
        subscriptions = UserSubscription.objects.filter(
            user=request.user
        ).order_by('-start_date')
        return Response(
            UserSubscriptionSerializer(subscriptions, many=True).data
        )
