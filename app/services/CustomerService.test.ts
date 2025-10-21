import { expect, test, describe, vi, beforeEach } from "vitest";
import axios from "axios";
import CustomerService from "./CustomerService";

// Mock axios
vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

describe("CustomerService", () => {
  let customerService: ReturnType<typeof CustomerService>;

  beforeEach(() => {
    vi.clearAllMocks();
    customerService = CustomerService();
  });

  describe("getListCustomer", () => {
    test("should fetch customer list successfully", async () => {
      const mockResponse = {
        data: {
          customers: [
            { id: 1, name: "Customer 1", email: "customer1@example.com" },
            { id: 2, name: "Customer 2", email: "customer2@example.com" }
          ],
          total: 2
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await customerService.getListCustomer({ page: 1, limit: 10 });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/customer"),
        expect.objectContaining({
          params: { page: 1, limit: 10 }
        })
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle API error when fetching customer list", async () => {
      const error = new Error("Failed to fetch customers");
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(customerService.getListCustomer({ page: 1, limit: 10 }))
        .rejects.toThrow("Failed to fetch customers");
    });
  });

  describe("getOne", () => {
    test("should fetch single customer successfully", async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: "Customer 1",
          email: "customer1@example.com",
          phone: "123-456-7890"
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await customerService.getOne("1");

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/customer/1"),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle error when fetching single customer", async () => {
      const error = new Error("Customer not found");
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(customerService.getOne("999"))
        .rejects.toThrow("Customer not found");
    });
  });

  describe("create", () => {
    test("should create customer successfully", async () => {
      const mockResponse = {
        data: {
          id: 3,
          name: "New Customer",
          email: "newcustomer@example.com"
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const customerData = {
        name: "New Customer",
        email: "newcustomer@example.com",
        phone: "987-654-3210"
      };
      const result = await customerService.create(customerData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/customer"),
        customerData,
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle validation error when creating customer", async () => {
      const error = new Error("Validation failed");
      mockedAxios.post.mockRejectedValueOnce(error);

      const customerData = {
        name: "",
        email: "invalid-email"
      };

      await expect(customerService.create(customerData))
        .rejects.toThrow("Validation failed");
    });
  });

  describe("update", () => {
    test("should update customer successfully", async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: "Updated Customer",
          email: "updated@example.com"
        }
      };
      mockedAxios.patch.mockResolvedValueOnce(mockResponse);

      const updateData = {
        name: "Updated Customer",
        email: "updated@example.com"
      };
      const result = await customerService.update("1", updateData);

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        expect.stringContaining("/v1/customer/1"),
        updateData,
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle error when updating customer", async () => {
      const error = new Error("Customer not found");
      mockedAxios.patch.mockRejectedValueOnce(error);

      const updateData = { name: "Updated Name" };

      await expect(customerService.update("999", updateData))
        .rejects.toThrow("Customer not found");
    });
  });

  describe("deleteCustomer", () => {
    test("should delete customer successfully", async () => {
      const mockResponse = { data: { success: true } };
      mockedAxios.delete.mockResolvedValueOnce(mockResponse);

      const result = await customerService.deleteCustomer("1");

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining("/v1/customer/1"),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle error when deleting customer", async () => {
      const error = new Error("Cannot delete customer with active orders");
      mockedAxios.delete.mockRejectedValueOnce(error);

      await expect(customerService.deleteCustomer("1"))
        .rejects.toThrow("Cannot delete customer with active orders");
    });
  });

  describe("getCustomerNameList", () => {
    test("should fetch customer name list successfully", async () => {
      const mockResponse = {
        data: [
          { id: 1, name: "Customer 1" },
          { id: 2, name: "Customer 2" }
        ]
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await customerService.getCustomerNameList();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/customer/name-list"),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});