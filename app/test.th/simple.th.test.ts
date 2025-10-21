import { expect, test, describe } from "vitest";

describe("เทสเคสพื้นฐาน - ภาษาไทย", () => {
  test("ควรทำงานได้ถูกต้อง", () => {
    expect(1 + 1).toBe(2);
  });

  test("ควรเปรียบเทียบข้อความได้", () => {
    const ข้อความ = "สวัสดีประเทศไทย";
    expect(ข้อความ).toContain("ไทย");
  });

  test("ควรตรวจสอบอาร์เรย์ได้", () => {
    const รายการ = ["ก", "ข", "ค"];
    expect(รายการ).toHaveLength(3);
    expect(รายการ).toContain("ข");
  });

  test("ควรตรวจสอบออบเจ็กต์ได้", () => {
    const ข้อมูล = {
      ชื่อ: "ทดสอบ",
      อายุ: 25,
      เมือง: "กรุงเทพ"
    };
    
    expect(ข้อมูล).toHaveProperty("ชื่อ");
    expect(ข้อมูล.อายุ).toBeGreaterThan(20);
    expect(ข้อมูล.เมือง).toBe("กรุงเทพ");
  });

  test("ควรจัดการ async ได้", async () => {
    const ฟังก์ชันAsync = async () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve("เสร็จสิ้น"), 100);
      });
    };

    const ผลลัพธ์ = await ฟังก์ชันAsync();
    expect(ผลลัพธ์).toBe("เสร็จสิ้น");
  });
});