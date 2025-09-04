import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getOrderById, cancelOrder } from "../api/orders";
import { getOrderStatusInfo } from "../utils/orderStatus";
import TimelineStatus from "../components/TimelineStatus";
import useNotification from "../hooks/useNotification";
import GenericModal from "../components/GenericModal";
import ToastMessage from "../components/ToastMessage";

const MeusPedidosDetalhePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    toast,
    showToast,
    hideToast,
    modal,
    showModal,
    hideModal,
    confirmModal,
  } = useNotification();

  const loadOrder = React.useCallback(async () => {
    try {
      const data = await getOrderById(id);
      setOrder(data);
    } catch (error) {
      showToast("Erro ao carregar pedido.", "danger");
      navigate("/meus-pedidos");
    } finally {
      setLoading(false);
    }
  }, [id, navigate, showToast]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    loadOrder();
  }, [user, loading, navigate, id, loadOrder]);

  const handleCancel = async () => {
    try {
      await cancelOrder(order.id);
      await loadOrder(); // Recarrega com status atualizado
      showToast("Pedido cancelado com sucesso!");
    } catch (error) {
      console.error("Erro ao cancelar pedido:", error);
      showToast("Erro ao cancelar o pedido.", "danger");
    } finally {
      hideModal();
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
      <ToastMessage
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={() => hideToast()}
      />

      <GenericModal
        show={modal.show}
        title={modal.title}
        body={modal.body}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        onConfirm={confirmModal}
        onClose={hideModal}
        variant={modal.variant}
      />
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

      <hr />
      <h5>Endereço de Entrega</h5>
      <p>
        {order.address ? (
          <>
            {order.address.street}, {order.address.number}{" "}
            {order.address.complement && `- ${order.address.complement}`}
            <br />
            {order.address.district} - {order.address.city}/
            {order.address.state}, {order.address.zip_code}
          </>
        ) : (
          <span>Endereço não informado</span>
        )}
      </p>

      {podeCancelar && (
        <div className="text-end">
          <button
            className="btn btn-outline-danger"
            onClick={() =>
              showModal({
                title: "Confirmar cancelamento",
                body: "Você tem certeza que deseja cancelar este pedido?",
                onConfirm: handleCancel,
                confirmText: "Sim, cancelar",
                cancelText: "Não",
                variant: "danger",
              })
            }
          >
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
