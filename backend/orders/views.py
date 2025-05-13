from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order, OrderItem, CartItem
from .serializers import OrderSerializer, OrderItemSerializer, CartItemSerializer
from users.permissions import IsClientUser
from .models import OrderStatusLog
from .serializers import OrderStatusLogSerializer

class AdminOrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

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
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return OrderItem.objects.filter(order__user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Impede exclusão se o pedido não for "Novo"
        if instance.order.status != 'N':
            return Response(
                {"detail": "Itens só podem ser excluídos se o pedido estiver com status 'Novo'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class OrderStatusLogListView(generics.ListAPIView):
    serializer_class = OrderStatusLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = OrderStatusLog.objects.all()
        order_id = self.request.query_params.get('order')
        user_id = self.request.query_params.get('user')

        if order_id:
            queryset = queryset.filter(order_id=order_id)
        if user_id:
            queryset = queryset.filter(changed_by_id=user_id)

        return queryset.order_by('-changed_at')

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)  
        return Response(status=status.HTTP_204_NO_CONTENT)  
        
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['delete'], url_path='clear')
    def clear(self, request):
        """Limpa todos os itens do carrinho do usuário atual."""
        cart_items_deleted, _ = CartItem.objects.filter(user=request.user).delete()
        if cart_items_deleted > 0:
            return Response({"message": "Carrinho limpo com sucesso."}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Carrinho já estava vazio."}, status=status.HTTP_200_OK)