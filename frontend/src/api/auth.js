import api from "../services/http";

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login/', { email, password });
  const { access, refresh } = response.data;

  localStorage.setItem('access', access);
  localStorage.setItem('refresh', refresh);
  return response.data;
};

export const registerUser = async ({ full_name, email, password }) => {
  const username = email.split('@')[0] + Math.floor(Math.random() * 10000);
  const response = await api.post('/auth/register/', {
    username,
    full_name,
    email,
    password
  });
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile/');
  return response.data;
};

export const verifyEmail = async (email, code) => {
  const response = await api.post("/auth/verify-email/", { email, code });
  return response.data;
};

export const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh');
  const response = await api.post('/token/refresh/', { refresh });
  const { access } = response.data;

  localStorage.setItem('access', access);
  return access;
};
