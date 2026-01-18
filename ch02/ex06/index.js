export const fizzbuzz = () =>
  [...Array(100)]
    .map((_, i) =>
      (i + 1) % 3 === 0 && (i + 1) % 5 === 0
        ? "FizzBuzz"
        : (i + 1) % 3 === 0
        ? "Fizz"
        : (i + 1) % 5 === 0
        ? "Buzz"
        : i + 1
    )
    .join("\n") + "\n";
