import { expect, test, describe, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import CustomerTable from "../../routes/customers/components/CustomerTable";

// Mock the services
vi.mock("../../services/CustomerService", () => ({
  default: () => ({
    getListCustomer: vi.fn(),
    deleteCustomer: vi.fn(),
    getCustomerNameList: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    getOne: vi.fn()
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

describe("Customer Management Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("complete customer CRUD operations", async () => {
    const mockCustomers = [
      { id: 1, name: "Customer 1", email: "customer1@example.com" },
      { id: 2, name: "Customer 2", email: "customer2@example.com" }
    ];

    const CustomerService = require("../../services/CustomerService").default;
    const mockGetListCustomer = vi.fn().mockResolvedValue({
      customers: mockCustomers,
      total: 2
    });
    const mockDeleteCustomer = vi.fn().mockResolvedValue({ success: true });
    const mockCreate = vi.fn().mockResolvedValue({ id: 3, name: "New Customer" });
    const mockUpdate = vi.fn().mockResolvedValue({ id: 1, name: "Updated Customer" });

    CustomerService().getListCustomer = mockGetListCustomer;
    CustomerService().deleteCustomer = mockDeleteCustomer;
    CustomerService().create = mockCreate;
    CustomerService().update = mockUpdate;

    render(
      <BrowserRouter>
        <CustomerTable />
      </BrowserRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(mockGetListCustomer).toHaveBeenCalled();
    });

    // Test search functionality
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "Customer 1" } });

    await waitFor(() => {
      expect(searchInput).toHaveValue("Customer 1");
    });

    // Test pagination
    const nextPageButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextPageButton);

    // Test delete functionality
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteCustomer).toHaveBeenCalled();
    });
  });

  test("handles customer creation workflow", async () => {
    const CustomerService = require("../../services/CustomerService").default;
    const mockCreate = vi.fn().mockResolvedValue({ 
      id: 3, 
      name: "New Customer", 
      email: "newcustomer@example.com" 
    });
    CustomerService().create = mockCreate;

    render(
      <BrowserRouter>
        <CustomerTable />
      </BrowserRouter>
    );

    // Simulate create customer
    const createButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
    });
  });

  test("handles customer update workflow", async () => {
    const CustomerService = require("../../services/CustomerService").default;
    const mockUpdate = vi.fn().mockResolvedValue({ 
      id: 1, 
      name: "Updated Customer", 
      email: "updated@example.com" 
    });
    CustomerService().update = mockUpdate;

    render(
      <BrowserRouter>
        <CustomerTable />
      </BrowserRouter>
    );

    // Simulate update customer
    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  test("handles error scenarios", async () => {
    const CustomerService = require("../../services/CustomerService").default;
    const mockGetListCustomer = vi.fn().mockRejectedValue(new Error("Network error"));
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

  test("handles empty customer list", async () => {
    const CustomerService = require("../../services/CustomerService").default;
    const mockGetListCustomer = vi.fn().mockResolvedValue({
      customers: [],
      total: 0
    });
    CustomerService().getListCustomer = mockGetListCustomer;

    render(
      <BrowserRouter>
        <CustomerTable />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/no customers found/i)).toBeInTheDocument();
    });
  });
});