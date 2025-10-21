import { expect, test, describe, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import BillingNoteTable from "../../routes/billing-note/BillingNoteTable";

// Mock the services
vi.mock("../../services/BillingService", () => ({
  default: () => ({
    getBillingNote: vi.fn(),
    generatePdf: vi.fn(),
    preview: vi.fn(),
    search: vi.fn(),
    updateStatus: vi.fn(),
    updateNote: vi.fn(),
    getNote: vi.fn(),
    getDashboard: vi.fn(),
    getCustomerInfo: vi.fn(),
    getHistory: vi.fn()
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

describe("Billing Management Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("complete billing workflow", async () => {
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

    const BillingService = require("../../services/BillingService").default;
    const mockGetBillingNote = vi.fn().mockResolvedValue({
      billingNotes: mockBillingNotes,
      total: 2
    });
    const mockGeneratePdf = vi.fn().mockResolvedValue({ 
      success: true, 
      pdfUrl: "https://example.com/billing-note.pdf" 
    });
    const mockUpdateStatus = vi.fn().mockResolvedValue({ success: true });
    const mockSearch = vi.fn().mockResolvedValue({
      results: mockBillingNotes,
      total: 2
    });

    BillingService().getBillingNote = mockGetBillingNote;
    BillingService().generatePdf = mockGeneratePdf;
    BillingService().updateStatus = mockUpdateStatus;
    BillingService().search = mockSearch;

    render(
      <BrowserRouter>
        <BillingNoteTable />
      </BrowserRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(mockGetBillingNote).toHaveBeenCalled();
    });

    // Test search functionality
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "Customer 1" } });

    await waitFor(() => {
      expect(searchInput).toHaveValue("Customer 1");
    });

    // Test status filtering
    const statusFilter = screen.getByRole("combobox", { name: /status/i });
    fireEvent.change(statusFilter, { target: { value: "pending" } });

    await waitFor(() => {
      expect(statusFilter).toHaveValue("pending");
    });

    // Test PDF generation
    const pdfButton = screen.getByRole("button", { name: /generate pdf/i });
    fireEvent.click(pdfButton);

    await waitFor(() => {
      expect(mockGeneratePdf).toHaveBeenCalled();
    });

    // Test status update
    const statusButton = screen.getByRole("button", { name: /update status/i });
    fireEvent.click(statusButton);

    await waitFor(() => {
      expect(mockUpdateStatus).toHaveBeenCalled();
    });
  });

  test("handles billing note creation workflow", async () => {
    const BillingService = require("../../services/BillingService").default;
    const mockCreate = vi.fn().mockResolvedValue({ 
      id: 3, 
      customerId: 1, 
      amount: 1500, 
      status: "pending" 
    });
    BillingService().create = mockCreate;

    render(
      <BrowserRouter>
        <BillingNoteTable />
      </BrowserRouter>
    );

    // Simulate create billing note
    const createButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
    });
  });

  test("handles billing note editing workflow", async () => {
    const BillingService = require("../../services/BillingService").default;
    const mockUpdate = vi.fn().mockResolvedValue({ 
      id: 1, 
      amount: 2000, 
      status: "updated" 
    });
    BillingService().update = mockUpdate;

    render(
      <BrowserRouter>
        <BillingNoteTable />
      </BrowserRouter>
    );

    // Simulate edit billing note
    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
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

  test("handles error scenarios", async () => {
    const BillingService = require("../../services/BillingService").default;
    const mockGetBillingNote = vi.fn().mockRejectedValue(new Error("Network error"));
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

  test("handles empty billing note list", async () => {
    const BillingService = require("../../services/BillingService").default;
    const mockGetBillingNote = vi.fn().mockResolvedValue({
      billingNotes: [],
      total: 0
    });
    BillingService().getBillingNote = mockGetBillingNote;

    render(
      <BrowserRouter>
        <BillingNoteTable />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/no billing notes found/i)).toBeInTheDocument();
    });
  });
});