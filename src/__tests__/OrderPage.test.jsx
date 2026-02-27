import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import OrderPage from "../components/OrderPage";
import UserContext from "../UserContext";
import { fireEvent, waitFor } from "@testing-library/react";
jest.mock("../api", () => ({
  apiRequest: jest.fn(() => Promise.resolve({}))
}));
import { apiRequest } from "../api";

const mockUser = {
  username: "testuser",
  email: "test@example.com",
  phone: "1234567890"
};
const mockHomeAddress = {
  street: "123 Main St",
  city: "Testville",
  state: "TS",
  postal_code: "12345",
  country: "Testland"
};
const mockBillingAddress = {
  street: "456 Side St",
  city: "Billtown",
  state: "BL",
  postal_code: "67890",
  country: "Billland"
};
const mockCart = [
  { id: 1, name: "Product A", price: 10.5, quantity: 2 },
  { id: 2, name: "Product B", price: 5.25, quantity: 1 }
];

function renderOrderPageWithCart(cart = mockCart) {
  return render(
    <UserContext.Provider value={{
      currentUser: mockUser,
      homeAddress: mockHomeAddress,
      billingAddress: mockBillingAddress
    }}>
      <MemoryRouter initialEntries={[{ pathname: "/order", state: { cart } }]}> 
        <Routes>
          <Route path="/order" element={<OrderPage />} />
        </Routes>
      </MemoryRouter>
    </UserContext.Provider>
  );
}

test("renders order summary with cart items and total", () => {
  renderOrderPageWithCart();
  expect(screen.getByText(/Product A/)).toBeInTheDocument();
  expect(screen.getByText(/Qty: 2/)).toBeInTheDocument();
    expect(screen.getByText(/Price: \$10.50/)).toBeInTheDocument(); // This line remains unchanged
  expect(screen.getByText((content) => content.includes("Product A"))).toBeInTheDocument();
  expect(screen.getByText((content) => content.includes("Qty: 2"))).toBeInTheDocument();
  expect(screen.getByText((content) => content.includes("Price: $10.50"))).toBeInTheDocument();
  expect(screen.getByText((content) => content.includes("Product B"))).toBeInTheDocument();
  expect(screen.getByText((content) => content.includes("Qty: 1"))).toBeInTheDocument();
  expect(screen.getByText((content) => content.includes("Price: $5.25"))).toBeInTheDocument();
  expect(screen.getByText((content) => content.includes("Final Total: $26.25"))).toBeInTheDocument();
  renderOrderPageWithCart([]);
  expect(screen.getByText(/No items in cart/)).toBeInTheDocument();
  expect(screen.getByText(/Final Total: \$0.00/)).toBeInTheDocument();
});

// Additional tests for contact and address info

test("renders user contact and address info", () => {
  renderOrderPageWithCart();
  // Username
  expect(screen.getByText("Username:").parentElement.textContent).toContain("Username:");
  expect(screen.getByText("Username:").parentElement.textContent).toContain("testuser");
  // Email
  expect(screen.getByText("Email:").parentElement.textContent).toContain("Email:");
  expect(screen.getByText("Email:").parentElement.textContent).toContain("test@example.com");
  // Phone
  expect(screen.getByText("Phone:").parentElement.textContent).toContain("Phone:");
  expect(screen.getByText("Phone:").parentElement.textContent).toContain("1234567890");
  // Shipping Address
  expect(screen.getAllByText("Street:")[0].parentElement.textContent).toContain("123 Main St");
  expect(screen.getAllByText("City:")[0].parentElement.textContent).toContain("Testville");
  expect(screen.getAllByText("State:")[0].parentElement.textContent).toContain("TS");
  expect(screen.getAllByText("Postal Code:")[0].parentElement.textContent).toContain("12345");
  expect(screen.getAllByText("Country:")[0].parentElement.textContent).toContain("Testland");
  // Billing Address
  expect(screen.getAllByText("Street:")[1].parentElement.textContent).toContain("456 Side St");
  expect(screen.getAllByText("City:")[1].parentElement.textContent).toContain("Billtown");
  expect(screen.getAllByText("State:")[1].parentElement.textContent).toContain("BL");
  expect(screen.getAllByText("Postal Code:")[1].parentElement.textContent).toContain("67890");
  expect(screen.getAllByText("Country:")[1].parentElement.textContent).toContain("Billland");
});

test("confirm order removes cart items and shows thank you message", async () => {
  renderOrderPageWithCart();
  const confirmBtn = screen.getByText(/Confirm Order/i);
  expect(confirmBtn).toBeInTheDocument();
  fireEvent.click(confirmBtn);
  await waitFor(() => {
    expect(screen.getByText(/Thank you for your purchase/i)).toBeInTheDocument();
  });
  // Check API calls
  expect(apiRequest).toHaveBeenCalledWith("/shopping_cart_items/testuser/1", expect.objectContaining({ method: "delete" }));
  expect(apiRequest).toHaveBeenCalledWith("/shopping_cart_items/testuser/2", expect.objectContaining({ method: "delete" }));
});
