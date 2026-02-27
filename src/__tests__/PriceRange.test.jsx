import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PriceRange from "../components/PriceRange";

describe("PriceRange", () => {
  const setup = (props = {}) => {
    const defaultProps = {
      min: 0,
      max: 1000,
      value: { min_price: 100, max_price: 900 },
      onChange: jest.fn(),
      ...props,
    };
    render(<PriceRange {...defaultProps} />);
    return defaultProps;
  };

  it("renders min and max price labels and sliders", () => {
    setup();
    // The label text is present
    expect(screen.getByText(/Min Price/i)).toBeInTheDocument();
    expect(screen.getByText(/Max Price/i)).toBeInTheDocument();
    // The sliders are present
    expect(screen.getByRole("slider", { name: /Min Price/i })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: /Max Price/i })).toBeInTheDocument();
  });

  it("shows correct price values in labels", () => {
    setup({ value: { min_price: 123, max_price: 456 } });
    expect(screen.getByText(/\$123/)).toBeInTheDocument();
    expect(screen.getByText(/\$456/)).toBeInTheDocument();
  });

  it("calls onChange with updated min_price when min slider changes", () => {
    const { onChange, value } = setup();
    const minSlider = screen.getByRole("slider", { name: /Min Price/i });
    fireEvent.change(minSlider, { target: { value: "200" } });
    expect(onChange).toHaveBeenCalledWith({ ...value, min_price: "200" });
  });

  it("calls onChange with updated max_price when max slider changes", () => {
    const { onChange, value } = setup();
    const maxSlider = screen.getByRole("slider", { name: /Max Price/i });
    fireEvent.change(maxSlider, { target: { value: "800" } });
    expect(onChange).toHaveBeenCalledWith({ ...value, max_price: "800" });
  });

  it("handles missing or empty value props gracefully", () => {
    setup({ value: {} });
    expect(screen.getByText(/\$0/)).toBeInTheDocument();
    expect(screen.getByText(/\$1000/)).toBeInTheDocument();
  });
});
