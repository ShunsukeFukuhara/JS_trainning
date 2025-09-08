import { createResettableCounter } from "./index.js";
import { jest } from "@jest/globals";

describe("createResettableCounter", () => {
  test("カウンタが正しく動作すること", () => {
    const counter = createResettableCounter();
    expect(counter.next().value).toBe(1);
    expect(counter.next().value).toBe(2);
    expect(counter.next().value).toBe(3);
  });

  test("throw()でリセットできること", () => {
    const counter = createResettableCounter();
    expect(counter.next().value).toBe(1);
    expect(counter.next().value).toBe(2);
    counter.throw(new Error("Reset"));
    expect(counter.next().value).toBe(1);
    expect(counter.next().value).toBe(2);
  });

  test("return()でクリーンアップ関数を実行できること", () => {
    const cleanUpFunc = jest.fn();
    const counter = createResettableCounter(cleanUpFunc);
    expect(counter.next().value).toBe(1);
    expect(counter.next().value).toBe(2);
    expect(counter.return().value).toBe(undefined);
    expect(counter.next().done).toBe(true);
    expect(cleanUpFunc).toHaveBeenCalled();
  });
});
