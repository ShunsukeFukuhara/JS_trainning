export const abs = (n) => (n < 0 ? -n : n);

export const sum = (a, b) => a + b;

export const factorial = (n) => {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error("Factorial is not defined for negative numbers");
  }

  if (n === 0) {
    return 1;
  }

  return n * factorial(n - 1);
};
