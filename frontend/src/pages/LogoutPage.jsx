import { useEffect } from 'react';
import { logoutUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    logoutUser();
    navigate('/login');
  }, [navigate]);

  return null;
};

export default LogoutPage;
