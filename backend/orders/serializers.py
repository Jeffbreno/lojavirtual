from rest_framework import serializers
from .models import Order, OrderItem, CartItem
from .models import OrderStatusLog

class OrderStatusLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatusLog
        fields = ['status', 'changed_at']

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price']
        read_only_fields = ['id', 'product_name', 'order', 'price']

    def validate(self, data):
        product = data.get('product')
        quantity = data.get('quantity')

        if product is None:
            raise serializers.ValidationError("Produto é obrigatório.")

        if quantity <= 0:
            raise serializers.ValidationError("Quantidade deve ser maior que zero.")

        # Em caso de criação
        if self.instance is None:
            if quantity > product.stock:
                raise serializers.ValidationError(f"Estoque insuficiente. Disponível: {product.stock}")
        else:
            # Em caso de atualização
            diff = quantity - self.instance.quantity  # Quanto a mais será adicionado
            if diff > product.stock:
                raise serializers.ValidationError(f"Estoque insuficiente. Disponível: {product.stock}")

        return data
    
    def create(self, validated_data):
        product = validated_data['product']
        validated_data['price'] = product.price
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'product' in validated_data:
            product = validated_data['product']
            validated_data['price'] = product.price
        return super().update(instance, validated_data)

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_at = serializers.DateTimeField(format="%d/%m/%Y %H:%M", read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    status_logs = OrderStatusLogSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'status', 'status_display', 'total', 'created_at', 'updated_at', 'items', 'status_logs']
        read_only_fields = ['user', 'total', 'created_at', 'updated_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        order = Order.objects.create(user=user, status='N', total=0)

        for item in items_data:
            product = item['product']
            quantity = item['quantity']
            price = product.price

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=price
            )
            
        return order

class OrderCreateSerializer(serializers.Serializer):
    items = serializers.ListField(
        child=serializers.DictField(
            child=serializers.IntegerField()
        )
    )

    def validate(self, data):
        if not data.get('items'):
            raise serializers.ValidationError("Lista de itens não pode estar vazia.")
        return data

class CartItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='product.name', read_only=True)
    price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'name', 'quantity', 'price', 'added_at']