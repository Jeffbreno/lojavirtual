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
export const createOrder = async (orderData) => {
  console.log('Order Data:', orderData);
  const response = await api.post('/orders/', orderData);
  return response.data;
};

// Atualizar status do pedido
export const updateOrderStatus = (orderId, newStatus) => {
  const response = api.patch(`/orders/${orderId}/`, { status: newStatus });
  return response;
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

// Buscar todos os pedidos como admin
export const fetchAllOrdersAdmin = async () => {
  const response = await api.get('/admin/orders/');
  return response.data;
};

// Buscar detalhes de um pedido como admin
export const getOrderByIdAdmin = async (id) => {
  const response = await api.get(`/admin/orders/${id}/`);
  return response.data;
};
