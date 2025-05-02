import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { getAddresses, createAddress } from "../api/addresses";
import { createOrder } from "../api/orders";
import ToastMessage from "../components/ToastMessage";
import useNotification from "../hooks/useNotification";

const CheckoutFinalPage = () => {
  const { user } = useAuth();
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const { toast, showToast, hideToast } = useNotification();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    state: "",
    zip_code: "",
    is_default: false
  });

  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    if (!user) return navigate("/login");
    fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data);
      if (data.length > 0) {
        // Seleciona o endereço padrão ou o primeiro da lista
        const defaultAddress = data.find(addr => addr.is_default) || data[0];
        setSelectedAddressId(defaultAddress.id);
      }
    } catch (err) {
      console.error(err);
      showToast("Erro ao carregar endereços.", "danger");
    }
  };

  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateAddress = () => {
    const requiredFields = ['street', 'number', 'district', 'city', 'state', 'zip_code'];
    for (const field of requiredFields) {
      if (!newAddress[field]) {
        showToast(`Preencha o campo ${field}`, 'warning');
        return false;
      }
    }
    
    if (newAddress.zip_code.replace(/\D/g, '').length !== 8) {
      showToast('CEP inválido', 'warning');
      return false;
    }
    
    if (newAddress.state.length !== 2) {
      showToast('Estado deve ter 2 caracteres', 'warning');
      return false;
    }
    
    return true;
  };

  const handleAddAddress = async () => {
    if (!validateAddress()) return;
    
    try {
      const created = await createAddress(newAddress);
      showToast("Endereço adicionado!", "success");
      setNewAddress({
        street: "",
        number: "",
        complement: "",
        district: "",
        city: "",
        state: "",
        zip_code: "",
        is_default: false
      });
      fetchAddresses();
      setSelectedAddressId(created.id);
    } catch (err) {
      showToast("Erro ao adicionar endereço.", "danger");
    }
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddressId || !paymentMethod) {
      showToast("Preencha todos os dados antes de continuar.", "warning");
      return;
    }

    try {
      const orderData = {
        address: selectedAddressId,
        items: cartItems.map((item) => ({
          product: item.id,
          quantity: item.quantity
        })),
        payment_method: paymentMethod
      };

      console.log("Cart Items:", cartItems);


      const order = await createOrder(orderData);
      clearCart();
      navigate(`/pedido-finalizado/${order.id}`);
    } catch (err) {
      console.error(err);
      showToast("Erro ao criar pedido.", "danger");
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Ordena endereços com o padrão primeiro
  const sortedAddresses = [...addresses].sort((a, b) => 
    (a.is_default === b.is_default) ? 0 : a.is_default ? -1 : 1
  );

  return (
    <div className="container mt-4">
      <ToastMessage
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={hideToast}
      />
      <h2>Finalizar Pedido</h2>
      <hr />

      {/* Lista de produtos */}
      <ul className="list-group mb-3">
        {cartItems.map((item) => (
          <li key={item.product} className="list-group-item d-flex justify-content-between">
            <div>
              {item.name} <small>x {item.quantity}</small>
            </div>
            <strong>R$ {(item.price * item.quantity).toFixed(2)}</strong>
          </li>
        ))}
        <li className="list-group-item d-flex justify-content-between">
          <strong>Total</strong>
          <strong>R$ {total.toFixed(2)}</strong>
        </li>
      </ul>

      {/* Endereço */}
      <div className="mb-4">
        <h5>Endereço de Entrega</h5>
        {sortedAddresses.length > 0 ? (
          <select
            className="form-select mb-3"
            value={selectedAddressId}
            onChange={(e) => setSelectedAddressId(e.target.value)}
          >
            {sortedAddresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.street}, {addr.number} - {addr.city}/{addr.state}
                {addr.is_default && " (Padrão)"}
              </option>
            ))}
          </select>
        ) : (
          <p>Nenhum endereço encontrado. Cadastre abaixo:</p>
        )}

        <div className="mt-3">
          <h6>Adicionar Novo Endereço</h6>
          <div className="row g-2">
            <div className="col-md-6">
              <input 
                name="street" 
                value={newAddress.street} 
                onChange={handleNewAddressChange} 
                className="form-control" 
                placeholder="Rua" 
                required 
              />
            </div>
            <div className="col-md-2">
              <input 
                name="number" 
                value={newAddress.number} 
                onChange={handleNewAddressChange} 
                className="form-control" 
                placeholder="Número" 
                required 
              />
            </div>
            <div className="col-md-4">
              <input 
                name="complement" 
                value={newAddress.complement} 
                onChange={handleNewAddressChange} 
                className="form-control" 
                placeholder="Complemento" 
              />
            </div>
            <div className="col-md-4">
              <input 
                name="district" 
                value={newAddress.district} 
                onChange={handleNewAddressChange} 
                className="form-control" 
                placeholder="Bairro" 
                required 
              />
            </div>
            <div className="col-md-4">
              <input 
                name="city" 
                value={newAddress.city} 
                onChange={handleNewAddressChange} 
                className="form-control" 
                placeholder="Cidade" 
                required 
              />
            </div>
            <div className="col-md-2">
              <input 
                name="state" 
                value={newAddress.state} 
                onChange={handleNewAddressChange} 
                className="form-control" 
                placeholder="UF" 
                maxLength="2"
                required 
              />
            </div>
            <div className="col-md-2">
              <input 
                name="zip_code" 
                value={newAddress.zip_code} 
                onChange={handleNewAddressChange} 
                className="form-control" 
                placeholder="CEP" 
                required 
              />
            </div>
            <div className="col-12 mt-2">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="isDefault"
                  name="is_default"
                  checked={newAddress.is_default}
                  onChange={handleNewAddressChange}
                />
                <label className="form-check-label" htmlFor="isDefault">
                  Definir como endereço padrão
                </label>
              </div>
            </div>
            <div className="col-12 mt-2">
              <button onClick={handleAddAddress} className="btn btn-outline-primary w-100">
                Adicionar Endereço
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Método de pagamento */}
      <div className="mb-4">
        <h5>Forma de Pagamento</h5>
        <select
          className="form-select"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          required
        >
          <option value="">Selecione...</option>
          <option value="pix">Pix</option>
          <option value="boleto">Boleto Bancário</option>
          <option value="card">Cartão de Crédito</option>
        </select>
      </div>

      {/* Botão Confirmar Pedido */}
      {selectedAddressId && paymentMethod && (
        <button className="btn btn-success w-100" onClick={handleConfirmOrder}>
          Confirmar Pedido
        </button>
      )}
    </div>
  );
};

export default CheckoutFinalPage;