import { expect, test, describe, vi, beforeEach } from "vitest";
import axios from "axios";
import DirectApiService from "./DirectApiService";

// Mock axios
vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

describe("DirectApiService", () => {
  let directApiService: ReturnType<typeof DirectApiService>;

  beforeEach(() => {
    vi.clearAllMocks();
    directApiService = DirectApiService();
  });

  describe("getDirectApiCustomerList", () => {
    test("should fetch direct API customer list successfully", async () => {
      const mockResponse = {
        data: {
          customers: [
            { id: 1, name: "Customer 1", apiKey: "api-key-1" },
            { id: 2, name: "Customer 2", apiKey: "api-key-2" }
          ],
          total: 2
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await directApiService.getDirectApiCustomerList();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/customer-product/direct-api"),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle API error when fetching customer list", async () => {
      const error = new Error("Failed to fetch direct API customers");
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(directApiService.getDirectApiCustomerList())
        .rejects.toThrow("Failed to fetch direct API customers");
    });
  });

  describe("getDirectApiProductByCustomerId", () => {
    test("should fetch products by customer ID successfully", async () => {
      const mockResponse = {
        data: {
          products: [
            { id: 1, name: "Product 1", customerId: 1 },
            { id: 2, name: "Product 2", customerId: 1 }
          ]
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await directApiService.getDirectApiProductByCustomerId("1");

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/billing-note/initial-data/direct-api/1"),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle error when fetching products by customer ID", async () => {
      const error = new Error("Customer not found");
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(directApiService.getDirectApiProductByCustomerId("999"))
        .rejects.toThrow("Customer not found");
    });
  });

  describe("getDirectApiList", () => {
    test("should fetch direct API list successfully", async () => {
      const mockResponse = {
        data: {
          apis: [
            { id: 1, name: "API 1", endpoint: "/api/v1/test" },
            { id: 2, name: "API 2", endpoint: "/api/v1/test2" }
          ],
          total: 2
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const params = { page: 1, limit: 10 };
      const result = await directApiService.getDirectApiList(params);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/direct-api"),
        expect.objectContaining({
          params: params
        })
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle API error when fetching direct API list", async () => {
      const error = new Error("Failed to fetch direct API list");
      mockedAxios.get.mockRejectedValueOnce(error);

      const params = { page: 1, limit: 10 };
      await expect(directApiService.getDirectApiList(params))
        .rejects.toThrow("Failed to fetch direct API list");
    });
  });

  describe("createDirectApi", () => {
    test("should create direct API successfully", async () => {
      const mockResponse = {
        data: {
          id: 3,
          name: "New API",
          endpoint: "/api/v1/new",
          success: true
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const apiData = {
        name: "New API",
        endpoint: "/api/v1/new",
        description: "A new API endpoint"
      };
      const result = await directApiService.createDirectApi(apiData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/direct-api"),
        apiData,
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle validation error when creating direct API", async () => {
      const error = new Error("API name is required");
      mockedAxios.post.mockRejectedValueOnce(error);

      const apiData = {
        name: "",
        endpoint: "/api/v1/test"
      };

      await expect(directApiService.createDirectApi(apiData))
        .rejects.toThrow("API name is required");
    });
  });

  describe("updateDirectApi", () => {
    test("should update direct API successfully", async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: "Updated API",
          success: true
        }
      };
      mockedAxios.patch.mockResolvedValueOnce(mockResponse);

      const updateData = {
        name: "Updated API",
        description: "Updated description"
      };
      const result = await directApiService.updateDirectApi(updateData, "1");

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        expect.stringContaining("/v1/direct-api"),
        {
          direct_id: "1",
          ...updateData
        },
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle error when updating direct API", async () => {
      const error = new Error("Direct API not found");
      mockedAxios.patch.mockRejectedValueOnce(error);

      const updateData = { name: "Updated Name" };

      await expect(directApiService.updateDirectApi(updateData, "999"))
        .rejects.toThrow("Direct API not found");
    });
  });

  describe("getDirectApiViewById", () => {
    test("should fetch direct API view by ID successfully", async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: "API 1",
          endpoint: "/api/v1/test",
          description: "Test API",
          status: "active"
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await directApiService.getDirectApiViewById("1");

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/direct-api/1"),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle error when fetching direct API view", async () => {
      const error = new Error("Direct API not found");
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(directApiService.getDirectApiViewById("999"))
        .rejects.toThrow("Direct API not found");
    });
  });
});