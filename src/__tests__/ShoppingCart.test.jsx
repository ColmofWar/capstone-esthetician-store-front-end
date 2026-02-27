import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ShoppingCart from "../components/ShoppingCart";
import UserContext from "../UserContext";

// Mock useAddToCart
jest.mock("../hooks/useAddToCart", () => () => ({
  addToCart: jest.fn(() => Promise.resolve(true)),
  loading: false,
  error: null,
}));
// Mock apiRequest
jest.mock("../api", () => ({
  apiRequest: jest.fn(),
}));
import { apiRequest } from "../api";

describe("ShoppingCart", () => {
  const currentUser = { username: "testuser" };
  const cartItems = [
    { id: 1, product_id: 1, name: "A", price: 10, quantity: 2, stock_quantity: 5, image_url: "img1" },
    { id: 2, product_id: 2, name: "B", price: 20, quantity: 1, stock_quantity: 3, image_url: "img2" },
  ];

  function renderCart(ctxOverrides = {}) {
    render(
      <UserContext.Provider value={{ currentUser, ...ctxOverrides }}>
        <ShoppingCart />
      </UserContext.Provider>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows login prompt if not logged in", () => {
    renderCart({ currentUser: null });
    expect(screen.getByText(/Please log in/i)).toBeInTheDocument();
  });

  it("shows loading state", () => {
    renderCart();
    expect(screen.getByText(/Loading cart/i)).toBeInTheDocument();
  });

  it("shows error if fetch fails", async () => {
    apiRequest.mockRejectedValueOnce(new Error("fail"));
    renderCart();
    await waitFor(() => {
      expect(screen.getByText(/fail/i)).toBeInTheDocument();
    });
  });

  it("shows empty cart message", async () => {
    apiRequest.mockResolvedValueOnce({ cart: { items: [] } });
    renderCart();
    await waitFor(() => {
      expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
    });
  });

  it("renders cart items and total", async () => {
    apiRequest.mockResolvedValueOnce({ cart: { items: cartItems } });
    renderCart();
    await waitFor(() => {
      expect(screen.getByText("A")).toBeInTheDocument();
      expect(screen.getByText("B")).toBeInTheDocument();
      expect(screen.getByText(/Total: \$40.00/)).toBeInTheDocument();
    });
  });

  it("removes item from cart on Remove click", async () => {
    apiRequest.mockResolvedValueOnce({ cart: { items: cartItems } });
    apiRequest.mockResolvedValueOnce({}); // for delete
    renderCart();
    await waitFor(() => expect(screen.getByText("A")).toBeInTheDocument());
    fireEvent.click(screen.getAllByText(/Remove/i)[0]);
    await waitFor(() => {
      // After removal, only B remains
      expect(screen.queryByText("A")).not.toBeInTheDocument();
      expect(screen.getByText("B")).toBeInTheDocument();
    });
  });

  it("changes quantity and updates cart", async () => {
    apiRequest.mockResolvedValueOnce({ cart: { items: cartItems } });
    renderCart();
    await waitFor(() => expect(screen.getByText("A")).toBeInTheDocument());
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "3" } });
    await waitFor(() => {
      expect(selects[0]).toHaveValue("3");
    });
  });
});
