import { sequenceToObject } from "./index.js";

describe("sequenceToObject", () => {
  it("正しいオブジェクトを返す", () => {
    expect(sequenceToObject("a", 1, "b", 2)).toEqual({ a: 1, b: 2 });
    expect(sequenceToObject("x", 10, "y", 20, "z", 30)).toEqual({
      x: 10,
      y: 20,
      z: 30,
    });
  });

  it("奇数番の値が string でない場合に例外を発生させる", () => {
    expect(() => sequenceToObject(1, "a")).toThrow();
    expect(() => sequenceToObject("a", 1, 2, "b")).toThrow();
  });

  it("値の個数が偶数でない場合に例外を発生させる", () => {
    expect(() => sequenceToObject("a")).toThrow();
    expect(() => sequenceToObject("a", 1, "b")).toThrow();
  });

  it("スプレッド演算子で配列を与えられることを確認する", () => {
    expect(sequenceToObject(...["a", 1, "b", 2])).toEqual({ a: 1, b: 2 });
    expect(sequenceToObject(...["x", 10, "y", 20, "z", 30])).toEqual({
      x: 10,
      y: 20,
      z: 30,
    });
  });
});
