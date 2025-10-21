import { expect, test, describe, vi, beforeEach } from "vitest";
import axios from "axios";
import CustomerService from "./CustomerService";

// Mock axios
vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

describe("บริการลูกค้า", () => {
  let บริการลูกค้า: ReturnType<typeof CustomerService>;

  beforeEach(() => {
    vi.clearAllMocks();
    บริการลูกค้า = CustomerService();
  });

  describe("ดึงรายชื่อลูกค้า", () => {
    test("ควรดึงรายชื่อลูกค้าได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = {
        data: {
          customers: [
            { id: 1, name: "ลูกค้า 1", email: "customer1@example.com" },
            { id: 2, name: "ลูกค้า 2", email: "customer2@example.com" }
          ],
          total: 2
        }
      };
      mockedAxios.get.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ผลลัพธ์ = await บริการลูกค้า.getListCustomer({ page: 1, limit: 10 });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/customer"),
        expect.objectContaining({
          params: { page: 1, limit: 10 }
        })
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });

    test("ควรจัดการข้อผิดพลาด API เมื่อดึงรายชื่อลูกค้า", async () => {
      const ข้อผิดพลาด = new Error("ไม่สามารถดึงข้อมูลลูกค้าได้");
      mockedAxios.get.mockRejectedValueOnce(ข้อผิดพลาด);

      await expect(บริการลูกค้า.getListCustomer({ page: 1, limit: 10 }))
        .rejects.toThrow("ไม่สามารถดึงข้อมูลลูกค้าได้");
    });
  });

  describe("ดึงข้อมูลลูกค้าคนเดียว", () => {
    test("ควรดึงข้อมูลลูกค้าคนเดียวได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = {
        data: {
          id: 1,
          name: "ลูกค้า 1",
          email: "customer1@example.com",
          phone: "123-456-7890"
        }
      };
      mockedAxios.get.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ผลลัพธ์ = await บริการลูกค้า.getOne("1");

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/customer/1"),
        expect.any(Object)
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });

    test("ควรจัดการข้อผิดพลาดเมื่อดึงข้อมูลลูกค้าคนเดียว", async () => {
      const ข้อผิดพลาด = new Error("ไม่พบลูกค้า");
      mockedAxios.get.mockRejectedValueOnce(ข้อผิดพลาด);

      await expect(บริการลูกค้า.getOne("999"))
        .rejects.toThrow("ไม่พบลูกค้า");
    });
  });

  describe("สร้างลูกค้าใหม่", () => {
    test("ควรสร้างลูกค้าใหม่ได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = {
        data: {
          id: 3,
          name: "ลูกค้าใหม่",
          email: "newcustomer@example.com"
        }
      };
      mockedAxios.post.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ข้อมูลลูกค้า = {
        name: "ลูกค้าใหม่",
        email: "newcustomer@example.com",
        phone: "987-654-3210"
      };
      const ผลลัพธ์ = await บริการลูกค้า.create(ข้อมูลลูกค้า);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/customer"),
        ข้อมูลลูกค้า,
        expect.any(Object)
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });

    test("ควรจัดการข้อผิดพลาดการตรวจสอบเมื่อสร้างลูกค้า", async () => {
      const ข้อผิดพลาด = new Error("การตรวจสอบล้มเหลว");
      mockedAxios.post.mockRejectedValueOnce(ข้อผิดพลาด);

      const ข้อมูลลูกค้า = {
        name: "",
        email: "อีเมลไม่ถูกต้อง"
      };

      await expect(บริการลูกค้า.create(ข้อมูลลูกค้า))
        .rejects.toThrow("การตรวจสอบล้มเหลว");
    });
  });

  describe("แก้ไขข้อมูลลูกค้า", () => {
    test("ควรแก้ไขข้อมูลลูกค้าได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = {
        data: {
          id: 1,
          name: "ลูกค้าที่แก้ไขแล้ว",
          email: "updated@example.com"
        }
      };
      mockedAxios.patch.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ข้อมูลการแก้ไข = {
        name: "ลูกค้าที่แก้ไขแล้ว",
        email: "updated@example.com"
      };
      const ผลลัพธ์ = await บริการลูกค้า.update("1", ข้อมูลการแก้ไข);

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        expect.stringContaining("/v1/customer/1"),
        ข้อมูลการแก้ไข,
        expect.any(Object)
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });

    test("ควรจัดการข้อผิดพลาดเมื่อแก้ไขข้อมูลลูกค้า", async () => {
      const ข้อผิดพลาด = new Error("ไม่พบลูกค้า");
      mockedAxios.patch.mockRejectedValueOnce(ข้อผิดพลาด);

      const ข้อมูลการแก้ไข = { name: "ชื่อที่แก้ไขแล้ว" };

      await expect(บริการลูกค้า.update("999", ข้อมูลการแก้ไข))
        .rejects.toThrow("ไม่พบลูกค้า");
    });
  });

  describe("ลบลูกค้า", () => {
    test("ควรลบลูกค้าได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = { data: { success: true } };
      mockedAxios.delete.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ผลลัพธ์ = await บริการลูกค้า.deleteCustomer("1");

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining("/v1/customer/1"),
        expect.any(Object)
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });

    test("ควรจัดการข้อผิดพลาดเมื่อลบลูกค้า", async () => {
      const ข้อผิดพลาด = new Error("ไม่สามารถลบลูกค้าที่มีคำสั่งซื้อที่ใช้งานอยู่ได้");
      mockedAxios.delete.mockRejectedValueOnce(ข้อผิดพลาด);

      await expect(บริการลูกค้า.deleteCustomer("1"))
        .rejects.toThrow("ไม่สามารถลบลูกค้าที่มีคำสั่งซื้อที่ใช้งานอยู่ได้");
    });
  });

  describe("ดึงรายชื่อลูกค้า", () => {
    test("ควรดึงรายชื่อลูกค้าได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = {
        data: [
          { id: 1, name: "ลูกค้า 1" },
          { id: 2, name: "ลูกค้า 2" }
        ]
      };
      mockedAxios.get.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ผลลัพธ์ = await บริการลูกค้า.getCustomerNameList();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/customer/name-list"),
        expect.any(Object)
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });
  });
});