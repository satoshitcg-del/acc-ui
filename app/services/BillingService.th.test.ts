import { expect, test, describe, vi, beforeEach } from "vitest";
import axios from "axios";
import BillingService from "./BillingService";

// Mock axios
vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

describe("บริการบิล", () => {
  let บริการบิล: ReturnType<typeof BillingService>;

  beforeEach(() => {
    vi.clearAllMocks();
    บริการบิล = BillingService();
  });

  describe("ดึงรายการบิล", () => {
    test("ควรดึงรายการบิลได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = {
        data: {
          billingNotes: [
            { id: 1, customerId: 1, amount: 1000, status: "รอดำเนินการ" },
            { id: 2, customerId: 2, amount: 2000, status: "ชำระแล้ว" }
          ],
          total: 2
        }
      };
      mockedAxios.get.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ผลลัพธ์ = await บริการบิล.getBillingNote({ page: "1", limit: "10" });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/billing-note"),
        expect.objectContaining({
          params: { page: 1, limit: 10 }
        })
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });

    test("ควรจัดการข้อผิดพลาด API เมื่อดึงรายการบิล", async () => {
      const ข้อผิดพลาด = new Error("ไม่สามารถดึงข้อมูลบิลได้");
      mockedAxios.get.mockRejectedValueOnce(ข้อผิดพลาด);

      await expect(บริการบิล.getBillingNote({ page: "1", limit: "10" }))
        .rejects.toThrow("ไม่สามารถดึงข้อมูลบิลได้");
    });
  });

  describe("สร้าง PDF", () => {
    test("ควรสร้าง PDF ได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = {
        data: {
          pdfUrl: "https://example.com/billing-note-1.pdf",
          success: true
        }
      };
      mockedAxios.post.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ข้อมูลบิล = "1";
      const ผลลัพธ์ = await บริการบิล.preview(ข้อมูลบิล);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/billing-note/preview"),
        ข้อมูลบิล,
        expect.any(Object)
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });

    test("ควรจัดการข้อผิดพลาดเมื่อสร้าง PDF", async () => {
      const ข้อผิดพลาด = new Error("การสร้าง PDF ล้มเหลว");
      mockedAxios.post.mockRejectedValueOnce(ข้อผิดพลาด);

      const ข้อมูลบิล = "1";

      await expect(บริการบิล.preview(ข้อมูลบิล))
        .rejects.toThrow("การสร้าง PDF ล้มเหลว");
    });
  });

  describe("ดูตัวอย่างบิล", () => {
    test("ควรดูตัวอย่างบิลได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = {
        data: {
          preview: {
            customer: { name: "ลูกค้า 1" },
            items: [{ name: "สินค้า 1", quantity: 2, price: 100 }],
            total: 200
          }
        }
      };
      mockedAxios.post.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ข้อมูลตัวอย่าง = "1";
      const ผลลัพธ์ = await บริการบิล.preview(ข้อมูลตัวอย่าง);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/billing-note/preview"),
        ข้อมูลตัวอย่าง,
        expect.any(Object)
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });
  });

  describe("ค้นหาบิล", () => {
    test("ควรค้นหาบิลได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = {
        data: {
          results: [
            { id: 1, customerName: "ลูกค้า 1", amount: 1000 }
          ],
          total: 1
        }
      };
      mockedAxios.get.mockResolvedValueOnce(การตอบกลับจำลอง);

      const พารามิเตอร์การค้นหา = {
        username: "ลูกค้า 1",
        invoice_no: "",
        product_id: "",
        prefix: "",
        status: "รอดำเนินการ",
        start_date: "",
        end_date: "",
        page: "1",
        limit: "10"
      };
      const ผลลัพธ์ = await บริการบิล.search(พารามิเตอร์การค้นหา);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/billing-note/search"),
        expect.objectContaining({
          params: พารามิเตอร์การค้นหา
        })
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });
  });

  describe("ดึงข้อมูลแดชบอร์ด", () => {
    test("ควรดึงข้อมูลแดชบอร์ดได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = {
        data: {
          totalRevenue: 50000,
          totalCustomers: 100,
          pendingBills: 5,
          paidBills: 95
        }
      };
      mockedAxios.get.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ผลลัพธ์ = await บริการบิล.getDashboard();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/dashboard"),
        expect.any(Object)
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });
  });

  describe("ดึงข้อมูลลูกค้า", () => {
    test("ควรดึงข้อมูลลูกค้าได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = {
        data: {
          id: 1,
          name: "ลูกค้า 1",
          email: "customer1@example.com",
          totalBills: 10,
          totalAmount: 5000
        }
      };
      mockedAxios.get.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ผลลัพธ์ = await บริการบิล.getCustomerInfo("1", "1");

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/customer/1/info"),
        expect.any(Object)
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });
  });

  describe("ดึงประวัติ", () => {
    test("ควรดึงประวัติบิลได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = {
        data: {
          history: [
            { id: 1, action: "สร้าง", timestamp: "2024-01-01T10:00:00Z" },
            { id: 2, action: "แก้ไข", timestamp: "2024-01-01T11:00:00Z" }
          ]
        }
      };
      mockedAxios.get.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ผลลัพธ์ = await บริการบิล.getHistory("1");

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/billing-note/1/history"),
        expect.any(Object)
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });
  });

  describe("ดึงรายละเอียดบิล", () => {
    test("ควรดึงรายละเอียดบิลได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = {
        data: {
          id: 1,
          customerId: 1,
          amount: 1000,
          status: "รอดำเนินการ",
          items: [
            { productId: 1, quantity: 2, price: 500 }
          ]
        }
      };
      mockedAxios.get.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ผลลัพธ์ = await บริการบิล.getNote("1");

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/billing-note/1"),
        expect.any(Object)
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });
  });

  describe("แก้ไขบิล", () => {
    test("ควรแก้ไขบิลได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = {
        data: {
          id: 1,
          status: "แก้ไขแล้ว",
          success: true
        }
      };
      mockedAxios.post.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ข้อมูลการแก้ไข = {
        invoice_id: "1",
        note: "หมายเหตุที่แก้ไขแล้ว"
      };
      const ผลลัพธ์ = await บริการบิล.updateNote(ข้อมูลการแก้ไข);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/billing-note/note"),
        ข้อมูลการแก้ไข,
        expect.any(Object)
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });
  });

  describe("อัพเดทสถานะ", () => {
    test("ควรอัพเดทสถานะบิลได้สำเร็จ", async () => {
      const การตอบกลับจำลอง = {
        data: {
          id: 1,
          status: "ชำระแล้ว",
          success: true
        }
      };
      mockedAxios.post.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ข้อมูลสถานะ = {
        invoice_id: "1",
        status: "ชำระแล้ว"
      };
      const ผลลัพธ์ = await บริการบิล.updateStatus(ข้อมูลสถานะ);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/billing-note/update"),
        ข้อมูลสถานะ,
        expect.any(Object)
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });
  });
});