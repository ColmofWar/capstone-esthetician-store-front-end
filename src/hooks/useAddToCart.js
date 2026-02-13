import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { apiRequest } from "../api";

export default function useAddToCart() {
  const [username] = useLocalStorage("username", null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function addToCart(product, quantity = 1) {
    if (!username) {
      setError("You must be logged in to add to cart.");
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      await apiRequest(`/shopping_cart_items/${username}`, {
        method: "post",
        data: { product_id: product.id, quantity }
      });
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || "Error adding to cart");
      setLoading(false);
      return false;
    }
  }

  return { addToCart, loading, error };
}
