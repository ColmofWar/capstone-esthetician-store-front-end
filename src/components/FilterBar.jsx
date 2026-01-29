// src/components/FilterBar.jsx
import React from "react";
import CategoryList from "./CategoryList";
import PriceRange from "./PriceRange";

function FilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceRangeChange,
  min,
  max
}) {
  return (
    <div className="filter-bar" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'stretch', marginBottom: '1.5rem' }}>
      <CategoryList
        onSelectCategory={onSelectCategory}
        selectedCategory={selectedCategory}
      />
      <PriceRange
        value={priceRange}
        onChange={onPriceRangeChange}
        min={min}
        max={max}
      />
    </div>
  );
}

export default FilterBar;
