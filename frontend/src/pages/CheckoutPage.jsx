import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CartContext } from "../contexts/CartContext";
import { createOrder } from "../api/orders";

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleFinalizeOrder = async () => {
    try {
      const result = await createOrder(cartItems);
      clearCart();
      navigate(`/pedido-finalizado/${result.id}`);
    } catch (err) {
      console.error(err);
      setError("Erro ao finalizar o pedido. Tente novamente.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Finalizar Pedido</h2>
      <hr />
      <ul className="list-group mb-3">
        {cartItems.map((item) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between">
            <div>
              {item.name} <small className="text-muted">x {item.quantity}</small>
            </div>
            <strong>R$ {(item.price * item.quantity).toFixed(2)}</strong>
          </li>
        ))}
        <li className="list-group-item d-flex justify-content-between">
          <span>Total</span>
          <strong>R$ {total.toFixed(2)}</strong>
        </li>
      </ul>

      {error && <div className="alert alert-danger">{error}</div>}

      <button
        className="btn btn-success w-100"
        onClick={handleFinalizeOrder}
        disabled={cartItems.length === 0}
      >
        Finalizar Pedido
      </button>
    </div>
  );
};

export default CheckoutPage;
