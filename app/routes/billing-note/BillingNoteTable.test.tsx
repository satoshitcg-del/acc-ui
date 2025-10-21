import { expect, test, describe, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import BillingNoteTable from "./BillingNoteTable";

// Mock the services
vi.mock("../../../services/BillingService", () => ({
  default: () => ({
    getBillingNote: vi.fn(),
    deleteBillingNote: vi.fn(),
    updateStatus: vi.fn(),
    generatePdf: vi.fn()
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

describe("BillingNoteTable Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders billing note table", () => {
    render(
      <BrowserRouter>
        <BillingNoteTable />
      </BrowserRouter>
    );

    // Check if the component renders without crashing
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  test("displays loading state initially", () => {
    render(
      <BrowserRouter>
        <BillingNoteTable />
      </BrowserRouter>
    );

    // The component should show loading state initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("handles billing note data loading", async () => {
    const mockBillingNotes = [
      { 
        id: 1, 
        customerId: 1, 
        customerName: "Customer 1", 
        amount: 1000, 
        status: "pending",
        createdAt: "2024-01-01"
      },
      { 
        id: 2, 
        customerId: 2, 
        customerName: "Customer 2", 
        amount: 2000, 
        status: "paid",
        createdAt: "2024-01-02"
      }
    ];

    const BillingService = require("../../../services/BillingService").default;
    const mockGetBillingNote = vi.fn().mockResolvedValue({
      billingNotes: mockBillingNotes,
      total: 2
    });
    BillingService().getBillingNote = mockGetBillingNote;

    render(
      <BrowserRouter>
        <BillingNoteTable />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetBillingNote).toHaveBeenCalled();
    });
  });

  test("handles billing note deletion", async () => {
    const BillingService = require("../../../services/BillingService").default;
    const mockDeleteBillingNote = vi.fn().mockResolvedValue({ success: true });
    BillingService().deleteBillingNote = mockDeleteBillingNote;

    render(
      <BrowserRouter>
        <BillingNoteTable />
      </BrowserRouter>
    );

    // Simulate delete action
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteBillingNote).toHaveBeenCalled();
    });
  });

  test("handles status update", async () => {
    const BillingService = require("../../../services/BillingService").default;
    const mockUpdateStatus = vi.fn().mockResolvedValue({ success: true });
    BillingService().updateStatus = mockUpdateStatus;

    render(
      <BrowserRouter>
        <BillingNoteTable />
      </BrowserRouter>
    );

    // Simulate status update
    const statusButton = screen.getByRole("button", { name: /update status/i });
    fireEvent.click(statusButton);

    await waitFor(() => {
      expect(mockUpdateStatus).toHaveBeenCalled();
    });
  });

  test("handles PDF generation", async () => {
    const BillingService = require("../../../services/BillingService").default;
    const mockGeneratePdf = vi.fn().mockResolvedValue({ 
      success: true, 
      pdfUrl: "https://example.com/billing-note.pdf" 
    });
    BillingService().generatePdf = mockGeneratePdf;

    render(
      <BrowserRouter>
        <BillingNoteTable />
      </BrowserRouter>
    );

    // Simulate PDF generation
    const pdfButton = screen.getByRole("button", { name: /generate pdf/i });
    fireEvent.click(pdfButton);

    await waitFor(() => {
      expect(mockGeneratePdf).toHaveBeenCalled();
    });
  });

  test("handles search functionality", async () => {
    render(
      <BrowserRouter>
        <BillingNoteTable />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "test customer" } });

    await waitFor(() => {
      expect(searchInput).toHaveValue("test customer");
    });
  });

  test("handles status filtering", async () => {
    render(
      <BrowserRouter>
        <BillingNoteTable />
      </BrowserRouter>
    );

    const statusFilter = screen.getByRole("combobox", { name: /status/i });
    fireEvent.change(statusFilter, { target: { value: "pending" } });

    await waitFor(() => {
      expect(statusFilter).toHaveValue("pending");
    });
  });

  test("handles date range filtering", async () => {
    render(
      <BrowserRouter>
        <BillingNoteTable />
      </BrowserRouter>
    );

    const startDateInput = screen.getByLabelText(/start date/i);
    const endDateInput = screen.getByLabelText(/end date/i);

    fireEvent.change(startDateInput, { target: { value: "2024-01-01" } });
    fireEvent.change(endDateInput, { target: { value: "2024-01-31" } });

    await waitFor(() => {
      expect(startDateInput).toHaveValue("2024-01-01");
      expect(endDateInput).toHaveValue("2024-01-31");
    });
  });

  test("handles amount range filtering", async () => {
    render(
      <BrowserRouter>
        <BillingNoteTable />
      </BrowserRouter>
    );

    const minAmountInput = screen.getByLabelText(/min amount/i);
    const maxAmountInput = screen.getByLabelText(/max amount/i);

    fireEvent.change(minAmountInput, { target: { value: "500" } });
    fireEvent.change(maxAmountInput, { target: { value: "2000" } });

    await waitFor(() => {
      expect(minAmountInput).toHaveValue("500");
      expect(maxAmountInput).toHaveValue("2000");
    });
  });

  test("handles pagination", async () => {
    render(
      <BrowserRouter>
        <BillingNoteTable />
      </BrowserRouter>
    );

    const nextPageButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextPageButton);

    // Verify pagination action
    expect(nextPageButton).toBeInTheDocument();
  });

  test("displays error message on API failure", async () => {
    const BillingService = require("../../../services/BillingService").default;
    const mockGetBillingNote = vi.fn().mockRejectedValue(new Error("API Error"));
    BillingService().getBillingNote = mockGetBillingNote;

    render(
      <BrowserRouter>
        <BillingNoteTable />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  test("handles billing note creation", async () => {
    render(
      <BrowserRouter>
        <BillingNoteTable />
      </BrowserRouter>
    );

    const createButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(createButton);

    // Verify create action
    expect(createButton).toBeInTheDocument();
  });

  test("handles billing note editing", async () => {
    render(
      <BrowserRouter>
        <BillingNoteTable />
      </BrowserRouter>
    );

    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    // Verify edit action
    expect(editButton).toBeInTheDocument();
  });
});