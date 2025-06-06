import React from "react";
import PrivateRoute from "./routes/PrivateRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// CONTEXTS
import { useAuth } from "./contexts/AuthContext";
// COMPONENTS
import Spinner from "./components/Spinner";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
// PAGES
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PedidoFinalizadoPage from "./pages/PedidoFinalizadoPage";
import MeusPedidosPage from "./pages/MeusPedidosPage";
import MeusPedidoDetalhesPage from "./pages/MeusPedidosDetalhePage";
import CheckoutFinalPage from "./pages/CheckoutFinalPage";
import AdminPedidosPage from "./pages/admin/AdminPedidosPage";

function App() {
  const { loading } = useAuth();

  if (loading) return <Spinner />;

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/produtos/:id" element={<ProductDetailPage />} />
        <Route path="/carrinho" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route
          path="/pedido-finalizado/:id"
          element={<PedidoFinalizadoPage />}
        />
        <Route
          path="/meus-pedidos"
          element={
            <RequireAuth>
              <MeusPedidosPage />
            </RequireAuth>
          }
        />
        <Route path="/meus-pedidos/:id" element={<MeusPedidoDetalhesPage />} />
        <Route path="/checkout/endereco" element={<CheckoutFinalPage />} />
         <Route path="/admin/pedidos" element={<AdminPedidosPage />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
