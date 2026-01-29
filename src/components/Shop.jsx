import React, { useState } from "react";
import ProductList from "./ProductList";
import FilterBar from "./FilterBar";

function Shop() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [priceRange, setPriceRange] = useState({ min_price: '', max_price: '' });
    const [priceStats, setPriceStats] = useState({ min: 0, max: 1000 });

    return (
        <div>
            <h1>Skinn Savvy's Shop</h1>
            <p className="muted">Browse products and click to view details.</p>
            <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
                <div style={{ minWidth: 260, maxWidth: 320, flex: "0 0 260px" }}>
                    <FilterBar
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                        priceRange={priceRange}
                        onPriceRangeChange={setPriceRange}
                        min={priceStats.min}
                        max={priceStats.max}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <ProductList
                        category={selectedCategory}
                        priceRange={priceRange}
                        onPriceStats={setPriceStats}
                    />
                </div>
            </div>
        </div>
    );
}

export default Shop;