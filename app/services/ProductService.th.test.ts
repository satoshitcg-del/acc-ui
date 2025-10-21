import { expect, test, describe, vi, beforeEach } from "vitest";
import axios from "axios";
import ProductService from "./ProductService";

// Mock axios
vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

describe("บริการสินค้า", () => {
  let บริการสินค้า: ReturnType<typeof ProductService>;

  beforeEach(() => {
    vi.clearAllMocks();
    บริการสินค้า = ProductService();
  });

  describe("ดึงรายชื่อสินค้า", () => {
    test("ควรดึงรายชื่อสินค้าได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = {
        data: {
          products: [
            { id: 1, name: "สินค้า 1", price: 100, category: "อิเล็กทรอนิกส์" },
            { id: 2, name: "สินค้า 2", price: 200, category: "เสื้อผ้า" }
          ],
          total: 2
        }
      };
      mockedAxios.get.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ผลลัพธ์ = await บริการสินค้า.getProductList({ page: 1, limit: 10 });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/product"),
        expect.objectContaining({
          params: { page: 1, limit: 10 }
        })
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });

    test("ควรจัดการข้อผิดพลาด API เมื่อดึงรายชื่อสินค้า", async () => {
      const ข้อผิดพลาด = new Error("ไม่สามารถดึงข้อมูลสินค้าได้");
      mockedAxios.get.mockRejectedValueOnce(ข้อผิดพลาด);

      await expect(บริการสินค้า.getProductList({ page: 1, limit: 10 }))
        .rejects.toThrow("ไม่สามารถดึงข้อมูลสินค้าได้");
    });
  });

  describe("ดึงข้อมูลสินค้าชิ้นเดียว", () => {
    test("ควรดึงข้อมูลสินค้าชิ้นเดียวได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = {
        data: {
          id: 1,
          name: "สินค้า 1",
          price: 100,
          description: "สินค้าที่ดี",
          category: "อิเล็กทรอนิกส์"
        }
      };
      mockedAxios.get.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ผลลัพธ์ = await บริการสินค้า.getProductOne("1");

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/product/1"),
        expect.any(Object)
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });

    test("ควรจัดการข้อผิดพลาดเมื่อดึงข้อมูลสินค้าชิ้นเดียว", async () => {
      const ข้อผิดพลาด = new Error("ไม่พบสินค้า");
      mockedAxios.get.mockRejectedValueOnce(ข้อผิดพลาด);

      await expect(บริการสินค้า.getProductOne("999"))
        .rejects.toThrow("ไม่พบสินค้า");
    });
  });

  describe("สร้างสินค้าใหม่", () => {
    test("ควรสร้างสินค้าใหม่ได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = {
        data: {
          id: 3,
          name: "สินค้าใหม่",
          price: 150,
          category: "อิเล็กทรอนิกส์"
        }
      };
      mockedAxios.post.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ข้อมูลสินค้า = {
        name: "สินค้าใหม่",
        price: 150,
        description: "สินค้าใหม่",
        category: "อิเล็กทรอนิกส์"
      };
      const ผลลัพธ์ = await บริการสินค้า.createProduct(ข้อมูลสินค้า);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/product"),
        ข้อมูลสินค้า,
        expect.any(Object)
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });

    test("ควรจัดการข้อผิดพลาดการตรวจสอบเมื่อสร้างสินค้า", async () => {
      const ข้อผิดพลาด = new Error("ชื่อสินค้าจำเป็นต้องระบุ");
      mockedAxios.post.mockRejectedValueOnce(ข้อผิดพลาด);

      const ข้อมูลสินค้า = {
        name: "",
        price: 150
      };

      await expect(บริการสินค้า.createProduct(ข้อมูลสินค้า))
        .rejects.toThrow("ชื่อสินค้าจำเป็นต้องระบุ");
    });
  });

  describe("แก้ไขสินค้า", () => {
    test("ควรแก้ไขสินค้าได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = {
        data: {
          id: 1,
          name: "สินค้าที่แก้ไขแล้ว",
          price: 200
        }
      };
      mockedAxios.patch.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ข้อมูลการแก้ไข = {
        name: "สินค้าที่แก้ไขแล้ว",
        price: 200
      };
      const ผลลัพธ์ = await บริการสินค้า.updateProduct("1", ข้อมูลการแก้ไข);

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        expect.stringContaining("/v1/product/1"),
        ข้อมูลการแก้ไข,
        expect.any(Object)
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });

    test("ควรจัดการข้อผิดพลาดเมื่อแก้ไขสินค้า", async () => {
      const ข้อผิดพลาด = new Error("ไม่พบสินค้า");
      mockedAxios.patch.mockRejectedValueOnce(ข้อผิดพลาด);

      const ข้อมูลการแก้ไข = { name: "ชื่อที่แก้ไขแล้ว" };

      await expect(บริการสินค้า.updateProduct("999", ข้อมูลการแก้ไข))
        .rejects.toThrow("ไม่พบสินค้า");
    });
  });

  describe("ลบสินค้า", () => {
    test("ควรลบสินค้าได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = { data: { success: true } };
      mockedAxios.delete.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ผลลัพธ์ = await บริการสินค้า.deleteProduct("1");

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining("/v1/product/1"),
        expect.any(Object)
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });

    test("ควรจัดการข้อผิดพลาดเมื่อลบสินค้า", async () => {
      const ข้อผิดพลาด = new Error("ไม่สามารถลบสินค้าที่มีคำสั่งซื้อที่ใช้งานอยู่ได้");
      mockedAxios.delete.mockRejectedValueOnce(ข้อผิดพลาด);

      await expect(บริการสินค้า.deleteProduct("1"))
        .rejects.toThrow("ไม่สามารถลบสินค้าที่มีคำสั่งซื้อที่ใช้งานอยู่ได้");
    });
  });

  describe("ดึงรายชื่อสินค้าย่อย", () => {
    test("ควรดึงรายชื่อสินค้าย่อยได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = {
        data: {
          subProducts: [
            { id: 1, name: "สินค้าย่อย 1", parentId: 1 },
            { id: 2, name: "สินค้าย่อย 2", parentId: 1 }
          ],
          total: 2
        }
      };
      mockedAxios.get.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ผลลัพธ์ = await บริการสินค้า.getSubProductList({ page: 1, limit: 10 });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/sub-product"),
        expect.objectContaining({
          params: { page: 1, limit: 10 }
        })
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });
  });

  describe("สร้างสินค้าย่อย", () => {
    test("ควรสร้างสินค้าย่อยได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = {
        data: {
          id: 3,
          name: "สินค้าย่อยใหม่",
          parentId: 1
        }
      };
      mockedAxios.post.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ข้อมูลสินค้าย่อย = {
        name: "สินค้าย่อยใหม่",
        parentId: 1,
        description: "สินค้าย่อยใหม่"
      };
      const ผลลัพธ์ = await บริการสินค้า.createSubProduct(ข้อมูลสินค้าย่อย);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/sub-product"),
        ข้อมูลสินค้าย่อย,
        expect.any(Object)
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });
  });
});