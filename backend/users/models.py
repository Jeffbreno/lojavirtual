from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    USER_TYPES = [
        ('C', 'Cliente'),
        ('A', 'Administrador'),
        ('S', 'Vendedor'),
    ]

    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True, null=True)
    cpf_cnpj = models.CharField(max_length=20, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='C')
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.full_name} ({self.username})"