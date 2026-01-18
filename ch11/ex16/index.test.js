import { retryWithExponentialBackoff } from "./index.js";
import { jest } from "@jest/globals";

describe("retryWithExponentialBackoff", () => {
  jest.useFakeTimers();

  it("funcが関数でない場合はエラー", () => {
    expect(() =>
      retryWithExponentialBackoff("not a function", 3, () => {})
    ).toThrow();
    expect(() => retryWithExponentialBackoff(123, 3, () => {})).toThrow();
    expect(() => retryWithExponentialBackoff([], 3, () => {})).toThrow();
    expect(() => retryWithExponentialBackoff({}, 3, () => {})).toThrow();
  });

  it("maxRetryが自然数でない場合はエラー", () => {
    expect(() =>
      retryWithExponentialBackoff(
        () => true,
        -1,
        () => {}
      )
    ).toThrow();
    expect(() =>
      retryWithExponentialBackoff(
        () => true,
        0,
        () => {}
      )
    ).toThrow();
    expect(() =>
      retryWithExponentialBackoff(
        () => true,
        1.5,
        () => {}
      )
    ).toThrow();
    expect(() =>
      retryWithExponentialBackoff(
        () => true,
        "3",
        () => {}
      )
    ).toThrow();
  });

  it("callbackが関数でない場合はエラー", () => {
    expect(() =>
      retryWithExponentialBackoff(() => true, 3, "not a function")
    ).toThrow();
    expect(() => retryWithExponentialBackoff(() => true, 3, 123)).toThrow();
    expect(() => retryWithExponentialBackoff(() => true, 3, [])).toThrow();
    expect(() => retryWithExponentialBackoff(() => true, 3, {})).toThrow();
  });

  it("funcが最初にtrueを返す場合、callbackは即座に呼ばれる", () => {
    const func = jest.fn(() => true);
    const callback = jest.fn();

    retryWithExponentialBackoff(func, 5, callback);

    // タイマーは進めずに即座に呼ばれる
    expect(func).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(true);
  });

  it("funcが毎回falseを返す場合、maxRetry回だけ呼ばれ、最後にfalseでcallbackが呼ばれる", () => {
    const func = jest.fn(() => false);
    const callback = jest.fn();

    retryWithExponentialBackoff(func, 3, callback);

    // タイマーを順に進めていく
    expect(func).toHaveBeenCalledTimes(1); // 初回
    expect(callback).not.toHaveBeenCalled();

    // 1回目の待機（1秒）
    jest.advanceTimersByTime(1000);
    expect(func).toHaveBeenCalledTimes(2);
    expect(callback).not.toHaveBeenCalled();

    // 2回目の待機（2秒）
    jest.advanceTimersByTime(2000);
    expect(func).toHaveBeenCalledTimes(3);

    // 3回目はもう待たずにcallback
    jest.advanceTimersByTime(4000); // 実際はこれで呼ばれる
    expect(callback).toHaveBeenCalledWith(false);
    expect(func).toHaveBeenCalledTimes(3);
  });

  it("funcが途中でtrueを返す場合、そこでcallbackが呼ばれる", () => {
    let count = 0;
    const func = jest.fn(() => {
      count++;
      return count === 2;
    });
    const callback = jest.fn();

    retryWithExponentialBackoff(func, 5, callback);

    // 初回呼び出しはfalse
    expect(func).toHaveBeenCalledTimes(1);
    expect(callback).not.toHaveBeenCalled();

    // 1回目の再試行（1秒）
    jest.advanceTimersByTime(1000);
    expect(func).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith(true);

    // それ以上は呼ばれない
    jest.advanceTimersByTime(10000);
    expect(func).toHaveBeenCalledTimes(2);
  });
});
