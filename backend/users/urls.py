from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, ProfileView, AdminOnlyView, SellerOnlyView, ClientOnlyView, UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('admin-only/', AdminOnlyView.as_view(), name='admin-only'),
    path('seller-only/', SellerOnlyView.as_view(), name='seller-only'),
    path('client-only/', ClientOnlyView.as_view(), name='client-only'),
]