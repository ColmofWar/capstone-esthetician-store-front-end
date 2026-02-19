import React, { useEffect, useState, useContext } from "react";
import { apiRequest } from "../api";
import useAddToCart from "../hooks/useAddToCart";
import UserContext from "../UserContext";

function ShoppingCart() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useContext(UserContext);
    const { addToCart, loading: addLoading, error: addError } = useAddToCart();

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }
        async function fetchCart() {
            setLoading(true);
            setError(null);
            try {
                const res = await apiRequest(`/shopping_cart_items/${currentUser.username}`, {
                    method: "get"
                });
                setCart(res.cart?.items || []);
                console.log("Fetched cart:", res.cart);
                console.log("Cart items:", res.cart?.items);
            } catch (err) {
                setError(err.message || "Error loading cart");
            } finally {
                setLoading(false);
            }
        }
        fetchCart();
    }, [currentUser]);


    const handleRemove = async (itemId) => {
        try {
            const token = localStorage.getItem("token");
            console.log("Removing item with id:", itemId);
            await apiRequest(`/shopping_cart_items/${currentUser.username}/${itemId}`, {
                console: "Removing item with id:", itemId,
                method: "delete"
            });
            setCart(cart.filter(item => item.id !== itemId));
        } catch (err) {
            setError(err.message || "Error removing item");
        }
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        const item = cart.find(i => i.id === itemId);
        if (!item) return;
        // Use the correct product_id for the API call
        const success = await addToCart({ ...item, id: item.product_id }, newQuantity);
        if (success) {
            setCart(cart.map(i => i.id === itemId ? { ...i, quantity: newQuantity } : i));
        } else if (addError) {
            setError(addError);
        }
    };

    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // Show addError if present
    useEffect(() => {
        if (addError) setError(addError);
    }, [addError]);

    if (!currentUser) {
        return (
            <div>
                <h1>Your Shopping Cart</h1>
                <div>Please log in to view your shopping cart.</div>
            </div>
        );
    }

    return (
        <div>
            <h1>Your Shopping Cart</h1>
            {loading ? (
                <div>Loading cart...</div>
            ) : error ? (
                <div style={{ color: "red" }}>{error}</div>
            ) : cart.length === 0 ? (
                <div>Your cart is empty.</div>
            ) : (
                <div>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {cart.map(item => (
                            <li key={item.id} style={{ marginBottom: "1rem", borderBottom: "1px solid #eee", paddingBottom: "1rem" }}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    {item.image_url && (
                                        <img src={item.image_url} alt={item.name} style={{ width: 60, height: 60, objectFit: "cover", marginRight: 16 }} />
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <div><strong>{item.name}</strong></div>
                                        <div>Price: ${item.price}</div>
                                        <div>
                                            Quantity: {" "}
                                            <select
                                                value={item.quantity}
                                                min={1}
                                                max={item.stock_quantity || 10}
                                                onChange={e => handleQuantityChange(item.id, Number(e.target.value))}
                                                disabled={loading}
                                                style={{ marginLeft: 4, padding: '0.2rem 0.5rem', borderRadius: 4 }}
                                            >
                                                {Array.from({ length: Math.min(item.stock_quantity || 10, 10) }, (_, i) => i + 1).map(qty => (
                                                    <option key={qty} value={qty}>{qty}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <button onClick={() => handleRemove(item.id)} style={{ background: "#e91e63", color: "#fff", border: "none", borderRadius: 8, padding: "0.5rem 1rem", cursor: "pointer" }}>Remove</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div style={{ fontWeight: 700, fontSize: "1.2rem", marginTop: 16 }}>Total: ${total.toFixed(2)}</div>
                </div>
            )}
        </div>
    );
}

export default ShoppingCart;