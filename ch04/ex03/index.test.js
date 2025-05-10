import { sub } from "./index.js";

test("sub", () => {
  expect(sub(8, 3)).toBe(5);
  expect(sub(3, 8)).toBe(-5);
  expect(sub(0, 0)).toBe(0);
  expect(sub(-1, -1)).toBe(0);
  expect(sub(-1, 1)).toBe(-2);
});
