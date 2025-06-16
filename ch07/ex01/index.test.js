import { add, multiply } from "./index.js";

describe("add", () => {
  it("should throw an error for non-2D arrays", () => {
    expect(() => add([1, 2], [[3, 4]])).toThrow();
  });

  it("should throw an error for matrices with different dimensions", () => {
    const a = [
      [1, 2],
      [3, 4],
    ];
    const b = [[5, 6]];
    expect(() => add(a, b)).toThrow();
  });

  it("should add two matrices of the same dimensions", () => {
    const a = [
      [1, 2],
      [3, 4],
    ];
    const b = [
      [5, 6],
      [7, 8],
    ];
    const result = add(a, b);
    expect(result).toEqual([
      [6, 8],
      [10, 12],
    ]);
  });

  it("should add two empty matrices", () => {
    const a = [[], []];
    const b = [[], []];
    const result = add(a, b);
    expect(result).toEqual([[], []]);
  });
});

describe("multiply", () => {
  it("should throw an error for non-2D arrays", () => {
    expect(() => multiply([1, 2], [[3, 4]])).toThrow();
  });

  it("should throw an error for incompatible matrices", () => {
    const a = [
      [1, 2],
      [3, 4],
    ];
    const b = [[5, 6]];
    expect(() => multiply(a, b)).toThrow();
  });

  it("should multiply two compatible matrices", () => {
    const a = [
      [1, 2],
      [3, 4],
    ];
    const b = [
      [5, 6],
      [7, 8],
    ];
    const result = multiply(a, b);
    expect(result).toEqual([
      [19, 22],
      [43, 50],
    ]);
  });

  it("should multiply a matrix by empty matrix", () => {
    const a = [
      [1, 2],
      [3, 4],
    ];
    const empty = [[], []];
    const result = multiply(a, empty);
    expect(result).toEqual([[], []]);
  });

  it("should multiply a matrix by an identity matrix", () => {
    const a = [
      [1, 2],
      [3, 4],
    ];
    const identity = [
      [1, 0],
      [0, 1],
    ];
    const result = multiply(a, identity);
    expect(result).toEqual(a);
  });
});
