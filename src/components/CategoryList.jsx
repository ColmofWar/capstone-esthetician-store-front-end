// src/components/CategoryList.jsx

import React, { useEffect, useState } from "react";
import "../css/CategoryList.css";
import { apiRequest } from "../api";

function CategoryList({ onSelectCategory, selectedCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await apiRequest("/categories");
        setCategories(res.categories || []);
      } catch (err) {
        setError(err.message || "Error loading categories");
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="category-list">
      <h2>Categories</h2>
      <ul>
        <li key="all">
          <button
            className={!selectedCategory ? "selected" : ""}
            onClick={() => onSelectCategory(null)}
          >
            All
          </button>
        </li>
        {categories.map(cat => (
          <li key={cat.id}>
            <button
              className={selectedCategory && selectedCategory.id === cat.id ? "selected" : ""}
              onClick={() => onSelectCategory(cat)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryList;
