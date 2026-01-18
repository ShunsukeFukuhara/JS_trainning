import { push, pop, shift, unshift, sort } from "./index.js";

describe("push", () => {
  it("should add an item to the end of the array", () => {
    const arr = [1, 2, 3];
    const result = push(arr, 4);
    expect(result).toEqual([1, 2, 3, 4]);
    expect(arr).toEqual([1, 2, 3]);
  });
});

describe("pop", () => {
  it("should remove the last item from the array", () => {
    const arr = [1, 2, 3];
    const result = pop(arr);
    expect(result).toEqual([1, 2]);
    expect(arr).toEqual([1, 2, 3]);
  });

  it("should return an empty array if the input array is empty", () => {
    const arr = [];
    const result = pop(arr);
    expect(result).toEqual([]);
  });
});

describe("shift", () => {
  it("should remove the first item from the array", () => {
    const arr = [1, 2, 3];
    const result = shift(arr);
    expect(result).toEqual([2, 3]);
    expect(arr).toEqual([1, 2, 3]);
  });

  it("should return an empty array if the input array is empty", () => {
    const arr = [];
    const result = shift(arr);
    expect(result).toEqual([]);
  });
});

describe("unshift", () => {
  it("should add an item to the beginning of the array", () => {
    const arr = [2, 3];
    const result = unshift(arr, 1);
    expect(result).toEqual([1, 2, 3]);
    expect(arr).toEqual([2, 3]);
  });
});

describe("sort", () => {
  it("should sort the array in ascending order by default", () => {
    const arr = [3, 1, 2];
    const result = sort(arr);
    expect(result).toEqual([1, 2, 3]);
    expect(arr).toEqual([3, 1, 2]);
  });

  it("should sort the array using a custom compare function", () => {
    const arr = [3, 1, 2];
    const result = sort(arr, (a, b) => b - a);
    expect(result).toEqual([3, 2, 1]);
    expect(arr).toEqual([3, 1, 2]);
  });
});
