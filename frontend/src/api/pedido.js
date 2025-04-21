// src/api/pedidos.js
import api from "../services/http";

export const criarPedido = async (items) => {
  const response = await api.post("/pedidos/", {
    items: items.map((item) => ({
      product: item.id,
      quantity: item.quantity,
    })),
  });

  return response.data; 
};
