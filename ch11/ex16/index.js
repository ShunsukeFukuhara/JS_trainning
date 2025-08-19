// 以下の仕様を持つ、 retryWithExponentialBackof 関数を実装しなさい

export const retryWithExponentialBackoff = (func, maxRetry, callback) => {
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

  // 再試行用の関数。失敗したらtimeoutを設定して自身を再度呼び出す
  const tryFunc = () => {
    attempts++;

    // retryWithExponentialBackoffに対する呼び出しは即座に完了し、func の呼び出しは非同期に行われる
    const result = func();

    // 受け取った関数 func を呼び出し、func が true を返せばそこで終了する
    // maxRetry 回リトライしても成功しない場合はそこで終了する
    if (result || attempts >= maxRetry) {
      // func が true を返す、または maxRetry 回のリトライが失敗し終了する際、その結果(true/false)を引数として関数 callback が呼び出される
      callback(result);
      return;
    }

    // func が false を返した場合は以下の待ち時間後に func 呼び出しをリトライする
    // 待ち時間はfuncの呼び出し回数に応じて 1 秒, 2 秒, 4 秒, ...と 2 倍に増えていく
    const waitTime = Math.pow(2, attempts - 1) * 1000; // 1秒, 2秒, 4秒..
    setTimeout(tryFunc, waitTime); // 指定した時間後に再試行
  };

  tryFunc(); // 初回の呼び出し
};
