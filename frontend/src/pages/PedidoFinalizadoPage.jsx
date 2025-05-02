import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../api/orders";
import { QRCodeSVG as QRCode } from "qrcode.react";

const PedidoFinalizadoPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const result = await getOrderById(id);
        setOrder(result);
      } catch (error) {
        console.error("Erro ao buscar pedido:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <p>Carregando pedido...</p>;
  if (!order) return <p>Pedido não encontrado.</p>;

  const renderPagamento = () => {
    const metodo = order.payment_method;
    if (metodo === "pix") {
      const pixCode = `00020126330014BR.GOV.BCB.PIX0114+5581999999995204000053039865802BR5920NOME RECEBEDOR6009SAO PAULO62070503***6304ABCD`; // Simulado
      return (
        <div className="text-center">
          <h4>Escaneie o QR Code com seu app de banco</h4>
          <QRCode value={pixCode} size={256} />
          <p className="mt-3"><strong>Código:</strong> {pixCode}</p>
        </div>
      );
    }

    if (metodo === "boleto") {
      const linhaDigitavel = "34191.79001 01043.510047 91020.150008 5 91470000010000"; // Simulado
      const vencimento = new Date();
      vencimento.setDate(vencimento.getDate() + 3);
      return (
        <div className="text-center">
          <h4>Pagamento por Boleto</h4>
          <p><strong>Linha Digitável:</strong> {linhaDigitavel}</p>
          <p><strong>Vencimento:</strong> {vencimento.toLocaleDateString()}</p>
          <button className="btn btn-primary mt-2">Baixar Boleto (PDF)</button>
        </div>
      );
    }

    return (
      <div className="alert alert-success text-center">
        <h4>Pagamento aprovado!</h4>
        <p>Seu pedido está sendo processado.</p>
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <h2>Pedido Finalizado</h2>
      <p>ID do Pedido: <strong>{order.id}</strong></p>
      <p>Valor Total: <strong>R$ {order.total_price.toFixed(2)}</strong></p>

      <hr />
      {renderPagamento()}

      <hr />
      <h5>Itens do Pedido:</h5>
      <ul className="list-group">
        {order.items.map((item) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between">
            <span>{item.product_name} x {item.quantity}</span>
            <strong>R$ {(item.price * item.quantity).toFixed(2)}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PedidoFinalizadoPage;
