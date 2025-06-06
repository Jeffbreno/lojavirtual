import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaLock, FaUser } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials.username, credentials.password);
      navigate(from, { replace: true }); 
    } catch (err) {
      setError("Usuário ou senha inválidos");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4 d-flex align-items-center">
        <FaSignInAlt className="me-2" />
        Entrar na Conta
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            <FaUser className="me-1" />
            Usuário
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            <FaLock className="me-1" />
            Senha
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          <FaSignInAlt className="me-2" />
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
