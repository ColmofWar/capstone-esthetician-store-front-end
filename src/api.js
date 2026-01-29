// Centralized API utility for frontend requests

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * Generic API request function
 * @param {string} endpoint - API endpoint (e.g., '/products')
 * @param {object} [data] - Data to send (for POST, PATCH, etc.)
 * @param {string} [method='get'] - HTTP method
 * @param {object} [params] - Query parameters for GET requests
 * @returns {Promise<any>} - API response data
 */
export async function apiRequest(endpoint, { data = {}, method = "get", params = {} } = {}) {
  try {
    const response = await axios({
      url: BASE_URL + endpoint,
      method,
      params,
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      throw new Error(err.response.data.error);
    }
    throw new Error(err.message || "API request failed");
  }
}

// Example usage:
// import { apiRequest } from "./api";
// const products = await apiRequest("/products");
