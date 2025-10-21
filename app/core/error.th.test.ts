import { expect, test, describe } from "vitest";
import { handleErrorCode } from "./error";

describe("ระบบจัดการข้อผิดพลาด", () => {
  test("ควรส่งคืนข้อความที่ถูกต้องสำหรับรหัสสำเร็จ", () => {
    expect(handleErrorCode(1001)).toBe("Success.");
  });

  test("ควรส่งคืนข้อความที่ถูกต้องสำหรับข้อผิดพลาดการตรวจสอบ", () => {
    expect(handleErrorCode(1002)).toBe("System can not validate data. Please try again later.");
  });

  test("ควรส่งคืนข้อความที่ถูกต้องสำหรับข้อผิดพลาดระบบ", () => {
    expect(handleErrorCode(1003)).toBe("System cannot process this request at the moment. Please try again later.");
  });

  test("ควรส่งคืนข้อความที่ถูกต้องสำหรับคำขอที่ไม่ถูกต้อง", () => {
    expect(handleErrorCode(1004)).toBe("Bad request. Please try again later.");
  });

  test("ควรส่งคืนข้อความที่ถูกต้องสำหรับการยืนยันตัวตนล้มเหลว", () => {
    expect(handleErrorCode(1005)).toBe("Authentication failed. Please sign in.");
  });

  test("ควรส่งคืนข้อความที่ถูกต้องสำหรับข้อมูลเข้าสู่ระบบไม่ถูกต้อง", () => {
    expect(handleErrorCode(1006)).toBe("The email or password is incorrect. Please try again later.");
  });

  test("ควรส่งคืนข้อความที่ถูกต้องสำหรับ captcha ไม่ถูกต้อง", () => {
    expect(handleErrorCode(1007)).toBe("Your captcha is invalid.");
  });

  test("ควรส่งคืนข้อความที่ถูกต้องสำหรับการยืนยันตัวตนแล้ว", () => {
    expect(handleErrorCode(1008)).toBe("You have already verified your identity.");
  });

  test("ควรส่งคืนข้อความที่ถูกต้องสำหรับการตั้งรหัสผ่าน", () => {
    expect(handleErrorCode(1009)).toBe("Please set a new password.");
  });

  test("ควรส่งคืนข้อความที่ถูกต้องสำหรับการยืนยันตัวตนสองขั้นตอน", () => {
    expect(handleErrorCode(10010)).toBe("Please confirm two factor authentication.");
  });

  test("ควรส่งคืนข้อความที่ถูกต้องสำหรับไม่พบบทบาท", () => {
    expect(handleErrorCode(10011)).toBe("Role is not found.");
  });

  test("ควรส่งคืนข้อความที่ถูกต้องสำหรับบัญชีถูกล็อค", () => {
    expect(handleErrorCode(10012)).toBe("Account is locked, Please Contact Admin.");
  });

  test("ควรส่งคืนข้อความที่ถูกต้องสำหรับการยืนยันตัวตนสองขั้นตอนไม่ถูกต้อง", () => {
    expect(handleErrorCode(10013)).toBe("Two factor authentication is invalid.");
  });

  test("ควรส่งคืนข้อความที่ถูกต้องสำหรับไม่พบอีเมล", () => {
    expect(handleErrorCode(10014)).toBe("Email is not found.");
  });

  test("ควรส่งคืนข้อความเริ่มต้นสำหรับรหัสข้อผิดพลาดที่ไม่รู้จัก", () => {
    expect(handleErrorCode(9999)).toBe("Unknown error code.");
  });

  test("ควรส่งคืนข้อความเริ่มต้นสำหรับรหัสข้อผิดพลาดที่เป็นลบ", () => {
    expect(handleErrorCode(-1)).toBe("Unknown error code.");
  });

  test("ควรส่งคืนข้อความเริ่มต้นสำหรับรหัสข้อผิดพลาดเป็นศูนย์", () => {
    expect(handleErrorCode(0)).toBe("Unknown error code.");
  });
});