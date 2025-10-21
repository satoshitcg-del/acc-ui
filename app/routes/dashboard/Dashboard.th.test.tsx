import { expect, test, describe, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Component } from "./Dashboard";

// Mock the usePageEffect hook
vi.mock("../../core/page", () => ({
  usePageEffect: vi.fn()
}));

describe("หน้าจอแดชบอร์ด", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("ควรแสดงข้อความต้อนรับ", () => {
    render(
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    );

    expect(screen.getByText("Welcome to React Starter Kit!")).toBeInTheDocument();
  });

  test("ควรแสดงข้อความอธิบาย", () => {
    render(
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    );

    expect(screen.getByText("The web's most popular Jamstack React template.")).toBeInTheDocument();
  });

  test("ควรแสดงข้อความคอมโพเนนต์ Material UI", () => {
    render(
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    );

    expect(screen.getByText("This is Material UI Component")).toBeInTheDocument();
  });

  test("ควรแสดงข้อความคอมโพเนนต์ Tailwind", () => {
    render(
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    );

    expect(screen.getByText("This is Tailwind Component")).toBeInTheDocument();
  });

  test("ควรแสดงปุ่ม Explorer API", () => {
    render(
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    );

    const ปุ่ม = screen.getByText("Explorer API");
    expect(ปุ่ม).toBeInTheDocument();
    expect(ปุ่ม).toHaveAttribute("href", "/api");
  });

  test("ควรมีชื่อแสดงผลที่ถูกต้อง", () => {
    expect(Component.displayName).toBe("Dashboard");
  });

  test("ควรใช้ชื่อหน้าที่ถูกต้อง", () => {
    const { usePageEffect } = require("../../core/page");
    
    render(
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    );

    expect(usePageEffect).toHaveBeenCalledWith({ title: "Accounting" });
  });
});