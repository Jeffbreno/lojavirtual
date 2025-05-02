import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

const OrderSummary = () => {
  const { cartItems } = useContext(CartContext);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="mb-4">
      <h5>Resumo do Pedido</h5>
      <ul className="list-group">
        {cartItems.map((item) => (
          <li key={item.product} className="list-group-item d-flex justify-content-between">
            <span>{item.name} x {item.quantity}</span>
            <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
        <li className="list-group-item d-flex justify-content-between">
          <strong>Total</strong>
          <strong>R$ {total.toFixed(2)}</strong>
        </li>
      </ul>
    </div>
  );
};

export default OrderSummary;
