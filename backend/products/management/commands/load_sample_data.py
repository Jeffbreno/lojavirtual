from django.core.management.base import BaseCommand
from users.models import User
from products.models import Product, ProductImage
from django.core.files.base import ContentFile
import requests

class Command(BaseCommand):
    help = "Cria usuários de exemplo (Admin, Vendedor, Cliente) e produtos com imagens"

    def handle(self, *args, **kwargs):
        # Usuários de exemplo
        users_data = [
            {
                "username": "admin",
                "full_name": "Admin",
                "password": "admin123",
                "user_type": "A",
                "is_superuser": True,
                "is_staff": True,
                "is_verified": True,
            },
            {
                "username": "vendedor",
                "full_name": "Vendedor",
                "password": "vendedor123",
                "user_type": "S",
                "is_superuser": False,
                "is_staff": True,
                "is_verified": True,
            },
            {
                "username": "cliente",
                "full_name": "Cliente",
                "password": "cliente123",
                "user_type": "C",
                "is_superuser": False,
                "is_staff": False,
                "is_verified": True,
            },
        ]

        for user_data in users_data:
            user, created = User.objects.get_or_create(username=user_data["username"], defaults=user_data)
            if created:
                user.set_password(user_data["password"])
                user.save()
                self.stdout.write(f"✅ Usuário {user_data['username']} criado.")
            else:
                self.stdout.write(f"ℹ️ Usuário {user_data['username']} já existia.")

        # Produtos de exemplo
        produtos = [
            {
                "name": "Notebook Gamer",
                "price": 4500.00,
                "description": "Notebook potente para jogos.",
                "images": [
                    "https://placehold.co/600x400/jpg?text=Notebook+1",
                    "https://placehold.co/600x400/jpg?text=Notebook+2",
                ]
            },
            {
                "name": "Smartphone",
                "price": 2500.00,
                "description": "Celular de última geração.",
                "images": [
                    "https://placehold.co/600x400/jpg?text=Smartphone+1",
                    "https://placehold.co/600x400/jpg?text=Smartphone+2",
                ]
            },
            {
                "name": "Mouse Gamer",
                "price": 150.00,
                "description": "Mouse com RGB.",
                "images": [
                    "https://placehold.co/600x400/jpg?text=Mouse+Gamer+1",
                    "https://placehold.co/600x400/jpg?text=Mouse+Gamer+2",
                ]
            }
        ]

        for p in produtos:
            produto, created = Product.objects.get_or_create(
                name=p["name"],
                defaults={"price": p["price"], "description": p["description"], "stock": p.get("stock", 10)}
            )
            if created:
                self.stdout.write(f"✅ Produto '{p['name']}' criado.")
                for url in p["images"]:
                    resp = requests.get(url)
                    if resp.status_code == 200:
                        img_name = url.split("?")[1] + ".png"
                        img = ProductImage(product=produto)
                        img.image.save(img_name, ContentFile(resp.content), save=True)
                        self.stdout.write(f"🖼️ Imagem adicionada: {img_name}")
            else:
                self.stdout.write(f"ℹ️ Produto '{p['name']}' já existia.")
