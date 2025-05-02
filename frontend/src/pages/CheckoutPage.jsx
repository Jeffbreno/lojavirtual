import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CartContext } from "../contexts/CartContext";
import { createOrder, updateOrderStatus } from "../api/orders";
import useNotification from "../hooks/useNotification";
import ToastMessage from "../components/ToastMessage";
import CreditCardForm from "../components/CreditCardForm";
import PixPayment from "../components/PixPayment";

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useNotification();

  const [step, setStep] = useState(1); // etapa 1: pagamento, etapa 2: confirmação
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleNextStep = () => {
    if (!paymentMethod) {
      showToast("Selecione uma forma de pagamento.", "warning");
      return;
    }

    if (paymentMethod === "card") {
      const { cardNumber, cardHolder, expiryDate, cvv } = cardDetails;
      if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        showToast("Preencha todos os dados do cartão.", "danger");
        return;
      }
    }

    setStep(2);
  };

  const handleFinalizeOrder = async () => {
    try {
      const result = await createOrder(cartItems);

      // Simulação de status como "pago"
      await updateOrderStatus(result.id, "PA");

      clearCart();
      navigate(`/pedido-finalizado/${result.id}`);
    } catch (error) {
      console.error(error);
      showToast("Erro ao finalizar pedido", "danger");
    }
  };

  return (
    <div className="container mt-4">
      <ToastMessage
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={hideToast}
      />

      <h2>Especificações de Pagamento</h2>
      <hr />

      {step === 1 && (
        <>
          <h5>Forma de Pagamento</h5>
          <select
            className="form-control mb-3"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Selecione...</option>
            <option value="card">Cartão de Crédito</option>
            <option value="pix">Pix</option>
            <option value="boleto">Boleto Bancário</option>
          </select>

          {paymentMethod === "card" && (
            <CreditCardForm value={cardDetails} onChange={setCardDetails} />
          )}

          {paymentMethod === "pix" && (
            <div className="alert alert-info">
              Um código Pix será gerado na próxima etapa.
            </div>
          )}

          {paymentMethod === "boleto" && (
            <div className="alert alert-info">
              Um boleto será gerado na próxima etapa.
            </div>
          )}

          <button
            className="btn btn-primary w-100 mt-3"
            onClick={handleNextStep}
          >
            Próximo
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h5 className="mb-3">Resumo do Pedido</h5>
          <ul className="list-group mb-3">
            {cartItems.map((item) => (
              <li
                key={item.product}
                className="list-group-item d-flex justify-content-between"
              >
                <div>
                  {item.name}{" "}
                  <small className="text-muted">x {item.quantity}</small>
                </div>
                <strong>R$ {(item.price * item.quantity).toFixed(2)}</strong>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between">
              <span>Total</span>
              <strong>R$ {total.toFixed(2)}</strong>
            </li>
          </ul>

          <div className="mb-3">
            <strong>Pagamento:</strong>{" "}
            {paymentMethod === "card"
              ? "Cartão de Crédito"
              : paymentMethod === "pix"
              ? "Pix"
              : "Boleto Bancário"}
          </div>

          <button
            className="btn btn-success w-100"
            onClick={handleFinalizeOrder}
          >
            {paymentMethod === "card"
              ? "Pagar com Cartão"
              : paymentMethod === "pix"
              ? "Gerar Pix"
              : "Gerar Boleto"}
          </button>

          <button
            className="btn btn-link mt-2 w-100"
            onClick={() => setStep(1)}
          >
            Voltar
          </button>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
