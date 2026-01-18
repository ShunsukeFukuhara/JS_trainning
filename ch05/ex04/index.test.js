import {
  fibonacciWithWhile,
  fibonacciWithDoWhile,
  fibonacciWithFor,
} from "./index.js";

const answer = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];

describe("fibonacci", () => {
  test("while", () => {
    expect(fibonacciWithWhile()).toEqual(answer);
  });

  test("doWhile", () => {
    expect(fibonacciWithDoWhile()).toEqual(answer);
  });

  test("for", () => {
    expect(fibonacciWithFor()).toEqual(answer);
  });
});
