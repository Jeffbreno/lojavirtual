import React from "react";

const PaymentMethodSelector = ({ paymentMethod, onSelect }) => {
  return (
    <div className="mb-4">
      <h5>Forma de Pagamento</h5>
      <select
        className="form-select"
        value={paymentMethod}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">Selecione...</option>
        <option value="card">Cartão</option>
        <option value="pix">Pix</option>
        <option value="boleto">Boleto</option>
      </select>
    </div>
  );
};

export default PaymentMethodSelector;
