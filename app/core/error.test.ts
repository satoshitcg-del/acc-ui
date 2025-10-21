import { expect, test, describe } from "vitest";
import { handleErrorCode } from "./error";

describe("Error Handling", () => {
  test("returns correct message for success code", () => {
    expect(handleErrorCode(1001)).toBe("Success.");
  });

  test("returns correct message for validation error", () => {
    expect(handleErrorCode(1002)).toBe("System can not validate data. Please try again later.");
  });

  test("returns correct message for system error", () => {
    expect(handleErrorCode(1003)).toBe("System cannot process this request at the moment. Please try again later.");
  });

  test("returns correct message for bad request", () => {
    expect(handleErrorCode(1004)).toBe("Bad request. Please try again later.");
  });

  test("returns correct message for authentication failure", () => {
    expect(handleErrorCode(1005)).toBe("Authentication failed. Please sign in.");
  });

  test("returns correct message for incorrect credentials", () => {
    expect(handleErrorCode(1006)).toBe("The email or password is incorrect. Please try again later.");
  });

  test("returns correct message for invalid captcha", () => {
    expect(handleErrorCode(1007)).toBe("Your captcha is invalid.");
  });

  test("returns correct message for already verified", () => {
    expect(handleErrorCode(1008)).toBe("You have already verified your identity.");
  });

  test("returns correct message for password setting", () => {
    expect(handleErrorCode(1009)).toBe("Please set a new password.");
  });

  test("returns correct message for two factor authentication", () => {
    expect(handleErrorCode(10010)).toBe("Please confirm two factor authentication.");
  });

  test("returns correct message for role not found", () => {
    expect(handleErrorCode(10011)).toBe("Role is not found.");
  });

  test("returns correct message for locked account", () => {
    expect(handleErrorCode(10012)).toBe("Account is locked, Please Contact Admin.");
  });

  test("returns correct message for invalid two factor", () => {
    expect(handleErrorCode(10013)).toBe("Two factor authentication is invalid.");
  });

  test("returns correct message for email not found", () => {
    expect(handleErrorCode(10014)).toBe("Email is not found.");
  });

  test("returns default message for unknown error code", () => {
    expect(handleErrorCode(9999)).toBe("Unknown error code.");
  });

  test("returns default message for negative error code", () => {
    expect(handleErrorCode(-1)).toBe("Unknown error code.");
  });

  test("returns default message for zero error code", () => {
    expect(handleErrorCode(0)).toBe("Unknown error code.");
  });
});