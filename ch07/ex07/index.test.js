import { bubbleSort, mergeSort, quickSort } from "./index.js";

const testData = [
  [3, 1, 2],
  [5, 4, 3, 2, 1],
  [10, 9, 8, 7, 6],
  [1, 2, 3, 4, 5],
  [],
  [1],
  [2, 2, 2],
  [1, 3, 2, 3, 1],
  [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, 0],
  [-3, -1, -2],
  [0, -1, 1],
];

it("bubbleSort", () => {
  testData.forEach((data) => {
    const result = bubbleSort(data);
    expect(result).toEqual(data.slice().sort((a, b) => a - b));
  });
});

it("mergeSort", () => {
  testData.forEach((data) => {
    const result = mergeSort(data);
    expect(result).toEqual(data.slice().sort((a, b) => a - b));
  });
});

it("quickSort", () => {
  testData.forEach((data) => {
    const result = quickSort(data);
    expect(result).toEqual(data.slice().sort((a, b) => a - b));
  });
});
