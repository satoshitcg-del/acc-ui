import { expect, test } from "vitest";
import { handleErrorCode } from "./error";

test('returns the correct message for a known error code', () => {
    // Test cases for known error codes
    expect(handleErrorCode(1001)).toBe('Success.');
    expect(handleErrorCode(1002)).toBe('System can not validate data. Please try again later.');
    // Add more test cases for other known error codes
});

test('returns the default message for an unknown error code', () => {
    // Test case for an unknown error code
    expect(handleErrorCode(9999)).toBe('Unknown error code.');
});