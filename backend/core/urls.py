from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

# VIEWS
from products.views import ProductViewSet, CategoryViewSet, ProductImageViewSet
from orders.views import OrderViewSet, OrderItemViewSet
from users.views import UserViewSet

# JWT Authentication
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

# Configs para arquivos de mídia
from django.conf import settings
from django.conf.urls.static import static

# DRF Router
router = routers.DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'product-images', ProductImageViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order-items', OrderItemViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),

    # API endpoints
    path('api/', include(router.urls)),

    # Auth endpoints (JWT)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Users (registro, perfil, etc.)
    path('api/users/', include('users.urls')),
] 

# Servir arquivos de mídia em desenvolvimento
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)