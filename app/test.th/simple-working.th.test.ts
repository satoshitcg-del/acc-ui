import { expect, test, describe } from "vitest";

// ฟังก์ชันที่จำลองการทำงานของระบบบัญชี
function สร้างรหัสลูกค้า(ลำดับ: number): string {
  return `C${ลำดับ.toString().padStart(3, '0')}`;
}

function สร้างรหัสสินค้า(ลำดับ: number): string {
  return `P${ลำดับ.toString().padStart(3, '0')}`;
}

function สร้างรหัสบิล(ลำดับ: number): string {
  return `INV-${ลำดับ.toString().padStart(3, '0')}`;
}

function ตรวจสอบอีเมล(อีเมล: string): boolean {
  const รูปแบบอีเมล = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return รูปแบบอีเมล.test(อีเมล);
}

function คำนวณภาษีมูลค่าเพิ่ม(ยอดเงิน: number, อัตราภาษี: number = 0.07): number {
  return Math.round(ยอดเงิน * อัตราภาษี);
}

function คำนวณยอดรวมรวมภาษี(ยอดเงิน: number, อัตราภาษี: number = 0.07): number {
  const ภาษี = คำนวณภาษีมูลค่าเพิ่ม(ยอดเงิน, อัตราภาษี);
  return ยอดเงิน + ภาษี;
}

function จัดรูปแบบเงิน(จำนวน: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(จำนวน);
}

