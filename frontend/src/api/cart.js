import api from "../services/http";

export const getCartItems = async () => {
  const response = await api.get("/cart-items/");
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post("/cart-items/", { product: productId, quantity });
  return response.data;
};

export const updateCartItem = async (id, quantity) => {
  const response = await api.patch(`/cart-items/${id}/`, { quantity });
  return response.data;
};

export const removeCartItem = async (id) => {
  await api.delete(`/cart-items/${id}/`);
};

export const clearCart = async () => {
  await api.delete("/cart-items/clear/");
};
