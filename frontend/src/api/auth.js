import api from "../services/http";

export const loginUser = async (username, password) => {
  const response = await api.post('/token/', { username, password });
  const { access, refresh } = response.data;

  localStorage.setItem('access', access);
  localStorage.setItem('refresh', refresh);
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

export const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh');
  const response = await api.post('/token/refresh/', { refresh });
  const { access } = response.data;

  localStorage.setItem('access', access);
  return access;
};
