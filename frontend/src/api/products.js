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

export const fetchProductById = async (id) => {
  const response = await fetch(`http://localhost:8000/api/products/${id}/`);
  const data = await response.json();
  return data;
};

