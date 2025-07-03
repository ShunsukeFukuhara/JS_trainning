// 以下の関数を繰り返し (for, while) や条件分岐 (if) を利用せず map, filter, reduce, forEach 等のメソッドを利用して書き直しなさい。
const fizzbuzz = (n) =>
  Array.from({ length: n }, (_, i) => i + 1).map((i) =>
    console.log((i % 3 ? "" : "Fizz") + (i % 5 ? "" : "Buzz") || i)
  );

const sumOfSquaredDifference = (f, g) =>
  f.reduce((acc, value, i) => acc + (value - g[i]) ** 2, 0);

const sumOfEvensIsLargerThan42 = (array) =>
  array
    .filter((value) => value % 2 === 0)
    .reduce((acc, value) => acc + value, 0) >= 42;

fizzbuzz(20);
console.log(sumOfSquaredDifference([1, 2, 3], [4, 5, 6]));
console.log(sumOfEvensIsLargerThan42([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
