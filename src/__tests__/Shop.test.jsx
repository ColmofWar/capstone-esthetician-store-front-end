import React from "react";
import { render, screen } from "@testing-library/react";
import Shop from "../components/Shop";

// Mock child components to isolate Shop
jest.mock("../components/FilterBar", () => props => (
  <div data-testid="filter-bar">FilterBarMock</div>
));
jest.mock("../components/ProductList", () => props => (
  <div data-testid="product-list">ProductListMock</div>
));

describe("Shop", () => {
  it("renders shop heading, FilterBar, and ProductList", () => {
    render(<Shop />);
    expect(screen.getByText(/Skinn Savvy's Shop/i)).toBeInTheDocument();
    expect(screen.getByText(/Browse products/i)).toBeInTheDocument();
    expect(screen.getByTestId("filter-bar")).toBeInTheDocument();
    expect(screen.getByTestId("product-list")).toBeInTheDocument();
  });
});
