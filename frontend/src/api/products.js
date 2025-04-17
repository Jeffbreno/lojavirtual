import axios from '../services/http';

export const fetchProducts = async () => {
  try {
    const response = await axios.get('/products/');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
};
