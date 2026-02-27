import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ProductList from "../components/ProductList";

// Mock ProductCard to avoid deep rendering
jest.mock("../components/ProductCard", () => ({ product }) => (
  <div data-testid="product-card">{product ? product.name : "No Product"}</div>
));

// Mock apiRequest
jest.mock("../api", () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from "../api";

describe("ProductList", () => {
  const products = [
    { id: 1, name: "A", price: 10 },
    { id: 2, name: "B", price: 20 },
    { id: 3, name: "C", price: 30 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    render(<ProductList />);
    expect(screen.getByText(/Loading products/i)).toBeInTheDocument();
  });

  it("renders products after fetch", async () => {
    apiRequest.mockResolvedValueOnce({ products });
    render(<ProductList />);
    await waitFor(() => {
      expect(screen.getByText("Products")).toBeInTheDocument();
      expect(screen.getAllByTestId("product-card")).toHaveLength(products.length);
    });
  });

  it("renders error message on fetch failure", async () => {
    apiRequest.mockRejectedValueOnce(new Error("fail"));
    render(<ProductList />);
    await waitFor(() => {
      expect(screen.getByText(/fail/i)).toBeInTheDocument();
    });
  });

  it("filters products by price range", async () => {
    apiRequest.mockResolvedValueOnce({ products });
    render(<ProductList priceRange={{ min_price: 15, max_price: 25 }} />);
    await waitFor(() => {
      const cards = screen.getAllByTestId("product-card");
      expect(cards).toHaveLength(1);
      expect(cards[0]).toHaveTextContent("B");
    });
  });

  it("shows 'No products found' if filter excludes all", async () => {
    apiRequest.mockResolvedValueOnce({ products });
    render(<ProductList priceRange={{ min_price: 100, max_price: 200 }} />);
    await waitFor(() => {
      expect(screen.getByText(/No products found/i)).toBeInTheDocument();
    });
  });
});
