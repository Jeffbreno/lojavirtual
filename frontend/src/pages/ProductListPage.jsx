import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api/products';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const carregarProdutos = async () => {
      const dados = await fetchProducts();
      setProducts(dados);
    };
    carregarProdutos();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Vitrine de Produtos</h2>
      <div className="row">
        {products.length === 0 && (
          <div className="col-12">
            <p>Nenhum produto encontrado.</p>
          </div>
        )}
        {products.map(product => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card h-100">
              {product.images && product.images.length > 0 && (
                <img
                  src={product.images[0].image}
                  className="card-img-top"
                  alt={product.name}
                  style={{ maxHeight: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
              </div>
              <div className="card-footer">
                <strong>R$ {parseFloat(product.price).toFixed(2)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;
