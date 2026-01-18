import { fibonacciSequenceIter } from "./index.js";

describe("fibonacciSequenceIter", () => {
  test("最初の10個のフィボナッチ数列を生成する", () => {
    const fibIter = fibonacciSequenceIter();
    const result = [];
    for (let i = 0; i < 10; i++) {
      result.push(fibIter.next().value);
    }
    expect(result).toEqual([1, 1, 2, 3, 5, 8, 13, 21, 34, 55]);
  });
});
