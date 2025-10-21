import { expect, test, describe } from "vitest";
import { formatDate } from "./dateUtils";

describe("ระบบจัดการวันที่", () => {
  test("ควรจัดรูปแบบวันที่ได้ถูกต้อง", () => {
    const วันที่ทดสอบ = new Date("2024-01-15T10:30:00Z");
    const ผลลัพธ์ที่จัดรูปแบบแล้ว = formatDate(วันที่ทดสอบ);
    expect(ผลลัพธ์ที่จัดรูปแบบแล้ว).toBeDefined();
    expect(typeof ผลลัพธ์ที่จัดรูปแบบแล้ว).toBe("string");
  });

  test("ควรจัดการวันที่ที่ไม่ถูกต้องได้", () => {
    const วันที่ไม่ถูกต้อง = new Date("invalid");
    const ผลลัพธ์ที่จัดรูปแบบแล้ว = formatDate(วันที่ไม่ถูกต้อง);
    expect(ผลลัพธ์ที่จัดรูปแบบแล้ว).toBeDefined();
  });

  test("ควรจัดการวันที่ที่เป็น null ได้", () => {
    const ผลลัพธ์ที่จัดรูปแบบแล้ว = formatDate(null);
    expect(ผลลัพธ์ที่จัดรูปแบบแล้ว).toBeDefined();
  });

  test("ควรจัดการวันที่ที่เป็น undefined ได้", () => {
    const ผลลัพธ์ที่จัดรูปแบบแล้ว = formatDate(undefined);
    expect(ผลลัพธ์ที่จัดรูปแบบแล้ว).toBeDefined();
  });
});