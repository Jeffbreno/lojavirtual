import React, { useEffect, useState } from "react";
import { fetchAddresses, createAddress } from "../api/addresses";

const SelectAddress = ({ selectedAddressId, setSelectedAddressId }) => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchAddresses();
      setAddresses(data);
    };
    load();
  }, []);

  const handleAddressChange = (e) => {
    setSelectedAddressId(e.target.value);
  };

  const handleNewAddressSubmit = async (e) => {
    e.preventDefault();
    const created = await createAddress(newAddress);
    setAddresses([...addresses, created]);
    setSelectedAddressId(created.id);
    setNewAddress(null);
  };

  return (
    <div className="mb-4">
      <h5>Endereço de Entrega</h5>
      {addresses.length > 0 ? (
        <>
          <select className="form-control mb-2" value={selectedAddressId} onChange={handleAddressChange}>
            <option value="">Selecione um endereço</option>
            {addresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.street}, {addr.number} - {addr.city}/{addr.state}
              </option>
            ))}
          </select>
          <button className="btn btn-link" onClick={() => setNewAddress({})}>
            Cadastrar novo endereço
          </button>
        </>
      ) : (
        <p>Nenhum endereço encontrado. Cadastre um abaixo.</p>
      )}

      {newAddress !== null && (
        <form onSubmit={handleNewAddressSubmit}>
          <input
            className="form-control mb-2"
            placeholder="Rua"
            value={newAddress.street || ""}
            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
            required
          />
          <input
            className="form-control mb-2"
            placeholder="Número"
            value={newAddress.number || ""}
            onChange={(e) => setNewAddress({ ...newAddress, number: e.target.value })}
            required
          />
          <input
            className="form-control mb-2"
            placeholder="Complemento"
            value={newAddress.complement || ""}
            onChange={(e) => setNewAddress({ ...newAddress, complement: e.target.value })}
          />
          <input
            className="form-control mb-2"
            placeholder="Bairro"
            value={newAddress.district || ""}
            onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
            required
          />
          <input
            className="form-control mb-2"
            placeholder="Cidade"
            value={newAddress.city || ""}
            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            required
          />
          <input
            className="form-control mb-2"
            placeholder="UF"
            value={newAddress.state || ""}
            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
            required
          />
          <input
            className="form-control mb-2"
            placeholder="CEP"
            value={newAddress.zip_code || ""}
            onChange={(e) => setNewAddress({ ...newAddress, zip_code: e.target.value })}
            required
          />
          <button className="btn btn-primary">Salvar Endereço</button>
        </form>
      )}
    </div>
  );
};

export default SelectAddress;
