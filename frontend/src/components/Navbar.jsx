import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaStore,
  FaShoppingCart,
} from "react-icons/fa";
import { useCart } from "../contexts/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  // const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalItems = (cartItems || []).reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <FaStore className="me-2" />
          Loja Virtual
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center"
                to="/carrinho"
              >
                <FaShoppingCart className="me-1" />
                Carrinho ({totalItems})
              </Link>
            </li>

            {user ? (
              <>
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle d-flex align-items-center btn btn-link"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    type="button"
                  >
                    <FaUserCircle className="me-2" />
                    Olá, {user.full_name || user.username}
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="userDropdown"
                  >
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Minha Conta
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/meus-pedidos">
                        Meus Pedidos
                      </Link>
                    </li>
                    {user.user_type === 'A' && (
                      <li>
                        <Link className="dropdown-item text-primary" to="/admin/pedidos">
                          Painel Admin
                        </Link>
                      </li>
                    )}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger d-flex align-items-center"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt className="me-2" />
                        Sair
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link
                  className="btn btn-outline-primary d-flex align-items-center"
                  to="/login"
                >
                  <FaSignInAlt className="me-1" />
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
