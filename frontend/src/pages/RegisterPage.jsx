import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { cartItems } = useCart();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (form.password !== form.confirmPassword) {
      setError("As senhas não conferem.");
      setLoading(false);
      return;
    }
    try {
    // Limpa localStorage antes de registrar novo usuário
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
      const resp = await registerUser({
        full_name: form.full_name,
        email: form.email,
        password: form.password
      });
      // Se precisa verificar e-mail, redireciona para tela de verificação
      if (resp.need_verification) {
        navigate("/verify-email", { state: { email: form.email } });
        return;
      }
      // Caso não precise, segue fluxo normal
      await login(form.email, form.password);
      if (cartItems && cartItems.length > 0) {
        // Aqui pode implementar lógica para atrelar carrinho ao usuário
        // Exemplo: enviar itens para backend associando ao novo usuário
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Erro ao cadastrar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome completo</label>
          <input type="text" name="full_name" className="form-control" value={form.full_name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">E-mail</label>
          <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Senha</label>
          <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirmar Senha</label>
          <input type="password" name="confirmPassword" className="form-control" value={form.confirmPassword} onChange={handleChange} required />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
