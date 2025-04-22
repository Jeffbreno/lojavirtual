import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getOrderById } from "../api/orders";

const PedidoFinalizadoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const data = await getOrderById(id);
        setPedido(data);
      } catch (err) {
        setError("Não foi possível carregar os detalhes do pedido.");
      }
    };

    fetchPedido();
  }, [id]);

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Voltar à loja
        </button>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="container mt-4">
        <p>Carregando pedido...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Pedido Realizado com Sucesso!</h2>
      <hr />
      <p><strong>Número do Pedido:</strong> {pedido.id}</p>
      <p><strong>Status:</strong> {pedido.status_display}</p>
      <p><strong>Data:</strong> {pedido.created_at}</p>

      <h5 className="mt-4">Itens do Pedido:</h5>
      <ul className="list-group mb-3">
        {pedido.items.map((item) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between">
            <span>{item.product.name} x {item.quantity}</span>
            <strong>R$ {(item.price * item.quantity).toFixed(2)}</strong>
          </li>
        ))}
        <li className="list-group-item d-flex justify-content-between">
          <span>Total</span>
          <strong>R$ {pedido.total}</strong>
        </li>
      </ul>

      <Link to="/meus-pedidos" className="btn btn-outline-primary me-2">
        Ver Meus Pedidos
      </Link>
      <Link to="/" className="btn btn-primary">
        Voltar à Loja
      </Link>
    </div>
  );
};

export default PedidoFinalizadoPage;
