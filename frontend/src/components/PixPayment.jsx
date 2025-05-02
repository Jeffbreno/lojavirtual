import React, { useEffect, useState } from "react";
import {QRCodeSVG as QRCode} from 'qrcode.react';

const PixPayment = ({ onPayment }) => {
  const [pixKey, setPixKey] = useState("");

  useEffect(() => {
    // Simula geração de uma chave Pix
    const generateKey = () => {
      const key = `pix-${Math.random().toString(36).substring(2, 10)}`;
      setPixKey(key);
    };
    generateKey();
  }, []);

  return (
    <div className="border rounded p-3 bg-light mb-3">
      <h5>Pagamento via Pix</h5>
      <p>Escaneie o código abaixo com seu app bancário:</p>
      {pixKey && (
        <div className="text-center mb-3">
          <QRCode value={pixKey} size={200} />
          <p className="mt-2">
            <strong>Chave Pix:</strong> {pixKey}
          </p>
        </div>
      )}
      <button className="btn btn-success w-100" onClick={onPayment}>
        Simular Pagamento
      </button>
    </div>
  );
};

export default PixPayment;
