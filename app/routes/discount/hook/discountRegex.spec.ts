import { expect, it, test } from "vitest";
import { validateDiscountNumber } from "./useMediumFunctionDiscount";

it('should update search with valid input when discountType is 2', () => {
    const input = 50
    const discountType = 2
    // expect(input).toEqual(50);
    expect(validateDiscountNumber(input, discountType)).toEqual(50);
});

test('should update search with valid input when discountType is 2 and less than equal 100', () => {
  const input = 200
    const discountType = 2
    expect(validateDiscountNumber(input, discountType)).toEqual(100);
});

test('should update search with valid input when discountType is 2 and value is type string', () => {
    const input = "g"
    const discountType = 2
    expect(validateDiscountNumber(input, discountType)).toEqual(undefined);
});

test('should update search with valid input when discountType is not 2', () => {
    const input = 5
    const discountType = 1
    expect(validateDiscountNumber(input, discountType)).toEqual(5);
});

test('should update search with valid input when discountType is not 2 and value is type string', () => {
    const input = "k2sfsdfsdf"
    const discountType = 1
    expect(validateDiscountNumber(input, discountType)).toEqual(undefined);
});