import api from "../services/http";

export const getAddresses = async () => {
  const res = await api.get('/auth/addresses/');
  return res.data;
};

export const createAddress = async (address) => {
  const res = await api.post('/auth/addresses/', address);
  return res.data;
};
