import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import useNotification from "../hooks/useNotification";
import GenericModal from "../components/GenericModal";
import ToastMessage from "../components/ToastMessage";

const CartPage = () => {
  const { cartItems, updateCartItem, removeFromCart } = useCart();
  const navigate = useNavigate();

  const {
    toast,
    showToast,
    hideToast,
    modal,
    showModal,
    hideModal,
    confirmModal,
  } = useNotification();

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    const isAuthenticated = localStorage.getItem("access");
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/checkout/endereco");
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

  const handleRemove = async (item) => {
    try {
      await removeFromCart(item.id);
      showToast("Produto removido do carrinho.");
    } catch (error) {
      showToast("Erro ao cancelar o pedido.", "danger");
    } finally {
      hideModal();
    }
  };

  return (
    <div className="container mt-4">
      <ToastMessage
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={() => hideToast()}
      />

      <GenericModal
        show={modal.show}
        title={modal.title}
        body={modal.body}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        onConfirm={confirmModal}
        onClose={hideModal}
        variant={modal.variant}
      />
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
                    onClick={() =>
                      showModal({
                        title: "Confirmar remover item",
                        body: "Deseja remover este item do carrinho?",
                        onConfirm: () => handleRemove(item),
                        confirmText: "Sim, cancelar",
                        cancelText: "Não",
                        variant: "danger",
                      })
                    }
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
              Fechar Pedido
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
