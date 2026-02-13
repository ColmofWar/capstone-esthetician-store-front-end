// API utility for frontend requests

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * @param {string} endpoint - API endpoint (e.g., '/products')
 * @param {object} [data] - Data to send (for POST, PATCH, etc.)
 * @param {string} [method='get'] - HTTP method
 * @param {object} [params] - Query parameters for GET requests
 * @returns {Promise<any>} - API response data
 */

// Helper to hash password using SHA-256
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function apiRequest(endpoint, { data = {}, method = "get", params = {} } = {}) {
  // Hash password if present in data
  if (data && typeof data === 'object' && data.password) {
    data = { ...data, password: await hashPassword(data.password) };
  }
  // Get token from localStorage if present
  const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");
  console.log("API Request:", method.toUpperCase(), endpoint, "Data:", data, "Params:");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  try {
    const response = await axios({
      url: BASE_URL + endpoint,
      method,
      params,
      data,
      headers,
    });
    return response.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      throw new Error(err.response.data.error);
    }
    throw new Error(err.message || "API request failed");
  }
}
