import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductCard from "../components/ProductCard";

// Mock useAddToCart hook
jest.mock("../hooks/useAddToCart", () => () => ({
  addToCart: jest.fn(() => Promise.resolve(true)),
  loading: false,
  error: null,
}));

describe("ProductCard", () => {
  const product = {
    id: 1,
    name: "Test Product",
    brand: "Test Brand",
    description: "A great product",
    price: 19.99,
    stock_quantity: 5,
    image_url: "http://example.com/image.jpg",
    alt_text: "Test Product Image",
  };

  it("renders product details", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(product.brand)).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
    expect(screen.getByText(`$${product.price}`)).toBeInTheDocument();
    expect(screen.getByText(`In Stock: ${product.stock_quantity}`)).toBeInTheDocument();
    expect(screen.getByAltText(product.alt_text)).toBeInTheDocument();
  });

  it("renders quantity select with correct options", () => {
    render(<ProductCard product={product} />);
    const select = screen.getByLabelText(/Quantity/i);
    expect(select).toBeInTheDocument();
    expect(select.tagName).toBe("SELECT");
    expect(select.children).toHaveLength(product.stock_quantity);
  });

  it("calls addToCart and shows alert on Add to Cart click", async () => {
    window.alert = jest.fn();
    render(<ProductCard product={product} />);
    const button = screen.getByRole("button", { name: /Add to Cart/i });
    fireEvent.click(button);
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining(`Added 1 × ${product.name} to cart!`)
      );
    });
  });

  it("disables Add to Cart button if out of stock", () => {
    render(<ProductCard product={{ ...product, stock_quantity: 0 }} />);
    const button = screen.getByRole("button", { name: /Add to Cart/i });
    expect(button).toBeDisabled();
    expect(screen.getByText(/Out of Stock/i)).toBeInTheDocument();
  });

  it("renders nothing if no product is provided", () => {
    const { container } = render(<ProductCard product={null} />);
    expect(container.firstChild).toBeNull();
  });
});
