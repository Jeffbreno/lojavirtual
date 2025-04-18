import React from "react";
import { useNavigate } from "react-router-dom";

const BreadcrumbHeader = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h2>{title}</h2>
      <button
        className="btn btn-outline-secondary btn-sm"
        onClick={() => navigate(-1)}
      >
        ⬅️ Voltar
      </button>
    </div>
  );
};

export default BreadcrumbHeader;
