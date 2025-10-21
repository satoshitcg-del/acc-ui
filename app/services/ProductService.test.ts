import { expect, test, describe, vi, beforeEach } from "vitest";
import axios from "axios";
import ProductService from "./ProductService";

// Mock axios
vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

describe("ProductService", () => {
  let productService: ReturnType<typeof ProductService>;

  beforeEach(() => {
    vi.clearAllMocks();
    productService = ProductService();
  });

  describe("getProductList", () => {
    test("should fetch product list successfully", async () => {
      const mockResponse = {
        data: {
          products: [
            { id: 1, name: "Product 1", price: 100, category: "Electronics" },
            { id: 2, name: "Product 2", price: 200, category: "Clothing" }
          ],
          total: 2
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await productService.getProductList({ page: 1, limit: 10 });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/product"),
        expect.objectContaining({
          params: { page: 1, limit: 10 }
        })
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle API error when fetching product list", async () => {
      const error = new Error("Failed to fetch products");
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(productService.getProductList({ page: 1, limit: 10 }))
        .rejects.toThrow("Failed to fetch products");
    });
  });

  describe("getProductOne", () => {
    test("should fetch single product successfully", async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: "Product 1",
          price: 100,
          description: "A great product",
          category: "Electronics"
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await productService.getProductOne("1");

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/product/1"),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle error when fetching single product", async () => {
      const error = new Error("Product not found");
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(productService.getProductOne("999"))
        .rejects.toThrow("Product not found");
    });
  });

  describe("createProduct", () => {
    test("should create product successfully", async () => {
      const mockResponse = {
        data: {
          id: 3,
          name: "New Product",
          price: 150,
          category: "Electronics"
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const productData = {
        name: "New Product",
        price: 150,
        description: "A new product",
        category: "Electronics"
      };
      const result = await productService.createProduct(productData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/product"),
        productData,
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle validation error when creating product", async () => {
      const error = new Error("Product name is required");
      mockedAxios.post.mockRejectedValueOnce(error);

      const productData = {
        name: "",
        price: 150
      };

      await expect(productService.createProduct(productData))
        .rejects.toThrow("Product name is required");
    });
  });

  describe("updateProduct", () => {
    test("should update product successfully", async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: "Updated Product",
          price: 200
        }
      };
      mockedAxios.patch.mockResolvedValueOnce(mockResponse);

      const updateData = {
        name: "Updated Product",
        price: 200
      };
      const result = await productService.updateProduct("1", updateData);

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        expect.stringContaining("/v1/product/1"),
        updateData,
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle error when updating product", async () => {
      const error = new Error("Product not found");
      mockedAxios.patch.mockRejectedValueOnce(error);

      const updateData = { name: "Updated Name" };

      await expect(productService.updateProduct("999", updateData))
        .rejects.toThrow("Product not found");
    });
  });

  describe("deleteProduct", () => {
    test("should delete product successfully", async () => {
      const mockResponse = { data: { success: true } };
      mockedAxios.delete.mockResolvedValueOnce(mockResponse);

      const result = await productService.deleteProduct("1");

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining("/v1/product/1"),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle error when deleting product", async () => {
      const error = new Error("Cannot delete product with active orders");
      mockedAxios.delete.mockRejectedValueOnce(error);

      await expect(productService.deleteProduct("1"))
        .rejects.toThrow("Cannot delete product with active orders");
    });
  });

  describe("getSubProductList", () => {
    test("should fetch sub-product list successfully", async () => {
      const mockResponse = {
        data: {
          subProducts: [
            { id: 1, name: "Sub Product 1", parentId: 1 },
            { id: 2, name: "Sub Product 2", parentId: 1 }
          ],
          total: 2
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await productService.getSubProductList({ page: 1, limit: 10 });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/sub-product"),
        expect.objectContaining({
          params: { page: 1, limit: 10 }
        })
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("createSubProduct", () => {
    test("should create sub-product successfully", async () => {
      const mockResponse = {
        data: {
          id: 3,
          name: "New Sub Product",
          parentId: 1
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const subProductData = {
        name: "New Sub Product",
        parentId: 1,
        description: "A new sub product"
      };
      const result = await productService.createSubProduct(subProductData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/sub-product"),
        subProductData,
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});