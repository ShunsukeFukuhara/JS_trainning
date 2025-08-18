### 問題

performance.now を使ってプログラムの処理時間を測定してみよう。
ch11/ex11/index.js は "Hello".length にどれだけの時間がかかるか測定しようと実装したコードである。

```javascript
// N 回何もしないループの時間を返す
function costOfLoop(N) {
  const start = performance.now();
  for (let i = 0; i < N; i++) {
    /* empty */
  }
  const end = performance.now();
  return end - start;
}

// N 回 "Hello".length を実行 + N 回何もしないループの時間を返す
function costOfLengthPlusLoop(N) {
  const str = "Hello";
  let res = 0;
  const start = performance.now();
  for (let i = 0; i < N; i++) {
    res = str.length;
  }
  const end = performance.now();

  if (res !== 5) {
    throw new Error("something is wrong");
  }
  return end - start;
}

// "Hello".length 1回あたりの時間を返す
function costOfLength(N) {
  const lhs = costOfLengthPlusLoop(N);
  const rhs = costOfLoop(N);
  return (lhs - rhs) / N;
}
```

コードを実行すると以下の事実に気付くだろう:

costOfLength が負の値を返すことがある ("Hello".length を実行すると時が巻き戻るのだろうか?)
costOfLength の引数の値を大きくすれば大きくする程結果が小さくなる ("Hello".length を実行すればする程速くなるのだろうか?)

どうやら何かがおかしい。どうしてこのような結果になるか調べて説明しなさい。

### 回答

performance.now() は高精度なタイマーであるが、JavaScript の実行環境によっては、非常に短い時間の測定が不正確になることがある。特に、処理時間が非常に短い場合、タイマーの分解能やオーバーヘッドの影響で、測定結果が負の値を返すことがある。
また、JavaScript の実行環境は、最適化を行うために、同じコードを何度も実行する際にキャッシュや最適化を行うことがある。そのため、処理時間が短い場合、最初の実行と後の実行で結果が異なることがある。
