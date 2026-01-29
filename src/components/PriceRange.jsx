// src/components/PriceRange.jsx
import React from "react";


function PriceRange({ min, max, onChange, value }) {
  // Ensure min and max are numbers and min <= max
  const minValue = typeof min === 'number' ? min : 0;
  const maxValue = typeof max === 'number' ? max : 1000;
  const minPrice = value.min_price !== undefined && value.min_price !== '' ? Number(value.min_price) : minValue;
  const maxPrice = value.max_price !== undefined && value.max_price !== '' ? Number(value.max_price) : maxValue;

  return (
    <div className="price-range-filter" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <label htmlFor="min-price">Min Price: <b>${minPrice}</b></label>
      <input
        id="min-price"
        type="range"
        min={minValue}
        max={maxValue}
        value={minPrice}
        onChange={e => onChange({ ...value, min_price: e.target.value })}
        style={{ width: '100%' }}
      />
      <label htmlFor="max-price">Max Price: <b>${maxPrice}</b></label>
      <input
        id="max-price"
        type="range"
        min={minValue}
        max={maxValue}
        value={maxPrice}
        onChange={e => onChange({ ...value, max_price: e.target.value })}
        style={{ width: '100%' }}
      />
    </div>
  );
}

export default PriceRange;
