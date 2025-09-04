import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile, logoutUser, loginUser } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      if (localStorage.getItem("access")) {
        await fetchProfile();
      }
      setLoading(false);
    };
    initializeUser();
  }, []);

  const login = async (email, password) => {
    await loginUser(email, password); 
    await fetchProfile();  
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para uso fácil
export const useAuth = () => useContext(AuthContext);
