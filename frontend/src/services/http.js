import axios from 'axios';
import { refreshToken, logoutUser } from '../api/auth';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Enviar o token de acesso
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Tentar renovar o token automaticamente se der erro 401
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccess = await refreshToken();
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (err) {
        logoutUser();
        window.location.href = '/login'; // redireciona ao login
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;