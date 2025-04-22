from rest_framework import viewsets, permissions
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from users.permissions import IsClientUser

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'C':
            return Order.objects.filter(user=user)
        elif user.user_type == 'S':
            return Order.objects.filter(items__product__seller=user).distinct()
        return Order.objects.none()

    def get_permissions(self):
        if self.action in ['create']:
            return [IsClientUser()]
        return [permissions.IsAuthenticated()]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class OrderItemViewSet(viewsets.ModelViewSet):
    serializer_class = OrderItemSerializer

    def get_queryset(self):
        return OrderItem.objects.filter(order__user=self.request.user)

    def get_permissions(self):
        return [permissions.IsAuthenticated()]