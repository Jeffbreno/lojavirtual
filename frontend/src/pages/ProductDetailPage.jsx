import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import { fetchProductById } from "../api/products";
import BreadcrumbHeader from "../components/BreadcrumbHeader";
import ImageZoomModal from "../components/ImageZoomModal";
import { CartContext } from "../contexts/CartContext";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomImages, setZoomImages] = useState([]);
  const [zoomStartIndex, setZoomStartIndex] = useState(0);
  

  useEffect(() => {
    const carregarProduto = async () => {
      const dados = await fetchProductById(id);
      setProduct(dados);
    };
    carregarProduto();
  }, [id]);

  const handleImageClick = (images, index) => {
    setZoomImages(images);
    setZoomStartIndex(index);
    setShowZoom(true);
  };

  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (!product) return <p className="container mt-4">Carregando...</p>;

  return (
    <div className="container mt-4">
      <BreadcrumbHeader title="Detalhes do Produto" />

      <div className="row">
        <div className="col-md-6">
          <Carousel interval={null}>
            {product.images.map((img, index) => (
              <Carousel.Item key={index} onClick={() => handleImageClick(product.images, index)}>
                <img
                  src={img.image}
                  className="d-block w-100"
                  alt={`Imagem ${index + 1}`}
                  style={{
                    maxHeight: "400px",
                    objectFit: "contain",
                    cursor: "zoom-in",
                  }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
        <div className="col-md-6">
          <p className="mt-3">{product.description}</p>
          <h4 className="mt-4">R$ {parseFloat(product.price).toFixed(2)}</h4>
          <button className="btn btn-primary mt-3" onClick={() => handleAddToCart(product)}>
            Adicionar ao carrinho
          </button>
        </div>
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

export default ProductDetailPage;
