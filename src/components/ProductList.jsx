import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import ProductCard from "./ProductCard";



function ProductList({ category, priceRange, onPriceStats }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);


    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            setError(null);
            try {
                const params = {};
                if (category && category.id) {
                    params.category_id = category.id;
                }
                const res = await apiRequest("/products", { params });
                setProducts(res.products || []);
                // Calculate min and max price for the current product set
                if (res.products && res.products.length > 0) {
                    const prices = res.products.map(p => Number(p.price)).filter(p => !isNaN(p));
                    const minP = Math.min(...prices);
                    const maxP = Math.max(...prices);
                    setMinPrice(minP);
                    setMaxPrice(maxP);
                    if (onPriceStats) onPriceStats({ min: minP, max: maxP });
                } else {
                    setMinPrice(0);
                    setMaxPrice(1000);
                    if (onPriceStats) onPriceStats({ min: 0, max: 1000 });
                }
            } catch (err) {
                setError(err.message || "Error loading products");
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [category]);

    if (loading) return <div>Loading products...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    // Filter products by price range if set
    let filteredProducts = products;
    const min = priceRange && priceRange.min_price !== '' ? Number(priceRange.min_price) : minPrice;
    const max = priceRange && priceRange.max_price !== '' ? Number(priceRange.max_price) : maxPrice;
    if (!isNaN(min) && !isNaN(max)) {
        filteredProducts = products.filter(p => {
            const price = Number(p.price);
            return price >= min && price <= max;
        });
    }

    return (
        <div>
            <h1>Products</h1>
            <div className="product-list">
                {filteredProducts.length === 0 ? (
                    <div>No products found.</div>
                ) : (
                    filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                )}
            </div>
        </div>
    );
}

export default ProductList;