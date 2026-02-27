import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "../components/Signup";
import { MemoryRouter } from "react-router-dom";

// Mock apiRequest
jest.mock("../api", () => ({
  apiRequest: jest.fn(),
}));
import { apiRequest } from "../api";

describe("Signup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock setToken on window for test
    window.setToken = jest.fn();
  });

  function renderSignup() {
    // Provide setToken via global for test
    window.setToken = jest.fn();
    return render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
  }

  it("renders signup form fields", () => {
    renderSignup();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign Up/i })).toBeInTheDocument();
  });

  it("shows error on signup failure", async () => {
    apiRequest.mockRejectedValueOnce(new Error("fail"));
    renderSignup();
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "user" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "pw" } });
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
    await waitFor(() => {
      expect(screen.getByText(/fail/i)).toBeInTheDocument();
    });
  });

  it("shows success and calls setToken on signup", async () => {
    const fakeToken = "header.eyJ1c2VybmFtZSI6InVzZXIifQ==.sig";
    apiRequest.mockResolvedValueOnce({ token: fakeToken });
    apiRequest.mockResolvedValueOnce({ username: "user", email: "a@b.com" }); // user fetch
    renderSignup();
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "user" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "pw" } });
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith("/users", expect.any(Object));
      expect(window.setToken).toHaveBeenCalledWith(fakeToken);
      expect(screen.getByText(/User registered successfully/i)).toBeInTheDocument();
    });
  });
});
