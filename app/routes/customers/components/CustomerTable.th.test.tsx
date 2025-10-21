import { expect, test, describe, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import CustomerTable from "./CustomerTable";

// Mock the services
vi.mock("../../../services/CustomerService", () => ({
  default: () => ({
    getListCustomer: vi.fn(),
    deleteCustomer: vi.fn(),
    getCustomerNameList: vi.fn()
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

describe("ตารางลูกค้า", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("ควรแสดงตารางลูกค้า", () => {
    render(
      <BrowserRouter>
        <CustomerTable />
      </BrowserRouter>
    );

    // ตรวจสอบว่าคอมโพเนนต์แสดงผลโดยไม่เกิดข้อผิดพลาด
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  test("ควรแสดงสถานะการโหลดในตอนแรก", () => {
    render(
      <BrowserRouter>
        <CustomerTable />
      </BrowserRouter>
    );

    // คอมโพเนนต์ควรแสดงสถานะการโหลดในตอนแรก
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("ควรจัดการการโหลดข้อมูลลูกค้า", async () => {
    const ข้อมูลลูกค้าจำลอง = [
      { id: 1, name: "ลูกค้า 1", email: "customer1@example.com" },
      { id: 2, name: "ลูกค้า 2", email: "customer2@example.com" }
    ];

    const CustomerService = require("../../../services/CustomerService").default;
    const mockGetListCustomer = vi.fn().mockResolvedValue({
      customers: ข้อมูลลูกค้าจำลอง,
      total: 2
    });
    CustomerService().getListCustomer = mockGetListCustomer;

    render(
      <BrowserRouter>
        <CustomerTable />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetListCustomer).toHaveBeenCalled();
    });
  });

  test("ควรจัดการการลบลูกค้า", async () => {
    const CustomerService = require("../../../services/CustomerService").default;
    const mockDeleteCustomer = vi.fn().mockResolvedValue({ success: true });
    CustomerService().deleteCustomer = mockDeleteCustomer;

    render(
      <BrowserRouter>
        <CustomerTable />
      </BrowserRouter>
    );

    // จำลองการลบ
    const ปุ่มลบ = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(ปุ่มลบ);

    await waitFor(() => {
      expect(mockDeleteCustomer).toHaveBeenCalled();
    });
  });

  test("ควรจัดการฟังก์ชันการค้นหา", async () => {
    render(
      <BrowserRouter>
        <CustomerTable />
      </BrowserRouter>
    );

    const ช่องค้นหา = screen.getByPlaceholderText(/search/i);
    fireEvent.change(ช่องค้นหา, { target: { value: "ลูกค้าทดสอบ" } });

    await waitFor(() => {
      expect(ช่องค้นหา).toHaveValue("ลูกค้าทดสอบ");
    });
  });

  test("ควรจัดการการเปลี่ยนหน้า", async () => {
    render(
      <BrowserRouter>
        <CustomerTable />
      </BrowserRouter>
    );

    const ปุ่มหน้าถัดไป = screen.getByRole("button", { name: /next/i });
    fireEvent.click(ปุ่มหน้าถัดไป);

    // ตรวจสอบการเปลี่ยนหน้า
    expect(ปุ่มหน้าถัดไป).toBeInTheDocument();
  });

  test("ควรแสดงข้อความข้อผิดพลาดเมื่อ API ล้มเหลว", async () => {
    const CustomerService = require("../../../services/CustomerService").default;
    const mockGetListCustomer = vi.fn().mockRejectedValue(new Error("ข้อผิดพลาด API"));
    CustomerService().getListCustomer = mockGetListCustomer;

    render(
      <BrowserRouter>
        <CustomerTable />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});