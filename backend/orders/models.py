from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from users.models import User
from products.models import Product

class OrderStatus(models.TextChoices):
    NEW = 'N', _('Novo')
    PROCESSING = 'P', _('Processando')
    PAID = 'PA', _('Pago')
    SHIPPED = 'S', _('Enviado')
    DELIVERED = 'D', _('Entregue')
    FINALIZED = 'F', _('Finalizado')
    RETURNED = 'R', _('Devolvido')
    REFUNDED = 'RF', _('Reembolsado')
    CANCELED = 'C', _('Cancelado')

class OrderStatusLog(models.Model):
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='status_logs')
    status = models.CharField(max_length=10, choices=OrderStatus.choices)
    changed_at = models.DateTimeField(auto_now_add=True)
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.order.id} - {self.status} - {self.changed_at.strftime('%d/%m/%Y %H:%M')}"

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=2, choices=OrderStatus.choices, default=OrderStatus.NEW)
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

class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')
