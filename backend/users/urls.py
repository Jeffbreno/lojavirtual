from django.urls import path
from .views import RegisterView, ProfileView
from .views import RegisterView, ProfileView, AdminOnlyView, SellerOnlyView, ClientOnlyView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('admin-only/', AdminOnlyView.as_view(), name='admin-only'),
    path('seller-only/', SellerOnlyView.as_view(), name='seller-only'),
    path('client-only/', ClientOnlyView.as_view(), name='client-only'),
]