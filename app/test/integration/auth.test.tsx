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
    <div data-testid="login-form">
      <button onClick={() => callback("SetPasswordForm")}>Go to Set Password</button>
      <button onClick={() => callback("SetTwoFactorForm")}>Go to Setup 2FA</button>
      <button onClick={() => callback("InputTwoFactorForm")}>Go to 2FA Input</button>
    </div>
  )
}));

vi.mock("../../routes/auth/components/SettingPassword", () => ({
  default: ({ callback }: { callback: (page: string) => void }) => (
    <div data-testid="setting-password">
      <button onClick={() => callback("LoginForm")}>Back to Login</button>
    </div>
  )
}));

vi.mock("../../routes/auth/components/SetUpAuthentication", () => ({
  default: ({ callback }: { callback: (page: string) => void }) => (
    <div data-testid="setup-authentication">
      <button onClick={() => callback("LoginForm")}>Back to Login</button>
    </div>
  )
}));

vi.mock("../../routes/auth/components/TwoStepAuthentication", () => ({
  default: ({ callback }: { callback: (page: string) => void }) => (
    <div data-testid="two-step-authentication">
      <button onClick={() => callback("LoginForm")}>Back to Login</button>
    </div>
  )
}));

describe("Authentication Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("complete authentication flow", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Initially shows login form
    expect(screen.getByTestId("login-form")).toBeInTheDocument();

    // Navigate to password setting
    const setPasswordButton = screen.getByText("Go to Set Password");
    fireEvent.click(setPasswordButton);

    await waitFor(() => {
      expect(screen.getByTestId("setting-password")).toBeInTheDocument();
    });

    // Navigate back to login
    const backToLoginButton = screen.getByText("Back to Login");
    fireEvent.click(backToLoginButton);

    await waitFor(() => {
      expect(screen.getByTestId("login-form")).toBeInTheDocument();
    });
  });

  test("two-factor authentication flow", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Navigate to 2FA setup
    const setup2FAButton = screen.getByText("Go to Setup 2FA");
    fireEvent.click(setup2FAButton);

    await waitFor(() => {
      expect(screen.getByTestId("setup-authentication")).toBeInTheDocument();
    });

    // Navigate back to login
    const backToLoginButton = screen.getByText("Back to Login");
    fireEvent.click(backToLoginButton);

    await waitFor(() => {
      expect(screen.getByTestId("login-form")).toBeInTheDocument();
    });
  });

  test("two-factor input flow", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Navigate to 2FA input
    const input2FAButton = screen.getByText("Go to 2FA Input");
    fireEvent.click(input2FAButton);

    await waitFor(() => {
      expect(screen.getByTestId("two-step-authentication")).toBeInTheDocument();
    });

    // Navigate back to login
    const backToLoginButton = screen.getByText("Back to Login");
    fireEvent.click(backToLoginButton);

    await waitFor(() => {
      expect(screen.getByTestId("login-form")).toBeInTheDocument();
    });
  });
});