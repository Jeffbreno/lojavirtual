import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import * as cartApi from "../api/cart";

const LOCAL_STORAGE_KEY = "cart";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega o carrinho do localStorage imediatamente na inicialização
  const loadLocalCart = () => {
    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Erro ao carregar carrinho do localStorage:", error);
      return [];
    }
  };

  useEffect(() => {
    const syncCart = async () => {
      setLoading(true);
      try {
        if (user) {
          // Usuário autenticado - sincroniza com o backend
          const localCart = loadLocalCart();
          
          // Se houver itens no localStorage, sincroniza com o backend
          if (localCart.length > 0) {
            for (const item of localCart) {
              try {
                await cartApi.addToCart(item.id || item.product, item.quantity);
              } catch (error) {
                console.error("Erro ao sincronizar item:", error);
              }
            }
            localStorage.removeItem(LOCAL_STORAGE_KEY);
          }
          
          // Carrega o carrinho do backend
          const backendCart = await cartApi.getCartItems();
          setCartItems(backendCart);
        } else {
          // Usuário não autenticado - usa o carrinho local
          const localCart = loadLocalCart()
          setCartItems(localCart);
        }
      } catch (error) {
        console.error("Erro ao sincronizar carrinho:", error);
      } finally {
        setLoading(false);
      }
    };

    syncCart();
  }, [user]);

  // Persiste no localStorage quando o carrinho muda (apenas para usuários não autenticados)
  useEffect(() => {
    if (!user && !loading) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, user, loading]);

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        const newItem = await cartApi.addToCart(product.id, quantity);
        setCartItems((prev) => [...prev, newItem]);
        return newItem;
      } catch (error) {
        console.error("Erro ao adicionar ao carrinho:", error);
        throw error;
      }
    } else {
      const newItems = [...cartItems];
      const existingIndex = newItems.findIndex((item) => item.id === product.id);
      
      if (existingIndex >= 0) {
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity
        };
      } else {
        newItems.push({ ...product, quantity });
      }
      
      setCartItems(newItems);
      return product;
    }
  };

  const updateCartItem = async (id, quantity) => {
    if (user) {
      try {
        const updatedItem = await cartApi.updateCartItem(id, quantity);
        setCartItems((prev) =>
          prev.map((item) => (item.id === id ? updatedItem : item))
        );
        return updatedItem;
      } catch (error) {
        console.error("Erro ao atualizar item do carrinho:", error);
        throw error;
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
      return { id, quantity };
    }
  };

  const removeFromCart = async (id) => {
    if (user) {
      try {
        await cartApi.removeCartItem(id);
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Erro ao remover item do carrinho:", error);
        throw error;
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await cartApi.clearCart();
        setCartItems([]);
      } catch (error) {
        console.error("Erro ao limpar carrinho:", error);
        throw error;
      }
    } else {
      setCartItems([]);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
};