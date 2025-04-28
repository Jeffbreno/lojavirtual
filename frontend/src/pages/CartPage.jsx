import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cartItems, updateCartItem, removeFromCart } = useCart();
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

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateCartItem(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleIncrease = (item) => {
    updateCartItem(item.id, item.quantity + 1);
  };

  const handleRemove = (item) => {
    if (window.confirm("Deseja remover este item do carrinho?")) {
      removeFromCart(item.id);
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
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div className="flex-grow-1">
                  <h5>{item.name}</h5>
                  <div className="d-flex align-items-center mt-2">
                    <button
                      className="btn btn-outline-secondary btn-sm me-2"
                      onClick={() => handleDecrease(item)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="btn btn-outline-secondary btn-sm ms-2"
                      onClick={() => handleIncrease(item)}
                    >
                      +
                    </button>
                  </div>
                  <p className="mt-2">
                    Preço unitário: R$ {parseFloat(item.price).toFixed(2)}
                  </p>
                </div>

                <div className="d-flex flex-column align-items-end">
                  <strong className="mb-2">
                    Total: R$ {(item.price * item.quantity).toFixed(2)}
                  </strong>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemove(item)}
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="d-flex justify-content-between align-items-center">
            <h4>Total: R$ {total.toFixed(2)}</h4>
            <button className="btn btn-success" onClick={handleCheckout}>
              Finalizar Compra
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
