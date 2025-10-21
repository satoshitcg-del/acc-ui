import { expect, test, describe, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Component } from "./Dashboard";

// Mock the usePageEffect hook
vi.mock("../../core/page", () => ({
  usePageEffect: vi.fn()
}));

describe("Dashboard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders welcome message", () => {
    render(
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    );

    expect(screen.getByText("Welcome to React Starter Kit!")).toBeInTheDocument();
  });

  test("renders description text", () => {
    render(
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    );

    expect(screen.getByText("The web's most popular Jamstack React template.")).toBeInTheDocument();
  });

  test("renders Material UI component text", () => {
    render(
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    );

    expect(screen.getByText("This is Material UI Component")).toBeInTheDocument();
  });

  test("renders Tailwind component text", () => {
    render(
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    );

    expect(screen.getByText("This is Tailwind Component")).toBeInTheDocument();
  });

  test("renders Explorer API button", () => {
    render(
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    );

    const button = screen.getByText("Explorer API");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/api");
  });

  test("has correct display name", () => {
    expect(Component.displayName).toBe("Dashboard");
  });

  test("uses correct page title", () => {
    const { usePageEffect } = require("../../core/page");
    
    render(
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    );

    expect(usePageEffect).toHaveBeenCalledWith({ title: "Accounting" });
  });
});