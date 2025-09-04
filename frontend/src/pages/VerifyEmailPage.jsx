import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/http";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // O e-mail pode ser passado via state ou query
  const email = location.state?.email || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const resp = await api.post("/auth/verify-email/", { email, code });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || "Erro ao verificar código.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h2>Verificação de E-mail</h2>
      <p>Digite o código que você recebeu no e-mail <b>{email}</b>.</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Código de verificação</label>
          <input
            type="text"
            className="form-control"
            value={code}
            onChange={e => setCode(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">Conta verificada! Redirecionando...</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Verificando..." : "Verificar"}
        </button>
      </form>
    </div>
  );
};

export default VerifyEmailPage;
