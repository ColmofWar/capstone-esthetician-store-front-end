// src/components/ProductCard.jsx

import React from "react";
import useAddToCart from "../hooks/useAddToCart";
import "../css/ProductCard.css";

/**
 * ProductCard component displays a single product's details.
 * @param {Object} props
 * @param {Object} props.product - The product object to display
 */


function ProductCard({ product }) {
  const { addToCart, loading, error } = useAddToCart();
  const [quantity, setQuantity] = React.useState(1);
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
        {product.stock_quantity > 0 && (
          <div style={{ margin: '0.5rem 0' }}>
            <label htmlFor={`quantity-${product.id}`}>Quantity: </label>
            <select
              id={`quantity-${product.id}`}
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              style={{ marginLeft: 4, padding: '0.2rem 0.5rem', borderRadius: 4 }}
            >
              {Array.from({ length: Math.min(product.stock_quantity, 10) }, (_, i) => i + 1).map(qty => (
                <option key={qty} value={qty}>{qty}</option>
              ))}
            </select>
          </div>
        )}
        <button
          className="product-card-buy-btn"
          disabled={product.stock_quantity <= 0 || loading}
          onClick={async () => {
            const success = await addToCart(product, quantity);
            if (success) {
              alert(`Added ${quantity} × ${product.name} to cart!`);
            }
          }}
          style={{
            marginTop: '0.7rem',
            padding: '0.5rem 1.2rem',
            background: '#e91e63',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: product.stock_quantity > 0 && !loading ? 'pointer' : 'not-allowed',
            opacity: product.stock_quantity > 0 && !loading ? 1 : 0.6,
            transition: 'background 0.2s, opacity 0.2s',
          }}
        >
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>
    </div>
  );
}

export default ProductCard;
