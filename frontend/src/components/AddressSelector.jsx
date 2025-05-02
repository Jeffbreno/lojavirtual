import React, { useEffect, useState } from "react";
import { getAddresses } from "../api/addresses";

const AddressSelector = ({ selectedAddressId, onSelect }) => {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAddresses();
        setAddresses(data);
      } catch (error) {
        console.error("Erro ao buscar endereços:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="mb-4">
      <h5>Endereço de Entrega</h5>
      {addresses.length === 0 ? (
        <div className="alert alert-warning">Nenhum endereço cadastrado.</div>
      ) : (
        <div className="list-group">
          {addresses.map((address) => (
            <label
              key={address.id}
              className={`list-group-item ${selectedAddressId === address.id ? "active" : ""}`}
              style={{ cursor: "pointer" }}
            >
              <input
                type="radio"
                className="form-check-input me-2"
                name="address"
                value={address.id}
                checked={selectedAddressId === address.id}
                onChange={() => onSelect(address.id)}
              />
              {address.street}, {address.number} - {address.city}, {address.state}
            </label>
          ))}
        </div>
      )}
      {/* Aqui pode ir um botão futuramente para cadastrar/editar endereços */}
    </div>
  );
};

export default AddressSelector;
