from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User
from products.models import Product


class OrderStatus(models.TextChoices):
    NEW = 'N', _('Novo')
    PROCESSING = 'P', _('Processando')
    SHIPPED = 'S', _('Enviado')
    DELIVERED = 'D', _('Entregue')
    CANCELED = 'C', _('Cancelado')

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=1, choices=OrderStatus.choices, default=OrderStatus.NEW)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    observations = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Order #{self.id} - {self.get_status_display()}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
