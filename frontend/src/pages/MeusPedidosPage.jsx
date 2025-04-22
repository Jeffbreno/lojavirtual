import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders, cancelOrder } from "../api/orders";

const MeusPedidosPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const dados = await fetchUserOrders();
      setOrders(dados.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
      alert("Erro ao carregar seus pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    loadOrders();
  }, [user, navigate]);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Tem certeza que deseja cancelar este pedido?')) return;

    try {
      await cancelOrder(orderId);
      await loadOrders();
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
    }
  };

  if (loading) return <div className="container mt-4">Carregando...</div>;

  return (
    <div className="container mt-4">
      <h2>Meus Pedidos</h2>
      <hr />

      {orders.length === 0 ? (
        <p>Você ainda não realizou nenhum pedido.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card mb-3">
            <div className="card-header d-flex justify-content-between">
              <span>
                <strong>Pedido #{order.id}</strong> - {order.status_display}
              </span>
              <span>{order.created_at}</span>
            </div>
            <ul className="list-group list-group-flush">
              {order.items.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between">
                  <div>
                    {item.product?.name || 'Produto removido'} <small>x {item.quantity}</small>
                  </div>
                  <strong>R$ {(item.price * item.quantity).toFixed(2)}</strong>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between">
                <strong>Total</strong>
                <strong>R$ {Number(order.total).toFixed(2)}</strong>
              </li>
            </ul>
            {order.status !== 'C' && order.status !== 'D' && (
              <div className="card-footer text-end">
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleCancel(order.id)}
                >
                  Cancelar Pedido
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};


export default MeusPedidosPage;
