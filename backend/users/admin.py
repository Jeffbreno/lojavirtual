from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Informações adicionais', {
            'fields': ('full_name', 'phone', 'cpf_cnpj', 'birth_date', 'address', 'user_type', 'is_verified')
        }),
    )
    list_display = ('username', 'email', 'user_type', 'is_verified')