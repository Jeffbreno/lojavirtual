import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    const isAuthenticated = localStorage.getItem("access");
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Carrinho de Compras</h2>
      {cartItems.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul className="list-group mb-4">
            {cartItems.map((item, index) => (
              <li
                className="list-group-item d-flex justify-content-between align-items-center"
                key={index}
              >
                <div>
                  <h5>{item.name}</h5>
                  <p>
                    {item.quantity} x R$ {parseFloat(item.price).toFixed(2)}
                  </p>
                </div>
                <span>
                  <strong>R$ {(item.price * item.quantity).toFixed(2)}</strong>
                </span>
              </li>
            ))}
          </ul>
          <h4>Total: R$ {total.toFixed(2)}</h4>
          <button className="btn btn-success mt-3" onClick={handleCheckout}>
            Finalizar Compra
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;
