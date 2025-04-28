import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getCartItems,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  clearCart as apiClearCart,
} from "../api/cart";

const LOCAL_STORAGE_KEY = "cart";

const useCart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carregar carrinho ao iniciar ou sincronizar localStorage ao logar
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        try {
          setLoading(true);

          // 1. Primeiro, ver se existe carrinho salvo no localStorage
          const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY);

          if (savedCart) {
            const localItems = JSON.parse(savedCart);
            // 2. Para cada item salvo no localStorage, tentar adicionar ao carrinho do backend
            for (const item of localItems) {
              try {
                await apiAddToCart(item.id || item.product, item.quantity);
              } catch (error) {
                console.error(
                  "Erro ao sincronizar item do localStorage:",
                  error
                );
              }
            }

            // 3. Depois de sincronizar, limpar o localStorage para evitar duplicar
            localStorage.removeItem(LOCAL_STORAGE_KEY);
          }

          // 4. Agora carregar o carrinho atualizado do servidor
          const backendCart = await getCartItems();
          setCartItems(backendCart);
        } catch (error) {
          console.error("Erro ao carregar carrinho do servidor:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // Se não estiver logado, carregar do localStorage normalmente
        const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      }
    };

    loadCart();
  }, [user]);

  // Salvar no localStorage sempre que mudar e não tiver user
  useEffect(() => {
    if (!user) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        console.log("Adicionando ao carrinho (backend):", product);
        console.log("Quantidade:", quantity);
        const newItem = await apiAddToCart(product.id, quantity);
        setCartItems((prev) => [...prev, newItem]);
      } catch (error) {
        console.error("Erro ao adicionar ao carrinho (backend):", error);
      }
    } else {
      setCartItems((prev) => {
        const exists = prev.find((item) => item.id === product.id);
        if (exists) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { ...product, quantity }];
      });
    }
  };

  const updateCartItem = async (id, quantity) => {
    if (user) {
      try {
        const updatedItem = await apiUpdateCartItem(id, quantity);
        setCartItems((prev) =>
          prev.map((item) => (item.id === id ? updatedItem : item))
        );
      } catch (error) {
        console.error("Erro ao atualizar item do carrinho:", error);
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const removeFromCart = async (id) => {
    if (user) {
      try {
        await apiRemoveCartItem(id);
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Erro ao remover item do carrinho:", error);
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await apiClearCart();
        setCartItems([]);
      } catch (error) {
        console.error("Erro ao limpar carrinho:", error);
      }
    } else {
      setCartItems([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  return {
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loading,
  };
};

export default useCart;
