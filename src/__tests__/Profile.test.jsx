import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Profile from "../components/Profile";
import UserContext from "../UserContext";

// Mock apiRequest
jest.mock("../api", () => ({
  apiRequest: jest.fn(),
}));
import { apiRequest } from "../api";

describe("Profile", () => {
  const currentUser = { username: "testuser", email: "test@example.com", phone: "1234567890" };
  const homeAddress = { street: "1 Main", city: "Town", state: "ST", postal_code: "12345", country: "USA" };
  const billingAddress = { street: "2 Main", city: "City", state: "ST", postal_code: "54321", country: "USA" };
  const setHomeAddress = jest.fn();
  const setBillingAddress = jest.fn();

  function renderProfile(ctxOverrides = {}) {
    render(
      <UserContext.Provider
        value={{
          currentUser,
          homeAddress,
          setHomeAddress,
          billingAddress,
          setBillingAddress,
          addressLoading: false,
          addressError: null,
          ...ctxOverrides,
        }}
      >
        <Profile />
      </UserContext.Provider>
    );
  }

  it("renders profile info and address forms", () => {
    renderProfile();
    expect(screen.getByText(/Your Profile/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toHaveValue(currentUser.username);
    expect(screen.getByLabelText(/Email/i)).toHaveValue(currentUser.email);
    expect(screen.getByLabelText(/Phone/i)).toHaveValue(currentUser.phone);
    expect(screen.getByText(/Home Address/i)).toBeInTheDocument();
    // There are two elements with 'Billing Address' (heading and button), so check at least one exists
    expect(screen.getAllByText(/Billing Address/i).length).toBeGreaterThanOrEqual(1);
  });

  it("submits profile update and shows success", async () => {
    apiRequest.mockResolvedValueOnce({});
    renderProfile();
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "new@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Update Profile/i }));
    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith("/users/testuser", expect.any(Object));
      expect(screen.getByText(/Profile updated successfully/i)).toBeInTheDocument();
    });
  });

  it("shows error on profile update failure", async () => {
    apiRequest.mockRejectedValueOnce(new Error("fail"));
    renderProfile();
    fireEvent.click(screen.getByRole("button", { name: /Update Profile/i }));
    await waitFor(() => {
      expect(screen.getByText(/fail/i)).toBeInTheDocument();
    });
  });

  it("submits home address update", async () => {
    apiRequest.mockResolvedValueOnce({});
    renderProfile();
    fireEvent.click(screen.getByRole("button", { name: /Update Home\/Shipping Address/i }));
    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith("/address/testuser/home", expect.any(Object));
      expect(screen.getByText(/Home\/shipping address updated/i)).toBeInTheDocument();
    });
  });

  it("submits billing address update", async () => {
    apiRequest.mockResolvedValueOnce({});
    renderProfile();
    fireEvent.click(screen.getByRole("button", { name: /Update Billing Address/i }));
    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith("/address/testuser/billing", expect.any(Object));
      expect(screen.getByText(/Billing address updated/i)).toBeInTheDocument();
    });
  });

  it("shows loading and error states", () => {
    renderProfile({ addressLoading: true });
    expect(screen.getByText(/Loading profile/i)).toBeInTheDocument();
    renderProfile({ addressLoading: false, addressError: "fail" });
    expect(screen.getByText(/fail/i)).toBeInTheDocument();
  });
});
