import { expect, test, describe, vi, beforeEach } from "vitest";
import axios from "axios";
import UserService from "./UserSevice";

// Mock axios
vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

describe("UserService", () => {
  let userService: ReturnType<typeof UserService>;

  beforeEach(() => {
    vi.clearAllMocks();
    userService = UserService();
  });

  describe("signIn", () => {
    test("should call sign-in API with correct parameters", async () => {
      const mockResponse = { data: { token: "mock-token" } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const signInData = { email: "test@example.com", password: "password123" };
      const result = await userService.signIn(signInData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/auth/sign-in"),
        signInData
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should throw error when API call fails", async () => {
      const error = new Error("Network error");
      mockedAxios.post.mockRejectedValueOnce(error);

      const signInData = { email: "test@example.com", password: "wrongpassword" };
      
      await expect(userService.signIn(signInData)).rejects.toThrow("Network error");
    });
  });

  describe("verifyUser", () => {
    test("should call verify API with correct parameters", async () => {
      const mockResponse = { data: { verified: true } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const verifyData = { token: "verify-token" };
      const result = await userService.verifyUser(verifyData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/auth/verify"),
        verifyData
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should throw error when verification fails", async () => {
      const error = new Error("Invalid token");
      mockedAxios.post.mockRejectedValueOnce(error);

      const verifyData = { token: "invalid-token" };
      
      await expect(userService.verifyUser(verifyData)).rejects.toThrow("Invalid token");
    });
  });

  describe("setPassword", () => {
    test("should call set password API with correct parameters", async () => {
      const mockResponse = { data: { success: true } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const password = "newPassword123";
      const result = await userService.setPassword(password);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/auth/set-psw"),
        { password },
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should throw error when password setting fails", async () => {
      const error = new Error("Password too weak");
      mockedAxios.post.mockRejectedValueOnce(error);

      const password = "weak";
      
      await expect(userService.setPassword(password)).rejects.toThrow("Password too weak");
    });
  });

  describe("checkTwoFactor", () => {
    test("should call check two factor API", async () => {
      const mockResponse = { data: { requiresTwoFactor: true } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await userService.checkTwoFactor();

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/auth/check/totp"),
        {},
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should throw error when two factor check fails", async () => {
      const error = new Error("Two factor not configured");
      mockedAxios.post.mockRejectedValueOnce(error);
      
      await expect(userService.checkTwoFactor()).rejects.toThrow("Two factor not configured");
    });
  });

  describe("sendTwoFactorUser", () => {
    test("should call two factor verification API with correct parameters", async () => {
      const mockResponse = { data: { verified: true } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const totpKey = "123456";
      const result = await userService.sendTwoFactorUser(totpKey, true);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/auth/verify/totp"),
        { totp_key: totpKey },
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should throw error when two factor verification fails", async () => {
      const error = new Error("Invalid TOTP code");
      mockedAxios.post.mockRejectedValueOnce(error);

      const totpKey = "000000";
      
      await expect(userService.sendTwoFactorUser(totpKey, true)).rejects.toThrow("Invalid TOTP code");
    });
  });
});