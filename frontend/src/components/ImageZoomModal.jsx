import React, { useEffect, useState } from "react";
import { Carousel, Modal } from "react-bootstrap";

const ImageZoomModal = ({ show, onHide, images, initialIndex = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    if (show) {
      setActiveIndex(initialIndex);
    }
  }, [show, initialIndex]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Visualização da Imagem</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Carousel
          activeIndex={activeIndex}
          onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
          interval={null}
        >
          {images.map((img, index) => (
            <Carousel.Item key={index}>
              <img
                src={img.image}
                alt={`Imagem ${index + 1}`}
                className="d-block w-100"
                style={{ maxHeight: "600px", objectFit: "contain" }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </Modal.Body>
    </Modal>
  );
};

export default ImageZoomModal;
