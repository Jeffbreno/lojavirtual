# orders/signals.py
from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from django.utils.timezone import now
from .models import OrderItem, Order, OrderStatusLog
from core.middleware import get_current_user

# Atualiza o total do pedido
@receiver([post_save, post_delete], sender=OrderItem)
def update_order_total(sender, instance, **kwargs):
    order = instance.order
    total = sum(item.price * item.quantity for item in order.items.all())
    order.total = total
    order.save()

# Reduz o estoque ao criar um item
@receiver(post_save, sender=OrderItem)
def decrease_stock_on_create(sender, instance, created, **kwargs):
    if created:
        product = instance.product
        if product:
            product.stock -= instance.quantity
            product.save()

# Reverte estoque ao excluir item
@receiver(post_delete, sender=OrderItem)
def restore_stock_on_delete(sender, instance, **kwargs):
    product = instance.product
    if product:
        product.stock += instance.quantity
        product.save()

# Atualiza o estoque se a quantidade for alterada
@receiver(pre_save, sender=OrderItem)
def adjust_stock_on_update(sender, instance, **kwargs):
    if instance.pk:
        try:
            previous = OrderItem.objects.get(pk=instance.pk)
        except OrderItem.DoesNotExist:
            return

        product = instance.product
        if product:
            diff = instance.quantity - previous.quantity
            if diff != 0:
                new_stock = product.stock - diff
                if new_stock < 0:
                    raise ValueError(f"Estoque insuficiente para atualizar {product.name}.")
                product.stock = new_stock
                product.save()

@receiver(post_save, sender=Order)
def create_initial_status_log(sender, instance, created, **kwargs):
    if created:
        # Evita duplicar caso o log já exista (por segurança)
        if not instance.status_logs.exists():
            user = get_current_user()
            if user and user.is_authenticated:
                OrderStatusLog.objects.create(
                    order=instance,
                    status=instance.status,
                    changed_by=user,
                )

# Cria log quando o status do pedido muda
@receiver(pre_save, sender=Order)
def log_order_status_change(sender, instance, **kwargs):
    if not instance.pk:
        return  # Novo pedido, ainda não salvo

    try:
        previous = Order.objects.get(pk=instance.pk)
    except Order.DoesNotExist:
        return

    if previous.status != instance.status:
        user = get_current_user()
        if user and user.is_authenticated:
            OrderStatusLog.objects.create(
                order=instance,
                status=instance.status,
                changed_at=now(),
                changed_by=user,
            )
