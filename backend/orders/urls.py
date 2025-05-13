from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, OrderItemViewSet, OrderStatusLogListView, CartItemViewSet, AdminOrderViewSet

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='orders')
router.register(r'order-items', OrderItemViewSet, basename='orders-items')
router.register(r'cart-items', CartItemViewSet, basename='cart-items')
router.register(r'admin/orders', AdminOrderViewSet, basename='admin-order')

urlpatterns = [
    path('', include(router.urls)),
    path("status-logs/", OrderStatusLogListView.as_view(), name="order-status-logs"),
    
]
