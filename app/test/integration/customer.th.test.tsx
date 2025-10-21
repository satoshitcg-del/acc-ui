import { expect, test, describe, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import CustomerTable from "../../routes/customers/components/CustomerTable";

// Mock the services
vi.mock("../../services/CustomerService", () => ({
  default: () => ({
    getListCustomer: vi.fn(),
    deleteCustomer: vi.fn(),
    getCustomerNameList: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    getOne: vi.fn()
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

describe("เทสการจัดการลูกค้าแบบครบวงจร", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("การดำเนินการ CRUD ลูกค้าทั้งหมด", async () => {
    const ข้อมูลลูกค้าจำลอง = [
      { id: 1, name: "ลูกค้า 1", email: "customer1@example.com" },
      { id: 2, name: "ลูกค้า 2", email: "customer2@example.com" }
    ];

    const CustomerService = require("../../services/CustomerService").default;
    const mockGetListCustomer = vi.fn().mockResolvedValue({
      customers: ข้อมูลลูกค้าจำลอง,
      total: 2
    });
    const mockDeleteCustomer = vi.fn().mockResolvedValue({ success: true });
    const mockCreate = vi.fn().mockResolvedValue({ id: 3, name: "ลูกค้าใหม่" });
    const mockUpdate = vi.fn().mockResolvedValue({ id: 1, name: "ลูกค้าที่แก้ไขแล้ว" });

    CustomerService().getListCustomer = mockGetListCustomer;
    CustomerService().deleteCustomer = mockDeleteCustomer;
    CustomerService().create = mockCreate;
    CustomerService().update = mockUpdate;

    render(
      <BrowserRouter>
        <CustomerTable />
      </BrowserRouter>
    );

    // รอให้ข้อมูลโหลด
    await waitFor(() => {
      expect(mockGetListCustomer).toHaveBeenCalled();
    });

    // ทดสอบฟังก์ชันการค้นหา
    const ช่องค้นหา = screen.getByPlaceholderText(/search/i);
    fireEvent.change(ช่องค้นหา, { target: { value: "ลูกค้า 1" } });

    await waitFor(() => {
      expect(ช่องค้นหา).toHaveValue("ลูกค้า 1");
    });

    // ทดสอบการเปลี่ยนหน้า
    const ปุ่มหน้าถัดไป = screen.getByRole("button", { name: /next/i });
    fireEvent.click(ปุ่มหน้าถัดไป);

    // ทดสอบฟังก์ชันการลบ
    const ปุ่มลบ = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(ปุ่มลบ);

    await waitFor(() => {
      expect(mockDeleteCustomer).toHaveBeenCalled();
    });
  });

  test("การจัดการการสร้างลูกค้า", async () => {
    const CustomerService = require("../../services/CustomerService").default;
    const mockCreate = vi.fn().mockResolvedValue({ 
      id: 3, 
      name: "ลูกค้าใหม่", 
      email: "newcustomer@example.com" 
    });
    CustomerService().create = mockCreate;

    render(
      <BrowserRouter>
        <CustomerTable />
      </BrowserRouter>
    );

    // จำลองการสร้างลูกค้า
    const ปุ่มสร้าง = screen.getByRole("button", { name: /create/i });
    fireEvent.click(ปุ่มสร้าง);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
    });
  });

  test("การจัดการการแก้ไขลูกค้า", async () => {
    const CustomerService = require("../../services/CustomerService").default;
    const mockUpdate = vi.fn().mockResolvedValue({ 
      id: 1, 
      name: "ลูกค้าที่แก้ไขแล้ว", 
      email: "updated@example.com" 
    });
    CustomerService().update = mockUpdate;

    render(
      <BrowserRouter>
        <CustomerTable />
      </BrowserRouter>
    );

    // จำลองการแก้ไขลูกค้า
    const ปุ่มแก้ไข = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(ปุ่มแก้ไข);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  test("การจัดการสถานการณ์ข้อผิดพลาด", async () => {
    const CustomerService = require("../../services/CustomerService").default;
    const mockGetListCustomer = vi.fn().mockRejectedValue(new Error("ข้อผิดพลาดเครือข่าย"));
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

  test("การจัดการรายการลูกค้าที่ว่าง", async () => {
    const CustomerService = require("../../services/CustomerService").default;
    const mockGetListCustomer = vi.fn().mockResolvedValue({
      customers: [],
      total: 0
    });
    CustomerService().getListCustomer = mockGetListCustomer;

    render(
      <BrowserRouter>
        <CustomerTable />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/no customers found/i)).toBeInTheDocument();
    });
  });
});