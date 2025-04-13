from rest_framework import viewsets, permissions
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from users.permissions import IsClientUser

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'C':
            return Order.objects.filter(cliente=user)
        elif user.user_type == 'S':
            return Order.objects.filter(produto__vendedor=user)
        return Order.objects.none()

    def get_permissions(self):
        if self.action in ['create']:
            return [IsClientUser()]
        return [permissions.IsAuthenticated()]

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

    def get_queryset(self):
        return OrderItem.objects.filter(cliente=self.request.user)

    def get_permissions(self):
        return [IsClientUser()]