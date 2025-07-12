import { PositiveNumber } from "./index.js";

describe("PositiveNumber", () => {
  it("getXが正しい値を返す", () => {
    const pn = new PositiveNumber(10);
    expect(pn.getX()).toBe(10);
  });

  it("setXが正しい値を設定できる", () => {
    const pn = new PositiveNumber(10);
    pn.setX(20);
    expect(pn.getX()).toBe(20);
  });

  it("setXが0以下の値を設定しようとするとエラーを投げる", () => {
    const pn = new PositiveNumber(10);
    expect(() => pn.setX(0)).toThrow("require : x > 0");
    expect(() => pn.setX(-5)).toThrow("require : x > 0");
  });

  it("コンストラクタで0以下の値を設定しようとするとエラーを投げる", () => {
    expect(() => new PositiveNumber(0)).toThrow("require : x > 0");
    expect(() => new PositiveNumber(-5)).toThrow("require : x > 0");
  });

  it("外部から直接を更新できない", () => {
    const pn = new PositiveNumber(10);
    pn.x = 5; // 直接アクセスして値を変更しようとする
    expect(pn.getX()).toBe(10); // 変更されていないことを確認
  });
});
