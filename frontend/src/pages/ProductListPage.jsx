import React, { useContext, useEffect, useState } from "react";
import { fetchProducts } from "../api/products";
import { Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import BreadcrumbHeader from "../components/BreadcrumbHeader";
import ImageZoomModal from "../components/ImageZoomModal";
import { CartContext } from "../contexts/CartContext";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomImages, setZoomImages] = useState([]);
  const [zoomStartIndex, setZoomStartIndex] = useState(0);

  useEffect(() => {
    const carregarProdutos = async () => {
      const dados = await fetchProducts();
      setProducts(dados);
    };
    carregarProdutos();
  }, []);

  const handleImageClick = (images, index) => {
    setZoomImages(images);
    setZoomStartIndex(index);
    setShowZoom(true);
  };

  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="container mt-4">
      <BreadcrumbHeader title="Vitrine de Produtos" />

      <div className="row">
        {products.length === 0 && (
          <div className="col-12">
            <p>Nenhum produto encontrado.</p>
          </div>
        )}
        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card h-100">
              {product.images && product.images.length > 0 && (
                <Carousel interval={null}>
                  {product.images.map((img, index) => (
                    <Carousel.Item key={index}>
                      <img
                        src={img.image}
                        className="d-block w-100"
                        alt={`Imagem ${index + 1}`}
                        style={{
                          maxHeight: "200px",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={() => handleImageClick(product.images, index)}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              )}
              <div className="card-body">
                <Link
                  to={`/produtos/${product.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                </Link>
              </div>
              <div className="card-footer d-flex justify-content-between align-items-center">
                <strong>R$ {parseFloat(product.price).toFixed(2)}</strong>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                >
                  Adicionar ao carrinho
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ImageZoomModal
        show={showZoom}
        onHide={() => setShowZoom(false)}
        images={zoomImages}
        initialIndex={zoomStartIndex}
      />
    </div>
  );
};

export default ProductListPage;
