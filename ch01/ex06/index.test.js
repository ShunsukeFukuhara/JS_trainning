import { fib } from "./index.js";

// TypeScript の場合は以下:
// import { abs, sum, factorial } from "./index.ts";

describe("math", () => {
  describe("fib", () => {
    it("n = 1", () => {
      expect(fib(1)).toBe(1);
    });

    it("n = 2", () => {
      expect(fib(2)).toBe(1);
    });

    // 数学的帰納法っぽく
    const n = 10;
    it(`n=3からn=${n}まで検証`, () => {
      let nMinus1 = 1;
      let nMinus2 = 1;

      for (let i = 3; i <= n; i++) {
        const result = fib(i);
        expect(result).toBe(nMinus1 + nMinus2);
        nMinus2 = nMinus1;
        nMinus1 = result;
      }
    });

    it("n = 0", () => {
      expect(() => fib(0)).toThrow();
    });

    it("n < 0", () => {
      expect(() => fib(-1)).toThrow();
    });

    it("n = 1.5", () => {
      expect(() => fib(1.5)).toThrow();
    });

    it("n = 5", () => {
      expect(fib(5)).toBe(5);
    });
  });
});
