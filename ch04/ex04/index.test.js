import { bitCount } from "./index.js";

test("bitCount", () => {
  expect(bitCount(0b111)).toBe(3);
  expect(bitCount(0b1111111111111111111111111111111)).toBe(31);
});
