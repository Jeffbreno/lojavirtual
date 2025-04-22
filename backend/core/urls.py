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

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth endpoints (JWT)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Apps com suas urls
    path('api/auth/', include('users.urls')),
    path('api/', include('products.urls')),
    path('api/', include('orders.urls')),
] 

# Servir arquivos de mídia em desenvolvimento
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)