export function validateDiscountNumber(value: any, discountType: number): number {
  console.log(value);
  const maxPercentage: number = 100;
  const minPercentage: number = 0;
  let valueNumber: any;
  const regex = /^[0-9\b]+$/;

  if (discountType == 2) {
    if (value <= maxPercentage) {
      if (value === "" || regex.test(value)) {
        valueNumber = value;
      }
    } else if (value == minPercentage) {
      valueNumber = minPercentage;
    } else if (value > maxPercentage) {
      valueNumber = maxPercentage;
    }
  } else if (value === "" || regex.test(value)) {
    valueNumber = value;
  }
  return valueNumber;
}
