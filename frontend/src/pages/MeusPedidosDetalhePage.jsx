import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getOrderById, cancelOrder } from "../api/orders";
import { getOrderStatusInfo } from "../utils/orderStatus";
import TimelineStatus from "../components/TimelineStatus";

const MeusPedidosDetalhePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = React.useCallback(async () => {
    try {
      const data = await getOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error("Erro ao buscar pedido:", error);
      alert("Não foi possível carregar os detalhes do pedido.");
      navigate("/meus-pedidos");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    loadOrder();
  }, [user, loading, navigate, id, loadOrder]);

  const handleCancel = async () => {
    if (!window.confirm("Tem certeza que deseja cancelar este pedido?")) return;

    try {
      await cancelOrder(order.id);
      await loadOrder(); // Recarrega com status atualizado
    } catch (error) {
      console.error("Erro ao cancelar pedido:", error);
      alert("Não foi possível cancelar o pedido.");
    }
  };

  const podeCancelar = ["N", "P", "PA"].includes(order?.status);

  if (loading)
    return (
      <div className="container mt-4">Carregando detalhes do pedido...</div>
    );

  if (!order) return null;

  const { label, color, icon } = getOrderStatusInfo(order.status);

  return (
    <div className="container mt-4">
      <h2>Detalhes do Pedido #{order.id}</h2>
      <p>
        <strong>Status:</strong>{" "}
        <span className={`badge bg-${color}`}>
          {icon} {label}
        </span>
      </p>
      <TimelineStatus logs={order.status_logs} />
      <p>
        <strong>Data do Pedido:</strong> {order.created_at}
      </p>
      <hr />

      <h5 className="mt-4">Itens do Pedido:</h5>
      <ul className="list-group mb-3">
        {order.items.map((item) => (
          <li
            key={item.id}
            className="list-group-item d-flex justify-content-between"
          >
            <div>
              {item.product_name || "Produto removido"}{" "}
              <small>x {item.quantity}</small>
            </div>
            <strong>R$ {(item.price * item.quantity).toFixed(2)}</strong>
          </li>
        ))}
        <li className="list-group-item d-flex justify-content-between">
          <strong>Total</strong>
          <strong>R$ {Number(order.total).toFixed(2)}</strong>
        </li>
      </ul>

      {podeCancelar && (
        <div className="text-end">
          <button className="btn btn-outline-danger" onClick={handleCancel}>
            Cancelar Pedido
          </button>
        </div>
      )}

      <div className="mt-3">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/meus-pedidos")}
        >
          Voltar para Meus Pedidos
        </button>
      </div>
    </div>
  );
};

export default MeusPedidosDetalhePage;
