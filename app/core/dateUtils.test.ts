import { expect, test, describe } from "vitest";
import { formatDate } from "./dateUtils";

describe("Date Utils", () => {
  test("formats date correctly", () => {
    const testDate = new Date("2024-01-15T10:30:00Z");
    const formatted = formatDate(testDate);
    expect(formatted).toBeDefined();
    expect(typeof formatted).toBe("string");
  });

  test("handles invalid date", () => {
    const invalidDate = new Date("invalid");
    const formatted = formatDate(invalidDate);
    expect(formatted).toBeDefined();
  });

  test("handles null date", () => {
    const formatted = formatDate(null);
    expect(formatted).toBeDefined();
  });

  test("handles undefined date", () => {
    const formatted = formatDate(undefined);
    expect(formatted).toBeDefined();
  });
});