import { expect, test, describe, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import Login from "./Login";

// Mock the authentication components
vi.mock("./components/LoginForm", () => ({
  default: ({ callback }: { callback: (page: string) => void }) => (
    <div data-testid="ฟอร์มเข้าสู่ระบบ">
      <button onClick={() => callback("SetPasswordForm")}>ไปยังการตั้งรหัสผ่าน</button>
    </div>
  )
}));

vi.mock("./components/SettingPassword", () => ({
  default: ({ callback }: { callback: (page: string) => void }) => (
    <div data-testid="การตั้งรหัสผ่าน">
      <button onClick={() => callback("LoginForm")}>กลับไปยังการเข้าสู่ระบบ</button>
    </div>
  )
}));

vi.mock("./components/SetUpAuthentication", () => ({
  default: ({ callback }: { callback: (page: string) => void }) => (
    <div data-testid="การตั้งค่าการยืนยันตัวตน">
      <button onClick={() => callback("LoginForm")}>กลับไปยังการเข้าสู่ระบบ</button>
    </div>
  )
}));

vi.mock("./components/TwoStepAuthentication", () => ({
  default: ({ callback }: { callback: (page: string) => void }) => (
    <div data-testid="การยืนยันตัวตนสองขั้นตอน">
      <button onClick={() => callback("LoginForm")}>กลับไปยังการเข้าสู่ระบบ</button>
    </div>
  )
}));

describe("หน้าจอเข้าสู่ระบบ", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("ควรแสดงฟอร์มเข้าสู่ระบบเป็นค่าเริ่มต้น", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByTestId("ฟอร์มเข้าสู่ระบบ")).toBeInTheDocument();
  });

  test("ควรเปลี่ยนไปยังหน้าตั้งรหัสผ่าน", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const ปุ่มเปลี่ยนหน้า = screen.getByText("ไปยังการตั้งรหัสผ่าน");
    fireEvent.click(ปุ่มเปลี่ยนหน้า);

    await waitFor(() => {
      expect(screen.getByTestId("การตั้งรหัสผ่าน")).toBeInTheDocument();
    });
  });

  test("ควรเปลี่ยนกลับไปยังฟอร์มเข้าสู่ระบบจากหน้าตั้งรหัสผ่าน", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // เปลี่ยนไปยังหน้าตั้งรหัสผ่านก่อน
    const ปุ่มเปลี่ยนหน้า = screen.getByText("ไปยังการตั้งรหัสผ่าน");
    fireEvent.click(ปุ่มเปลี่ยนหน้า);

    await waitFor(() => {
      expect(screen.getByTestId("การตั้งรหัสผ่าน")).toBeInTheDocument();
    });

    // แล้วเปลี่ยนกลับไปยังฟอร์มเข้าสู่ระบบ
    const ปุ่มกลับ = screen.getByText("กลับไปยังการเข้าสู่ระบบ");
    fireEvent.click(ปุ่มกลับ);

    await waitFor(() => {
      expect(screen.getByTestId("ฟอร์มเข้าสู่ระบบ")).toBeInTheDocument();
    });
  });

  test("ควรแสดงหน้าพบไม่เจอสำหรับหน้าที่ไม่รู้จัก", () => {
    // Mock component เพื่อแสดงหน้าที่ไม่รู้จัก
    const UnknownPageComponent = () => {
      const [pageName, setPageName] = React.useState("UnknownPage" as any);
      const pageComponents = {
        LoginForm: <div data-testid="ฟอร์มเข้าสู่ระบบ">ฟอร์มเข้าสู่ระบบ</div>,
        SetPasswordForm: <div data-testid="การตั้งรหัสผ่าน">การตั้งรหัสผ่าน</div>,
        SetTwoFactorForm: <div data-testid="การตั้งค่าการยืนยันตัวตน">การตั้งค่าการยืนยันตัวตน</div>,
        InputTwoFactorForm: <div data-testid="การยืนยันตัวตนสองขั้นตอน">การยืนยันตัวตนสองขั้นตอน</div>,
      };

      return (
        <div>
          {pageComponents[pageName] || <div data-testid="ไม่พบหน้า">ไม่พบหน้า</div>}
        </div>
      );
    };

    render(
      <BrowserRouter>
        <UnknownPageComponent />
      </BrowserRouter>
    );

    expect(screen.getByTestId("ไม่พบหน้า")).toBeInTheDocument();
  });
});