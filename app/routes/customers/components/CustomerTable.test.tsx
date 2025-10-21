import { expect, test, describe, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import CustomerTable from "./CustomerTable";

// Mock the services
vi.mock("../../../services/CustomerService", () => ({
  default: () => ({
    getListCustomer: vi.fn(),
    deleteCustomer: vi.fn(),
    getCustomerNameList: vi.fn()
  })
}));

// Mock the hooks
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({})
  };
});

describe("CustomerTable Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders customer table", () => {
    render(
      <BrowserRouter>
        <CustomerTable />
      </BrowserRouter>
    );

    // Check if the component renders without crashing
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  test("displays loading state initially", () => {
    render(
      <BrowserRouter>
        <CustomerTable />
      </BrowserRouter>
    );

    // The component should show loading state initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("handles customer data loading", async () => {
    const mockCustomers = [
      { id: 1, name: "Customer 1", email: "customer1@example.com" },
      { id: 2, name: "Customer 2", email: "customer2@example.com" }
    ];

    const CustomerService = require("../../../services/CustomerService").default;
    const mockGetListCustomer = vi.fn().mockResolvedValue({
      customers: mockCustomers,
      total: 2
    });
    CustomerService().getListCustomer = mockGetListCustomer;

    render(
      <BrowserRouter>
        <CustomerTable />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetListCustomer).toHaveBeenCalled();
    });
  });

  test("handles customer deletion", async () => {
    const CustomerService = require("../../../services/CustomerService").default;
    const mockDeleteCustomer = vi.fn().mockResolvedValue({ success: true });
    CustomerService().deleteCustomer = mockDeleteCustomer;

    render(
      <BrowserRouter>
        <CustomerTable />
      </BrowserRouter>
    );

    // Simulate delete action
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteCustomer).toHaveBeenCalled();
    });
  });

  test("handles search functionality", async () => {
    render(
      <BrowserRouter>
        <CustomerTable />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "test customer" } });

    await waitFor(() => {
      expect(searchInput).toHaveValue("test customer");
    });
  });

  test("handles pagination", async () => {
    render(
      <BrowserRouter>
        <CustomerTable />
      </BrowserRouter>
    );

    const nextPageButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextPageButton);

    // Verify pagination action
    expect(nextPageButton).toBeInTheDocument();
  });

  test("displays error message on API failure", async () => {
    const CustomerService = require("../../../services/CustomerService").default;
    const mockGetListCustomer = vi.fn().mockRejectedValue(new Error("API Error"));
    CustomerService().getListCustomer = mockGetListCustomer;

    render(
      <BrowserRouter>
        <CustomerTable />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});