function สร้างวันที่ไทย(วันที่: Date): string {
  return วันที่.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function ตรวจสอบรหัสบิล(รหัสบิล: string): boolean {
  const รูปแบบรหัสบิล = /^INV-\d{3}$/;
  return รูปแบบรหัสบิล.test(รหัสบิล);
}

function ตรวจสอบรหัสลูกค้า(รหัสลูกค้า: string): boolean {
  const รูปแบบรหัสลูกค้า = /^C\d{3}$/;
  return รูปแบบรหัสลูกค้า.test(รหัสลูกค้า);
}

function ตรวจสอบรหัสสินค้า(รหัสสินค้า: string): boolean {
  const รูปแบบรหัสสินค้า = /^P\d{3}$/;
  return รูปแบบรหัสสินค้า.test(รหัสสินค้า);
}

describe("ระบบบัญชี - เทสเคสการทำงานแบบสมบูรณ์", () => {
  test("ควรสร้างรหัสลูกค้าได้ถูกต้อง", () => {
    expect(สร้างรหัสลูกค้า(1)).toBe("C001");
    expect(สร้างรหัสลูกค้า(10)).toBe("C010");
    expect(สร้างรหัสลูกค้า(100)).toBe("C100");
  });

  test("ควรสร้างรหัสสินค้าได้ถูกต้อง", () => {
    expect(สร้างรหัสสินค้า(1)).toBe("P001");
    expect(สร้างรหัสสินค้า(25)).toBe("P025");
    expect(สร้างรหัสสินค้า(999)).toBe("P999");
  });

  test("ควรสร้างรหัสบิลได้ถูกต้อง", () => {
    expect(สร้างรหัสบิล(1)).toBe("INV-001");
    expect(สร้างรหัสบิล(50)).toBe("INV-050");
    expect(สร้างรหัสบิล(100)).toBe("INV-100");
  });

  test("ควรตรวจสอบอีเมลได้ถูกต้อง", () => {
    expect(ตรวจสอบอีเมล("test@example.com")).toBe(true);
    expect(ตรวจสอบอีเมล("user@domain.co.th")).toBe(true);
    expect(ตรวจสอบอีเมล("admin@company.com")).toBe(true);
    
    expect(ตรวจสอบอีเมล("invalid-email")).toBe(false);
    expect(ตรวจสอบอีเมล("@example.com")).toBe(false);
    expect(ตรวจสอบอีเมล("test@")).toBe(false);
    expect(ตรวจสอบอีเมล("")).toBe(false);
  });

  test("ควรคำนวณภาษีมูลค่าเพิ่มได้ถูกต้อง", () => {
    expect(คำนวณภาษีมูลค่าเพิ่ม(1000)).toBe(70);
    expect(คำนวณภาษีมูลค่าเพิ่ม(2000)).toBe(140);
    expect(คำนวณภาษีมูลค่าเพิ่ม(1000, 0.1)).toBe(100);
  });

  test("ควรคำนวณยอดรวมรวมภาษีได้ถูกต้อง", () => {
    expect(คำนวณยอดรวมรวมภาษี(1000)).toBe(1070);
    expect(คำนวณยอดรวมรวมภาษี(2000)).toBe(2140);
    expect(คำนวณยอดรวมรวมภาษี(1000, 0.1)).toBe(1100);
  });

  test("ควรจัดรูปแบบเงินได้ถูกต้อง", () => {
    expect(จัดรูปแบบเงิน(1000)).toBe("฿1,000.00");
    expect(จัดรูปแบบเงิน(2500.50)).toBe("฿2,500.50");
    expect(จัดรูปแบบเงิน(100000)).toBe("฿100,000.00");
  });

  test("ควรสร้างวันที่ไทยได้ถูกต้อง", () => {
    const วันที่ = new Date('2024-01-15');
    const วันที่ไทย = สร้างวันที่ไทย(วันที่);
    expect(วันที่ไทย).toContain("2567"); // ปี พ.ศ.
    expect(วันที่ไทย).toContain("มกราคม");
  });

  test("ควรตรวจสอบรหัสบิลได้ถูกต้อง", () => {
    expect(ตรวจสอบรหัสบิล("INV-001")).toBe(true);
    expect(ตรวจสอบรหัสบิล("INV-100")).toBe(true);
    expect(ตรวจสอบรหัสบิล("INV-999")).toBe(true);
    
    expect(ตรวจสอบรหัสบิล("INV-1")).toBe(false);
    expect(ตรวจสอบรหัสบิล("INV-0001")).toBe(false);
    expect(ตรวจสอบรหัสบิล("INV001")).toBe(false);
    expect(ตรวจสอบรหัสบิล("")).toBe(false);
  });

  test("ควรตรวจสอบรหัสลูกค้าได้ถูกต้อง", () => {
    expect(ตรวจสอบรหัสลูกค้า("C001")).toBe(true);
    expect(ตรวจสอบรหัสลูกค้า("C100")).toBe(true);
    expect(ตรวจสอบรหัสลูกค้า("C999")).toBe(true);
    
    expect(ตรวจสอบรหัสลูกค้า("C1")).toBe(false);
    expect(ตรวจสอบรหัสลูกค้า("C0001")).toBe(false);
    expect(ตรวจสอบรหัสลูกค้า("001")).toBe(false);
    expect(ตรวจสอบรหัสลูกค้า("")).toBe(false);
  });

  test("ควรตรวจสอบรหัสสินค้าได้ถูกต้อง", () => {
    expect(ตรวจสอบรหัสสินค้า("P001")).toBe(true);
    expect(ตรวจสอบรหัสสินค้า("P100")).toBe(true);
    expect(ตรวจสอบรหัสสินค้า("P999")).toBe(true);
    
    expect(ตรวจสอบรหัสสินค้า("P1")).toBe(false);
    expect(ตรวจสอบรหัสสินค้า("P0001")).toBe(false);
    expect(ตรวจสอบรหัสสินค้า("001")).toBe(false);
    expect(ตรวจสอบรหัสสินค้า("")).toBe(false);
  });

  test("ควรทำงานร่วมกันได้", () => {
    // สร้างข้อมูลลูกค้า
    const รหัสลูกค้า = สร้างรหัสลูกค้า(1);
    const อีเมลลูกค้า = "customer@example.com";
    
    expect(ตรวจสอบรหัสลูกค้า(รหัสลูกค้า)).toBe(true);
    expect(ตรวจสอบอีเมล(อีเมลลูกค้า)).toBe(true);
    
    // สร้างข้อมูลสินค้า
    const รหัสสินค้า = สร้างรหัสสินค้า(1);
    const ราคาสินค้า = 1000;
    
    expect(ตรวจสอบรหัสสินค้า(รหัสสินค้า)).toBe(true);
    expect(ราคาสินค้า).toBeGreaterThan(0);
    
    // สร้างบิล
    const รหัสบิล = สร้างรหัสบิล(1);
    const ภาษี = คำนวณภาษีมูลค่าเพิ่ม(ราคาสินค้า);
    const ยอดรวม = คำนวณยอดรวมรวมภาษี(ราคาสินค้า);
    
    expect(ตรวจสอบรหัสบิล(รหัสบิล)).toBe(true);
    expect(ภาษี).toBe(70);
    expect(ยอดรวม).toBe(1070);
    
    // จัดรูปแบบเงิน
    const เงินที่จัดรูปแบบ = จัดรูปแบบเงิน(ยอดรวม);
    expect(เงินที่จัดรูปแบบ).toBe("฿1,070.00");
  });
});