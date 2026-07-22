from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import FAQ, SupportTicket, TicketMessage
from .serializers import (
    FAQSerializer, SupportTicketSerializer,
    SupportTicketCreateSerializer,
    TicketMessageSerializer, TicketMessageCreateSerializer
)


class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQ.objects.filter(is_active=True)
    serializer_class = FAQSerializer
    filter_backends = []
    filterset_fields = ['category']

    def list(self, request, *args, **kwargs):
        faqs = self.get_queryset()
        categories = {}
        for faq in faqs:
            cat = faq.get_category_display()
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(FAQSerializer(faq).data)
        return Response(categories)


class SupportTicketViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return SupportTicket.objects.all()
        return SupportTicket.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return SupportTicketCreateSerializer
        return SupportTicketSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        ticket = self.get_object()

        if ticket.status in ['resolved', 'closed']:
            return Response(
                {'error': 'Тикет закрыт'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = TicketMessageCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(
            ticket=ticket,
            author=request.user,
            is_staff_reply=request.user.is_staff
        )

        if ticket.status == 'open':
            ticket.status = 'in_progress'
            ticket.save()

        messages = TicketMessage.objects.filter(ticket=ticket)
        return Response(
            TicketMessageSerializer(messages, many=True).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        ticket = self.get_object()
        ticket.status = 'closed'
        ticket.save()
        return Response({'status': 'Тикет закрыт'})
