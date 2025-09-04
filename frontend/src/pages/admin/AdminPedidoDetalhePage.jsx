import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderByIdAdmin, updateOrderStatus } from "../../api/orders";

const AdminPedidoDetalhePage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [statusChanged, setStatusChanged] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const result = await getOrderByIdAdmin(id);
        setOrder(result);
        setNewStatus(result.status);
      } catch (error) {
        console.error("Erro ao buscar pedido:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusChange = async () => {
    try {
      await updateOrderStatus(order.id, newStatus);
      setOrder((prev) => ({ ...prev, status: newStatus }));
      setStatusChanged(true);
      setTimeout(() => setStatusChanged(false), 3000);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (!order) return <p>Pedido não encontrado.</p>;

  return (
    <div className="container mt-4">
  <h2>Detalhes do Pedido #{order.id}</h2>
  <p><strong>Status Atual:</strong> {order.status_display}</p>

      <div className="form-group mt-3">
        <label>Alterar Status:</label>
        <select
          className="form-control"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="P">Processando</option>
          <option value="S">Enviado</option>
          <option value="C">Cancelado</option>
        </select>
        <button
          className="btn btn-primary mt-2"
          onClick={handleStatusChange}
          disabled={newStatus === order.status}
        >
          Atualizar Status
        </button>
        {statusChanged && <div className="alert alert-success mt-2">Status atualizado com sucesso!</div>}
      </div>

      <hr />
      <h5>Endereço de Entrega</h5>
      <p>
        {order.address
          ? (
            <>
              {order.address.street}, {order.address.number} {order.address.complement && `- ${order.address.complement}`}<br />
              {order.address.district} - {order.address.city}/{order.address.state}, {order.address.zip_code}
            </>
          )
          : <span>Endereço não informado</span>
        }
      </p>

      <hr />
      <h5>Itens do Pedido</h5>
      <ul className="list-group">
        {order.items.map((item) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between">
            <span>{item.product_name} x {item.quantity}</span>
            <strong>R$ {(item.price * item.quantity).toFixed(2)}</strong>
          </li>
        ))}
      </ul>

      <hr />
      <h5>Resumo</h5>
  <p><strong>Total:</strong> R$ {order.total ? Number(order.total).toFixed(2) : "0,00"}</p>
  <p><strong>Método de Pagamento:</strong> {order.payment_method.toUpperCase()}</p>
    </div>
  );
};

export default AdminPedidoDetalhePage;
