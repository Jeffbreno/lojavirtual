from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VerifyEmailView, RegisterView, ProfileView, AdminOnlyView, SellerOnlyView, ClientOnlyView, UserViewSet, AddressViewSet, LoginView, PasswordResetRequestView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'addresses', AddressViewSet, basename='address')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('auth/verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('admin-only/', AdminOnlyView.as_view(), name='admin-only'),
    path('seller-only/', SellerOnlyView.as_view(), name='seller-only'),
    path('client-only/', ClientOnlyView.as_view(), name='client-only'),
    path('login/', LoginView.as_view(), name='login'),
    path('password-reset-request/', PasswordResetRequestView.as_view(), name='password-reset-request'),
]