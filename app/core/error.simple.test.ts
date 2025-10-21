import { expect, test, describe } from "vitest";
import { handleErrorCode } from "./error";

describe("ระบบจัดการข้อผิดพลาด - เทสเคสง่าย", () => {
  test("ควรส่งคืนข้อความสำเร็จ", () => {
    expect(handleErrorCode(1001)).toBe("Success.");
  });

  test("ควรส่งคืนข้อความข้อผิดพลาดการตรวจสอบ", () => {
    expect(handleErrorCode(1002)).toBe("System can not validate data. Please try again later.");
  });

  test("ควรส่งคืนข้อความเริ่มต้นสำหรับรหัสที่ไม่รู้จัก", () => {
    expect(handleErrorCode(9999)).toBe("Unknown error code.");
  });
});