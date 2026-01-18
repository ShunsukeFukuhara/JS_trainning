//オブジェクトを 1 つ引数に取り、何らかの時間のかかる計算を行い、与えられた引数に対して一意な結果を返す関数slowFnを考える。
// slowFnの計算結果をキャッシュし、同じ引数で繰り返し呼び出された時にはキャッシュを返す関数cachedSlowFnを生成する関数cacheを実装しなさい。
// ただしslowFnの引数のオブジェクトが到達不能になった場合には、キャッシュがガベージコレクションの対象になるように実装しなさい。またslowFnは任意の実装で良い。

// f はオブジェクトを1つ引数に取る関数
export function cache(f) {
  // キャッシュを保持するWeakMap
  // WeakMapを使用することで、オブジェクトが到達不能になった場合に自動的にガベージコレクションされる
  const cacheMap = new WeakMap();

  // キャッシュされた関数を返す
  return function (obj) {
    // objがWeakMapに存在する場合、キャッシュから結果を取得
    if (cacheMap.has(obj)) {
      return cacheMap.get(obj);
    }

    // objがWeakMapに存在しない場合、slowFnを呼び出して結果を計算
    const result = f(obj);

    // 結果をWeakMapに保存
    cacheMap.set(obj, result);

    return result;
  };
}

export function slowFn(obj) {
  const start = Date.now();
  while (Date.now() - start < 1000) {
    // 時間待ち
  }

  // 単純にオブジェクトの文字列表現を返す
  return JSON.stringify(obj);
}
