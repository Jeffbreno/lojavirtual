import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllOrdersAdmin } from "../../api/orders"; // nova função que criaremos
import { format } from "date-fns";

const AdminPedidosPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await fetchAllOrdersAdmin();
        setOrders(data);
      } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleVerDetalhes = (id) => {
    navigate(`/admin/pedidos/${id}`);
  };

  return (
    <div className="container mt-4">
      <h2>Painel de Pedidos</h2>
      {loading ? (
        <p>Carregando pedidos...</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Usuário</th>
              <th>Data</th>
              <th>Total</th>
              <th>Status</th>
              <th>Método</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user_name || "Anônimo"}</td>
                <td>{format(new Date(order.created_at), "dd/MM/yyyy")}</td>
                <td>R$ {order.total_price.toFixed(2)}</td>
                <td>{order.status_display}</td>
                <td>{order.payment_method}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleVerDetalhes(order.id)}
                  >
                    Ver Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPedidosPage;
