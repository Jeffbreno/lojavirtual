from rest_framework import viewsets
from rest_framework.views import APIView
from .models import User
from .serializers import UserSerializer
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.core.mail import send_mail
import random
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import User, Address
from .serializers import UserSerializer, AddressSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .permissions import IsAdminUser, IsSellerUser, IsClientUser

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            user = User.objects.get(email=email)
            if not user.is_verified:
                return Response({"detail": "Conta não verificada. Verifique seu e-mail.", "code": "not_verified"}, status=status.HTTP_403_FORBIDDEN)
            user = authenticate(request, username=user.username, password=password)
            if user is not None:
                refresh = RefreshToken.for_user(user)
                return Response({
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": UserSerializer(user).data
                })
            else:
                return Response({"detail": "Credenciais inválidas."}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({"detail": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        email = request.data.get('email')
        if User.objects.filter(email=email).exists():
            return Response({"detail": "E-mail já cadastrado."}, status=status.HTTP_400_BAD_REQUEST)
        response = super().create(request, *args, **kwargs)
        user = self.get_queryset().get(id=response.data['id'])
        code = str(random.randint(100000, 999999))
        user.reset_code = code
        user.is_verified = False
        user.save()
        send_mail(
            'Confirmação de cadastro',
            f'Seu código de verificação é: {code}',
            'jeffbreno@gmail.com',
            [email],
        )
        response.data['need_verification'] = True
        return response
    
class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        try:
            user = User.objects.get(email=email)
            if user.reset_code == code:
                user.is_verified = True
                user.reset_code = None
                user.save()
                return Response({"detail": "Conta verificada com sucesso."})
            else:
                return Response({"detail": "Código inválido."}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"detail": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            code = str(random.randint(100000, 999999))
            user.reset_code = code
            user.save()
            send_mail(
                'Código de redefinição de senha',
                f'Seu código de redefinição é: {code}',
                'sua_loja@email.com',
                [email],
            )
            return Response({"detail": "Código enviado para o e-mail."})
        except User.DoesNotExist:
            return Response({"detail": "E-mail não encontrado."}, status=status.HTTP_404_NOT_FOUND)

class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class AdminOnlyView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class SellerOnlyView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsSellerUser]

class ClientOnlyView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsClientUser]

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)