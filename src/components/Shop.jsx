import React, { useState } from "react";
import ProductList from "./ProductList";
import CategoryList from "./CategoryList";

function Shop() {
    const [selectedCategory, setSelectedCategory] = useState(null);

    return (
        <div>
            <h1>Skinn Savvy's Shop</h1>
            <p className="muted">Browse products and click to view details.</p>
            <div style={{ display: "flex", gap: "2rem" }}>
                <CategoryList onSelectCategory={setSelectedCategory} />
                <div style={{ flex: 1 }}>
                    <ProductList category={selectedCategory} />
                </div>
            </div>
        </div>
    );
}

export default Shop;