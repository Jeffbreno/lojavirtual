import api from '../services/http';

// Listar todos os pedidos do usuário logado
export const fetchUserOrders = async () => {
  const response = await api.get('/orders/');
  return response.data;
};

// Listar detalhes de um pedido específico
export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}/`);
  return response.data;
};

// Criar novo pedido
export const createOrder = async (items) => {
  const response = await api.post('/orders/', { items });
  return response.data;
};

// Cancelar pedido
export const cancelOrder = async (orderId) => {
  const response = await api.patch(`/orders/${orderId}/`, { status: 'C' });
  return response.data;
};

// Remover um item do pedido
export const deleteOrderItem = async (itemId) => {
  const response = await api.delete(`/order-items/${itemId}/`);
  return response.data;
};
