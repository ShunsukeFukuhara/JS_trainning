export const fib = (n) => {
  if (n <= 0 || !Number.isInteger(n)) {
    throw new Error("Fibonacci is not defined for negative numbers");
  }

  if (n === 1) {
    return 1;
  }

  if (n === 2) {
    return 1;
  }

  return fib(n - 1) + fib(n - 2);
};
