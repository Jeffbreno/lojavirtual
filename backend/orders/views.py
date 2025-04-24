from rest_framework import viewsets, permissions
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from users.permissions import IsClientUser
from rest_framework import generics
from .models import OrderStatusLog
from .serializers import OrderStatusLogSerializer
from rest_framework.permissions import IsAuthenticated

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
    
class OrderStatusLogListView(generics.ListAPIView):
    serializer_class = OrderStatusLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = OrderStatusLog.objects.all()

        order_id = self.request.query_params.get('order')
        user_id = self.request.query_params.get('user')

        if order_id:
            queryset = queryset.filter(order_id=order_id)
        if user_id:
            queryset = queryset.filter(changed_by_id=user_id)

        return queryset.order_by('-changed_at')