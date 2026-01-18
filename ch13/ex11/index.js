// 11 章の演習問題で作成した retryWithExponentialBackoff に対して Promise を返すように実装を変更しなさい。
// 引数の func は Promise を返す関数とし、func の返り値が成功した場合は retryWithExponentialBackoff の返り値をその値で解決しなさい。
// また func の返り値が失敗した場合は一定時間後にリトライしなさい。一定回数以上 func が失敗した場合は retryWithExponentialBackoff の返り値を失敗させなさい。

// 作成した関数を使えば以下のようなコードで HTTP リクエストのリトライを行える:

export const retryWithExponentialBackoff = async (func, maxRetry, callback) => {
  if (typeof func !== "function") {
    throw new Error("funcは関数でなければなりません");
  }

  if (!Number.isInteger(maxRetry) || maxRetry <= 0) {
    throw new Error("maxRetryは正の整数でなければなりません");
  }

  if (typeof callback !== "function") {
    throw new Error("callbackは関数でなければなりません");
  }

  // 試行回数
  let attempts = 0;

  const tryFunc = async () => {
    try {
      const result = await func();
      return result;
    } catch (error) {
      attempts++;

      // 最大試行回数を超えた場合はエラーをスロー
      if (attempts > maxRetry) {
        callback(error);
        throw error;
      }

      // 指数関数的バックオフのための遅延時間を計算
      const delay = Math.pow(2, attempts - 1) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      // 再試行
      return tryFunc();
    }
  };

  return tryFunc();
};
