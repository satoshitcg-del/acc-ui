import { expect, test, describe, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import Login from "../../routes/auth/Login";

// Mock the authentication services
vi.mock("../../services/UserSevice", () => ({
  default: () => ({
    signIn: vi.fn(),
    verifyUser: vi.fn(),
    setPassword: vi.fn(),
    checkTwoFactor: vi.fn(),
    sendTwoFactorUser: vi.fn()
  })
}));

// Mock the authentication components
vi.mock("../../routes/auth/components/LoginForm", () => ({
  default: ({ callback }: { callback: (page: string) => void }) => (
    <div data-testid="ฟอร์มเข้าสู่ระบบ">
      <button onClick={() => callback("SetPasswordForm")}>ไปยังการตั้งรหัสผ่าน</button>
      <button onClick={() => callback("SetTwoFactorForm")}>ไปยังการตั้งค่า 2FA</button>
      <button onClick={() => callback("InputTwoFactorForm")}>ไปยังการใส่รหัส 2FA</button>
    </div>
  )
}));

vi.mock("../../routes/auth/components/SettingPassword", () => ({
  default: ({ callback }: { callback: (page: string) => void }) => (
    <div data-testid="การตั้งรหัสผ่าน">
      <button onClick={() => callback("LoginForm")}>กลับไปยังการเข้าสู่ระบบ</button>
    </div>
  )
}));

vi.mock("../../routes/auth/components/SetUpAuthentication", () => ({
  default: ({ callback }: { callback: (page: string) => void }) => (
    <div data-testid="การตั้งค่าการยืนยันตัวตน">
      <button onClick={() => callback("LoginForm")}>กลับไปยังการเข้าสู่ระบบ</button>
    </div>
  )
}));

vi.mock("../../routes/auth/components/TwoStepAuthentication", () => ({
  default: ({ callback }: { callback: (page: string) => void }) => (
    <div data-testid="การยืนยันตัวตนสองขั้นตอน">
      <button onClick={() => callback("LoginForm")}>กลับไปยังการเข้าสู่ระบบ</button>
    </div>
  )
}));

describe("เทสการยืนยันตัวตนแบบครบวงจร", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("การไหลของการยืนยันตัวตนแบบสมบูรณ์", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // แสดงฟอร์มเข้าสู่ระบบในตอนแรก
    expect(screen.getByTestId("ฟอร์มเข้าสู่ระบบ")).toBeInTheDocument();

    // ไปยังการตั้งรหัสผ่าน
    const ปุ่มตั้งรหัสผ่าน = screen.getByText("ไปยังการตั้งรหัสผ่าน");
    fireEvent.click(ปุ่มตั้งรหัสผ่าน);

    await waitFor(() => {
      expect(screen.getByTestId("การตั้งรหัสผ่าน")).toBeInTheDocument();
    });

    // กลับไปยังฟอร์มเข้าสู่ระบบ
    const ปุ่มกลับไปยังการเข้าสู่ระบบ = screen.getByText("กลับไปยังการเข้าสู่ระบบ");
    fireEvent.click(ปุ่มกลับไปยังการเข้าสู่ระบบ);

    await waitFor(() => {
      expect(screen.getByTestId("ฟอร์มเข้าสู่ระบบ")).toBeInTheDocument();
    });
  });

  test("การไหลของการยืนยันตัวตนสองขั้นตอน", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // ไปยังการตั้งค่า 2FA
    const ปุ่มตั้งค่า2FA = screen.getByText("ไปยังการตั้งค่า 2FA");
    fireEvent.click(ปุ่มตั้งค่า2FA);

    await waitFor(() => {
      expect(screen.getByTestId("การตั้งค่าการยืนยันตัวตน")).toBeInTheDocument();
    });

    // กลับไปยังฟอร์มเข้าสู่ระบบ
    const ปุ่มกลับไปยังการเข้าสู่ระบบ = screen.getByText("กลับไปยังการเข้าสู่ระบบ");
    fireEvent.click(ปุ่มกลับไปยังการเข้าสู่ระบบ);

    await waitFor(() => {
      expect(screen.getByTestId("ฟอร์มเข้าสู่ระบบ")).toBeInTheDocument();
    });
  });

  test("การไหลของการใส่รหัส 2FA", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // ไปยังการใส่รหัส 2FA
    const ปุ่มใส่รหัส2FA = screen.getByText("ไปยังการใส่รหัส 2FA");
    fireEvent.click(ปุ่มใส่รหัส2FA);

    await waitFor(() => {
      expect(screen.getByTestId("การยืนยันตัวตนสองขั้นตอน")).toBeInTheDocument();
    });

    // กลับไปยังฟอร์มเข้าสู่ระบบ
    const ปุ่มกลับไปยังการเข้าสู่ระบบ = screen.getByText("กลับไปยังการเข้าสู่ระบบ");
    fireEvent.click(ปุ่มกลับไปยังการเข้าสู่ระบบ);

    await waitFor(() => {
      expect(screen.getByTestId("ฟอร์มเข้าสู่ระบบ")).toBeInTheDocument();
    });
  });
});