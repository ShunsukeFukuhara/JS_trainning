import { repeatChar, square, currentTime } from "./index.js";
import { jest } from "@jest/globals";

describe("repeatChar", () => {
  it("aを3回読んで返す", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});

    expect(repeatChar(3, "a")).toEqual(["a", "a", "a"]);

    expect(spy).toHaveBeenCalledTimes(3); // 呼ばれた回数を確認
    expect(spy).toHaveBeenNthCalledWith(1, "a"); // 1回目
    expect(spy).toHaveBeenNthCalledWith(2, "a"); // 2回目
    expect(spy).toHaveBeenNthCalledWith(3, "a"); // 3回目
    spy.mockRestore();
  });

  it("大文字でも正常に動作する", () => {
    expect(repeatChar(5, "A")).toEqual(["A", "A", "A", "A", "A"]);
  });

  it("数字でも正常に動作する", () => {
    expect(repeatChar(2, "1")).toEqual(["1", "1"]);
  });

  it("引数nが自然数でない場合はエラー", () => {
    expect(() => repeatChar(-1, "a")).toThrow();
    expect(() => repeatChar(1.5, "a")).toThrow();
    expect(() => repeatChar(0, "a")).toThrow();
    expect(() => repeatChar("a", "a")).toThrow();
    expect(() => repeatChar([], "a")).toThrow();
    expect(() => repeatChar({}, "a")).toThrow();
    expect(() => repeatChar(null, "a")).toThrow();
    expect(() => repeatChar(undefined, "a")).toThrow();
  });

  it("引数cが英数文字でない場合はエラー", () => {
    expect(() => repeatChar(3, "ab")).toThrow();
    expect(() => repeatChar(3, "!")).toThrow();
    expect(() => repeatChar(3, "")).toThrow();
    expect(() => repeatChar(3, 1)).toThrow();
    expect(() => repeatChar(3, null)).toThrow();
    expect(() => repeatChar(3, undefined)).toThrow();
  });

  describe("square", () => {
    it("2の二乗は4", () => {
      expect(square(2)).toBe(4);
    });

    it("3の二乗は9", () => {
      expect(square(3)).toBe(9);
    });

    it("引数xが数値でない場合はエラー", () => {
      expect(() => square("a")).toThrow();
      expect(() => square([])).toThrow();
      expect(() => square({})).toThrow();
      expect(() => square(null)).toThrow();
      expect(() => square(undefined)).toThrow();
    });
  });

  describe("currentTime", () => {
    it("現在時刻のオブジェクトを返す", () => {
      const result = currentTime();
      expect(result).toHaveProperty("now");
      expect(result.now).toBeInstanceOf(Date);
      expect(result.now.getTime()).toBeLessThanOrEqual(Date.now());
      expect(result.now.getTime()).toBeGreaterThanOrEqual(Date.now() - 100); // 0.1秒以内の時刻
    });
  });
});
