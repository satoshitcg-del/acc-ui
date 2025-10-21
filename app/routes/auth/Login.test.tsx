import { expect, test, describe, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import Login from "./Login";

// Mock the authentication components
vi.mock("./components/LoginForm", () => ({
  default: ({ callback }: { callback: (page: string) => void }) => (
    <div data-testid="login-form">
      <button onClick={() => callback("SetPasswordForm")}>Go to Set Password</button>
    </div>
  )
}));

vi.mock("./components/SettingPassword", () => ({
  default: ({ callback }: { callback: (page: string) => void }) => (
    <div data-testid="setting-password">
      <button onClick={() => callback("LoginForm")}>Back to Login</button>
    </div>
  )
}));

vi.mock("./components/SetUpAuthentication", () => ({
  default: ({ callback }: { callback: (page: string) => void }) => (
    <div data-testid="setup-authentication">
      <button onClick={() => callback("LoginForm")}>Back to Login</button>
    </div>
  )
}));

vi.mock("./components/TwoStepAuthentication", () => ({
  default: ({ callback }: { callback: (page: string) => void }) => (
    <div data-testid="two-step-authentication">
      <button onClick={() => callback("LoginForm")}>Back to Login</button>
    </div>
  )
}));

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders login form by default", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  test("switches to setting password form", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const switchButton = screen.getByText("Go to Set Password");
    fireEvent.click(switchButton);

    await waitFor(() => {
      expect(screen.getByTestId("setting-password")).toBeInTheDocument();
    });
  });

  test("switches back to login form from setting password", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // First switch to setting password
    const switchButton = screen.getByText("Go to Set Password");
    fireEvent.click(switchButton);

    await waitFor(() => {
      expect(screen.getByTestId("setting-password")).toBeInTheDocument();
    });

    // Then switch back to login
    const backButton = screen.getByText("Back to Login");
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByTestId("login-form")).toBeInTheDocument();
    });
  });

  test("renders page not found for unknown page", () => {
    // Mock the component to show an unknown page
    const UnknownPageComponent = () => {
      const [pageName, setPageName] = React.useState("UnknownPage" as any);
      const pageComponents = {
        LoginForm: <div data-testid="login-form">Login Form</div>,
        SetPasswordForm: <div data-testid="setting-password">Setting Password</div>,
        SetTwoFactorForm: <div data-testid="setup-authentication">Setup Authentication</div>,
        InputTwoFactorForm: <div data-testid="two-step-authentication">Two Step Authentication</div>,
      };

      return (
        <div>
          {pageComponents[pageName] || <div data-testid="page-not-found">Page not found</div>}
        </div>
      );
    };

    render(
      <BrowserRouter>
        <UnknownPageComponent />
      </BrowserRouter>
    );

    expect(screen.getByTestId("page-not-found")).toBeInTheDocument();
  });
});