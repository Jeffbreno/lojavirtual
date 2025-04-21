import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CartContext } from "../contexts/CartContext";

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

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
      const response = await fetch("/api/pedidos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            product: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) throw new Error("Erro ao finalizar o pedido");

      clearCart();
      navigate("/meus-pedidos");
    } catch (error) {
      console.error(error);
      alert("Erro ao finalizar o pedido.");
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
