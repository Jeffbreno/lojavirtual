const CreditCardForm = ({ value, onChange }) => {
  const handleInputChange = (e) => {
    const { name, value: inputValue } = e.target;
    onChange({
      ...value,
      [name]: inputValue,
    });
  };

  return (
    <div className="card p-3 mb-3">
      <h6 className="mb-3">Dados do Cartão</h6>

      <div className="form-group mb-2">
        <label>Número do Cartão</label>
        <input
          type="text"
          name="cardNumber"
          className="form-control"
          placeholder="0000 0000 0000 0000"
          value={value.cardNumber}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group mb-2">
        <label>Nome no Cartão</label>
        <input
          type="text"
          name="cardHolder"
          className="form-control"
          placeholder="Nome completo"
          value={value.cardHolder}
          onChange={handleInputChange}
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-2">
          <label>Validade</label>
          <input
            type="text"
            name="expiryDate"
            className="form-control"
            placeholder="MM/AA"
            value={value.expiryDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="col-md-6 mb-2">
          <label>CVV</label>
          <input
            type="text"
            name="cvv"
            className="form-control"
            placeholder="123"
            value={value.cvv}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CreditCardForm;