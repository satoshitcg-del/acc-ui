import { expect, test, describe, vi, beforeEach } from "vitest";
import axios from "axios";
import UserService from "./UserSevice";

// Mock axios
vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

describe("บริการผู้ใช้", () => {
  let บริการผู้ใช้: ReturnType<typeof UserService>;

  beforeEach(() => {
    vi.clearAllMocks();
    บริการผู้ใช้ = UserService();
  });

  describe("เข้าสู่ระบบ", () => {
    test("ควรเรียก API เข้าสู่ระบบด้วยพารามิเตอร์ที่ถูกต้อง", async () => {
      const การตอบกลับจำลอง = { data: { token: "mock-token" } };
      mockedAxios.post.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ข้อมูลเข้าสู่ระบบ = { email: "test@example.com", password: "password123" };
      const ผลลัพธ์ = await บริการผู้ใช้.signIn(ข้อมูลเข้าสู่ระบบ);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/auth/sign-in"),
        ข้อมูลเข้าสู่ระบบ
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });

    test("ควรโยนข้อผิดพลาดเมื่อการเรียก API ล้มเหลว", async () => {
      const ข้อผิดพลาด = new Error("ข้อผิดพลาดเครือข่าย");
      mockedAxios.post.mockRejectedValueOnce(ข้อผิดพลาด);

      const ข้อมูลเข้าสู่ระบบ = { email: "test@example.com", password: "รหัสผ่านผิด" };
      
      await expect(บริการผู้ใช้.signIn(ข้อมูลเข้าสู่ระบบ)).rejects.toThrow("ข้อผิดพลาดเครือข่าย");
    });
  });

  describe("ยืนยันตัวตนผู้ใช้", () => {
    test("ควรเรียก API ยืนยันตัวตนด้วยพารามิเตอร์ที่ถูกต้อง", async () => {
      const การตอบกลับจำลอง = { data: { verified: true } };
      mockedAxios.post.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ข้อมูลยืนยันตัวตน = { token: "verify-token" };
      const ผลลัพธ์ = await บริการผู้ใช้.verifyUser(ข้อมูลยืนยันตัวตน);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/auth/verify"),
        ข้อมูลยืนยันตัวตน
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });

    test("ควรโยนข้อผิดพลาดเมื่อการยืนยันตัวตนล้มเหลว", async () => {
      const ข้อผิดพลาด = new Error("Token ไม่ถูกต้อง");
      mockedAxios.post.mockRejectedValueOnce(ข้อผิดพลาด);

      const ข้อมูลยืนยันตัวตน = { token: "token-ไม่ถูกต้อง" };
      
      await expect(บริการผู้ใช้.verifyUser(ข้อมูลยืนยันตัวตน)).rejects.toThrow("Token ไม่ถูกต้อง");
    });
  });

  describe("ตั้งรหัสผ่าน", () => {
    test("ควรเรียก API ตั้งรหัสผ่านด้วยพารามิเตอร์ที่ถูกต้อง", async () => {
      const การตอบกลับจำลอง = { data: { success: true } };
      mockedAxios.post.mockResolvedValueOnce(การตอบกลับจำลอง);

      const รหัสผ่าน = "รหัสผ่านใหม่123";
      const ผลลัพธ์ = await บริการผู้ใช้.setPassword(รหัสผ่าน);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/auth/set-psw"),
        { password: รหัสผ่าน },
        expect.any(Object)
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });

    test("ควรโยนข้อผิดพลาดเมื่อการตั้งรหัสผ่านล้มเหลว", async () => {
      const ข้อผิดพลาด = new Error("รหัสผ่านอ่อนแอเกินไป");
      mockedAxios.post.mockRejectedValueOnce(ข้อผิดพลาด);

      const รหัสผ่าน = "อ่อนแอ";
      
      await expect(บริการผู้ใช้.setPassword(รหัสผ่าน)).rejects.toThrow("รหัสผ่านอ่อนแอเกินไป");
    });
  });

  describe("ตรวจสอบการยืนยันตัวตนสองขั้นตอน", () => {
    test("ควรเรียก API ตรวจสอบการยืนยันตัวตนสองขั้นตอน", async () => {
      const การตอบกลับจำลอง = { data: { requiresTwoFactor: true } };
      mockedAxios.post.mockResolvedValueOnce(การตอบกลับจำลอง);

      const ผลลัพธ์ = await บริการผู้ใช้.checkTwoFactor();

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/auth/check/totp"),
        {},
        expect.any(Object)
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });

    test("ควรโยนข้อผิดพลาดเมื่อการตรวจสอบการยืนยันตัวตนสองขั้นตอนล้มเหลว", async () => {
      const ข้อผิดพลาด = new Error("ยังไม่ได้ตั้งค่าการยืนยันตัวตนสองขั้นตอน");
      mockedAxios.post.mockRejectedValueOnce(ข้อผิดพลาด);
      
      await expect(บริการผู้ใช้.checkTwoFactor()).rejects.toThrow("ยังไม่ได้ตั้งค่าการยืนยันตัวตนสองขั้นตอน");
    });
  });

  describe("ส่งรหัสการยืนยันตัวตนสองขั้นตอน", () => {
    test("ควรเรียก API ยืนยันตัวตนสองขั้นตอนด้วยพารามิเตอร์ที่ถูกต้อง", async () => {
      const การตอบกลับจำลอง = { data: { verified: true } };
      mockedAxios.post.mockResolvedValueOnce(การตอบกลับจำลอง);

      const รหัสTOTP = "123456";
      const ผลลัพธ์ = await บริการผู้ใช้.sendTwoFactorUser(รหัสTOTP, true);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/auth/verify/totp"),
        { totp_key: รหัสTOTP },
        expect.any(Object)
      );
      expect(ผลลัพธ์).toEqual(การตอบกลับจำลอง.data);
    });

    test("ควรโยนข้อผิดพลาดเมื่อการยืนยันตัวตนสองขั้นตอนล้มเหลว", async () => {
      const ข้อผิดพลาด = new Error("รหัส TOTP ไม่ถูกต้อง");
      mockedAxios.post.mockRejectedValueOnce(ข้อผิดพลาด);

      const รหัสTOTP = "000000";
      
      await expect(บริการผู้ใช้.sendTwoFactorUser(รหัสTOTP, true)).rejects.toThrow("รหัส TOTP ไม่ถูกต้อง");
    });
  });
});