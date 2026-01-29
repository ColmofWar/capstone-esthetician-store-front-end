import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import ProductCard from "./ProductCard";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await apiRequest("/products");
                setProducts(res.products || []);
            } catch (err) {
                setError(err.message || "Error loading products");
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    if (loading) return <div>Loading products...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div>
            <h1>Products</h1>
            <div className="product-list">
                {products.length === 0 ? (
                    <div>No products found.</div>
                ) : (
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                )}
            </div>
        </div>
    );
}

export default ProductList;