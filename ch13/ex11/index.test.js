import { retryWithExponentialBackoff } from "./index.js";
import { expect, jest } from "@jest/globals";

jest.useFakeTimers();

describe("retryWithExponentialBackoff", () => {
  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });

  test("func が1回で成功する場合", async () => {
    const func = jest.fn().mockResolvedValue(66);
    const callback = jest.fn();

    const promise = retryWithExponentialBackoff(func, 3, callback);

    await expect(promise).resolves.toBe(66);
    expect(func).toHaveBeenCalledTimes(1);
    expect(callback).not.toHaveBeenCalled();
  });

  test("func が失敗しても再試行で成功する場合", async () => {
    const func = jest
      .fn()
      .mockRejectedValueOnce(new Error())
      .mockResolvedValueOnce(100);
    const callback = jest.fn();

    const promise = retryWithExponentialBackoff(func, 3, callback);

    // タイマーを進める
    await jest.runAllTimersAsync();

    await expect(promise).resolves.toBe(100);
    expect(func).toHaveBeenCalledTimes(2);
    expect(callback).not.toHaveBeenCalled();
  });

  test("func が最大リトライ回数を超えて失敗する場合", async () => {
    // fakeTimerを使うとなぜかタイムアウトするので、realTimerに切り替えた
    jest.useRealTimers();

    const func = jest.fn(() => Promise.reject(new Error()));
    const callback = jest.fn();

    const promise = retryWithExponentialBackoff(func, 2, callback);

    await expect(promise).rejects.toThrow();

    expect(func).toHaveBeenCalledTimes(3); // 初回 + 2 retry
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(expect.any(Error));
  }, 10000);

  test("入力 validation: func が関数でない場合", async () => {
    await expect(
      retryWithExponentialBackoff(null, 2, () => {})
    ).rejects.toThrow("funcは関数でなければなりません");
  });

  test("入力 validation: maxRetry が正の整数でない場合", async () => {
    await expect(
      retryWithExponentialBackoff(
        () => {},
        0,
        () => {}
      )
    ).rejects.toThrow("maxRetryは正の整数でなければなりません");
  });

  test("入力 validation: callback が関数でない場合", async () => {
    await expect(
      retryWithExponentialBackoff(() => {}, 2, null)
    ).rejects.toThrow("callbackは関数でなければなりません");
  });
});
