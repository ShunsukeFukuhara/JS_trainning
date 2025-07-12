import { any, catching } from "./index.js";

describe("any", () => {
  it("どれかの関数が true を返すなら、true を返す", () => {
    const returnTrue = () => true;
    const returnFalse = () => false;
    const returnFlase2 = () => false;
    const check = any(returnTrue, returnFalse, returnFlase2);

    expect(check()).toBe(true);
  });

  it("すべての関数が false を返すなら、false を返す", () => {
    const returnFalse = () => false;
    const returnFalse2 = () => false;
    const returnFalse3 = () => false;

    const check = any(returnFalse, returnFalse2, returnFalse3);
    expect(check()).toBe(false);
  });

  it("引数がない場合、常に false を返す", () => {
    const check = any();
    expect(check(1)).toBe(false);
    expect(check(2)).toBe(false);
  });

  it("引数が関数でない場合、エラーを投げる", () => {
    expect((() => any(1, "string"))(1)).toThrow(TypeError);
    expect((() => any(1, () => true))(1)).toThrow(TypeError);
  });
});

describe("catching", () => {
  it("例外をキャッチし、ハンドラー関数に渡す", () => {
    const throwError = () => {
      throw new Error("Test error");
    };
    const handler = (error) => `Caught: ${error.message}`;

    const safeFunction = catching(throwError, handler);
    expect(safeFunction()).toBe("Caught: Test error");
  });

  it("例外が発生しない場合、元の関数の結果を返す", () => {
    const add = (a, b) => a + b;
    const safeAdd = catching(add, (error) => `Error: ${error.message}`);

    expect(safeAdd(1, 2)).toBe(3);
  });

  it("ハンドラーが例外を投げる場合、再度例外を投げる", () => {
    const throwError = () => {
      throw new Error("Test error");
    };
    const handler = () => {
      throw new Error();
    };

    const safeFunction = catching(throwError, handler);
    expect(() => safeFunction()).toThrow();
  });
});
