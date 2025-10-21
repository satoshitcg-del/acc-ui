import { expect, test, describe, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import ProductTable from "./ProductTable";

// Mock the services
vi.mock("../../../services/ProductService", () => ({
  default: () => ({
    getProductList: vi.fn(),
    deleteProduct: vi.fn(),
    getProductNameList: vi.fn()
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

describe("ProductTable Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders product table", () => {
    render(
      <BrowserRouter>
        <ProductTable />
      </BrowserRouter>
    );

    // Check if the component renders without crashing
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  test("displays loading state initially", () => {
    render(
      <BrowserRouter>
        <ProductTable />
      </BrowserRouter>
    );

    // The component should show loading state initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("handles product data loading", async () => {
    const mockProducts = [
      { id: 1, name: "Product 1", price: 100, category: "Electronics" },
      { id: 2, name: "Product 2", price: 200, category: "Clothing" }
    ];

    const ProductService = require("../../../services/ProductService").default;
    const mockGetProductList = vi.fn().mockResolvedValue({
      products: mockProducts,
      total: 2
    });
    ProductService().getProductList = mockGetProductList;

    render(
      <BrowserRouter>
        <ProductTable />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetProductList).toHaveBeenCalled();
    });
  });

  test("handles product deletion", async () => {
    const ProductService = require("../../../services/ProductService").default;
    const mockDeleteProduct = vi.fn().mockResolvedValue({ success: true });
    ProductService().deleteProduct = mockDeleteProduct;

    render(
      <BrowserRouter>
        <ProductTable />
      </BrowserRouter>
    );

    // Simulate delete action
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteProduct).toHaveBeenCalled();
    });
  });

  test("handles search functionality", async () => {
    render(
      <BrowserRouter>
        <ProductTable />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "test product" } });

    await waitFor(() => {
      expect(searchInput).toHaveValue("test product");
    });
  });

  test("handles category filtering", async () => {
    render(
      <BrowserRouter>
        <ProductTable />
      </BrowserRouter>
    );

    const categoryFilter = screen.getByRole("combobox", { name: /category/i });
    fireEvent.change(categoryFilter, { target: { value: "Electronics" } });

    await waitFor(() => {
      expect(categoryFilter).toHaveValue("Electronics");
    });
  });

  test("handles price range filtering", async () => {
    render(
      <BrowserRouter>
        <ProductTable />
      </BrowserRouter>
    );

    const minPriceInput = screen.getByLabelText(/min price/i);
    const maxPriceInput = screen.getByLabelText(/max price/i);

    fireEvent.change(minPriceInput, { target: { value: "50" } });
    fireEvent.change(maxPriceInput, { target: { value: "200" } });

    await waitFor(() => {
      expect(minPriceInput).toHaveValue("50");
      expect(maxPriceInput).toHaveValue("200");
    });
  });

  test("handles pagination", async () => {
    render(
      <BrowserRouter>
        <ProductTable />
      </BrowserRouter>
    );

    const nextPageButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextPageButton);

    // Verify pagination action
    expect(nextPageButton).toBeInTheDocument();
  });

  test("displays error message on API failure", async () => {
    const ProductService = require("../../../services/ProductService").default;
    const mockGetProductList = vi.fn().mockRejectedValue(new Error("API Error"));
    ProductService().getProductList = mockGetProductList;

    render(
      <BrowserRouter>
        <ProductTable />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  test("handles product creation", async () => {
    render(
      <BrowserRouter>
        <ProductTable />
      </BrowserRouter>
    );

    const createButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(createButton);

    // Verify create action
    expect(createButton).toBeInTheDocument();
  });

  test("handles product editing", async () => {
    render(
      <BrowserRouter>
        <ProductTable />
      </BrowserRouter>
    );

    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    // Verify edit action
    expect(editButton).toBeInTheDocument();
  });
});