import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfile, logoutUser } from "../api/auth";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaStore,
} from "react-icons/fa";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("access")) {
      fetchProfile();
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand d-flex align-items-center" to="/">
        <FaStore className="me-2" />
        Ecompro
      </Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          {user && (
            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center"
                to="/profile"
              >
                <FaUserCircle className="me-1" />
                Perfil
              </Link>
            </li>
          )}
        </ul>

        <div className="d-flex align-items-center">
          {user ? (
            <>
              <span className="navbar-text me-3">
                Olá, {user.full_name || user.username}!
              </span>
              <button
                className="btn btn-outline-danger d-flex align-items-center"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="me-1" />
                Sair
              </button>
            </>
          ) : (
            <Link
              className="btn btn-outline-primary d-flex align-items-center"
              to="/login"
            >
              <FaSignInAlt className="me-1" />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
