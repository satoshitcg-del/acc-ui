import { expect, test, describe, vi, beforeEach } from "vitest";
import axios from "axios";
import BillingService from "./BillingService";

// Mock axios
vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

describe("BillingService", () => {
  let billingService: ReturnType<typeof BillingService>;

  beforeEach(() => {
    vi.clearAllMocks();
    billingService = BillingService();
  });

  describe("getBillingNote", () => {
    test("should fetch billing note list successfully", async () => {
      const mockResponse = {
        data: {
          billingNotes: [
            { id: 1, customerId: 1, amount: 1000, status: "pending" },
            { id: 2, customerId: 2, amount: 2000, status: "paid" }
          ],
          total: 2
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await billingService.getBillingNote({ page: "1", limit: "10" });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/billing-note"),
        expect.objectContaining({
          params: { page: 1, limit: 10 }
        })
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle API error when fetching billing notes", async () => {
      const error = new Error("Failed to fetch billing notes");
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(billingService.getBillingNote({ page: "1", limit: "10" }))
        .rejects.toThrow("Failed to fetch billing notes");
    });
  });

  describe("generatePdf", () => {
    test("should generate PDF successfully", async () => {
      const mockResponse = {
        data: {
          pdfUrl: "https://example.com/billing-note-1.pdf",
          success: true
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const billingData = "1";
      const result = await billingService.preview(billingData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/billing-note/preview"),
        billingData,
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle error when generating PDF", async () => {
      const error = new Error("PDF generation failed");
      mockedAxios.post.mockRejectedValueOnce(error);

      const billingData = "1";

      await expect(billingService.preview(billingData))
        .rejects.toThrow("PDF generation failed");
    });
  });

  describe("preview", () => {
    test("should preview billing note successfully", async () => {
      const mockResponse = {
        data: {
          preview: {
            customer: { name: "Customer 1" },
            items: [{ name: "Product 1", quantity: 2, price: 100 }],
            total: 200
          }
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const previewData = "1";
      const result = await billingService.preview(previewData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/billing-note/preview"),
        previewData,
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("search", () => {
    test("should search billing notes successfully", async () => {
      const mockResponse = {
        data: {
          results: [
            { id: 1, customerName: "Customer 1", amount: 1000 }
          ],
          total: 1
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const searchParams = {
        username: "Customer 1",
        invoice_no: "",
        product_id: "",
        prefix: "",
        status: "pending",
        start_date: "",
        end_date: "",
        page: "1",
        limit: "10"
      };
      const result = await billingService.search(searchParams);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/billing-note/search"),
        expect.objectContaining({
          params: searchParams
        })
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("getDashboard", () => {
    test("should fetch dashboard data successfully", async () => {
      const mockResponse = {
        data: {
          totalRevenue: 50000,
          totalCustomers: 100,
          pendingBills: 5,
          paidBills: 95
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await billingService.getDashboard();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/dashboard"),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("getCustomerInfo", () => {
    test("should fetch customer info successfully", async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: "Customer 1",
          email: "customer1@example.com",
          totalBills: 10,
          totalAmount: 5000
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await billingService.getCustomerInfo("1", "1");

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/customer/1/info"),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("getHistory", () => {
    test("should fetch billing history successfully", async () => {
      const mockResponse = {
        data: {
          history: [
            { id: 1, action: "created", timestamp: "2024-01-01T10:00:00Z" },
            { id: 2, action: "updated", timestamp: "2024-01-01T11:00:00Z" }
          ]
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await billingService.getHistory("1");

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/billing-note/1/history"),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("getNote", () => {
    test("should fetch billing note details successfully", async () => {
      const mockResponse = {
        data: {
          id: 1,
          customerId: 1,
          amount: 1000,
          status: "pending",
          items: [
            { productId: 1, quantity: 2, price: 500 }
          ]
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await billingService.getNote("1");

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/billing-note/1"),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("updateNote", () => {
    test("should update billing note successfully", async () => {
      const mockResponse = {
        data: {
          id: 1,
          status: "updated",
          success: true
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const updateData = {
        invoice_id: "1",
        note: "Updated note"
      };
      const result = await billingService.updateNote(updateData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/billing-note/note"),
        updateData,
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("updateStatus", () => {
    test("should update billing note status successfully", async () => {
      const mockResponse = {
        data: {
          id: 1,
          status: "paid",
          success: true
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const statusData = {
        invoice_id: "1",
        status: "paid"
      };
      const result = await billingService.updateStatus(statusData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/billing-note/update"),
        statusData,
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});