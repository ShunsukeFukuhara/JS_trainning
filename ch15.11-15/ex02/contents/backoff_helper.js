/**
 * カスタムのタイムアウトエラークラス
 */
export class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = "TimeoutError";
  }
}

/**
 *
 * @param {function} func - Promiseを返す関数
 * @param {number} timeout - タイムアウト時間(ミリ秒)。リトライはこの時間内で行う
 * @returns {Promise} - funcの返り値を解決するPromise
 * @throws {TimeoutError} - 処理が待ちになったりエラーが続いてタイムアウトした場合
 * @throws {Error} - 引数の型が不正な場合。
 */
export const withBackoffAndTimeout = async (func, timeout) => {
  if (typeof func !== "function") {
    throw new Error("funcは関数でなければなりません");
  }

  if (!Number.isInteger(timeout) || timeout <= 0) {
    throw new Error("maxRetryは正の整数でなければなりません");
  }

  // 試行回数
  let attempts = 0;

  const tryFunc = async () => {
    try {
      return await func();
    } catch (error) {
      attempts++;

      // 指数関数的バックオフのための遅延時間を計算
      // 500ms 基準に変更
      const delay = Math.pow(2, attempts - 1) * 500;
      await new Promise((resolve) => setTimeout(resolve, delay));

      // 再試行
      return await tryFunc();
    }
  };

  // Promise.raceを使って、タイムアウト処理を追加
  return await Promise.race([
    tryFunc(),
    new Promise((_, reject) =>
      setTimeout(() => {
        const error = new TimeoutError("Operation timed out");
        reject(error);
      }, timeout)
    ),
  ]);
};
