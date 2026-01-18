import { recursivePower } from "./index.js";

describe("recursivePower", () => {
  it("正しいべき乗を計算する", () => {
    expect(recursivePower(2, 3)).toBe(8);
    expect(recursivePower(3, 2)).toBe(9);
    expect(recursivePower(5, 0)).toBe(1);
    expect(recursivePower(10, 1)).toBe(10);
  });

  it("base と exponent の型チェック", () => {
    expect(() => recursivePower("2", 3)).toThrow();
    expect(() => recursivePower(2, "3")).toThrow();
  });

  it("exponent の値チェック", () => {
    expect(() => recursivePower(2, -1)).toThrow();
    expect(() => recursivePower(2, 1.5)).toThrow();
  });

  it("大きなべき乗の計算", () => {
    expect(recursivePower(2, 10)).toBe(1024);
    expect(recursivePower(3, 5)).toBe(243);
  });
  it("base が 0 の場合", () => {
    expect(recursivePower(0, 5)).toBe(0);
    expect(recursivePower(0, 0)).toBe(1); // 0^0 は数学的に定義されることが多い
  });
});
