import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

function RequireAdmin({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || user.user_type !== 'A') {
    // Redireciona para home se não for admin
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}

export default RequireAdmin;
