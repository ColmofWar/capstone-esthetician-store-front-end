// src/components/ProductCard.jsx
import React from "react";

/**
 * ProductCard component displays a single product's details.
 * @param {Object} props
 * @param {Object} props.product - The product object to display
 */
function ProductCard({ product }) {
  if (!product) return null;
  return (
    <div className="product-card">
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.alt_text || product.name}
          className="product-card-image"
        />
      )}
      <div className="product-card-body">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-brand">{product.brand}</p>
        <p className="product-card-description">{product.description}</p>
        <p className="product-card-price">${product.price}</p>
        <p className="product-card-stock">
          {product.stock_quantity > 0 ? `In Stock: ${product.stock_quantity}` : "Out of Stock"}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;
