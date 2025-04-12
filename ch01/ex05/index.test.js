import { abs, sum, factorial } from "./index.js";

// TypeScript の場合は以下:
// import { abs, sum, factorial } from "./index.ts";

describe("math", () => {
  describe("abs", () => {
    it("returns same value when positive value given", () => {
      expect(abs(42)).toBe(42);
    });

    it("returns negated value when negative value given", () => {
      expect(abs(-42)).toBe(42);
    });

    it("returns zero value when zero given", () => {
      expect(abs(0)).toBe(0);
    });
  });

  // 以下に sum, factorial のテストを記載せよ
  describe("sum", () => {
    it("a > 0, b > 0", () => {
      expect(sum(1, 2)).toBe(3);
    });

    it("a < 0, b < 0", () => {
      expect(sum(-1, -2)).toBe(-3);
    });

    it("a > 0, b < 0", () => {
      expect(sum(1, -2)).toBe(-1);
    });

    it("a < 0, b > 0", () => {
      expect(sum(-1, 2)).toBe(1);
    });

    it("a = 0, b = 0", () => {
      expect(sum(0, 0)).toBe(0);
    });
  });

  describe("factorial", () => {
    it("n > 0", () => {
      expect(factorial(5)).toBe(120);
    });

    it("n = 0", () => {
      expect(factorial(0)).toBe(1);
    });

    it("n < 0", () => {
      expect(() => factorial(-1)).toThrow();
    });

    it("n = 1.5", () => {
      expect(() => factorial(1.5)).toThrow();
    });
  });
});
