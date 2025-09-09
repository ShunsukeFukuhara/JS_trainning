## 問題

問題 13.1 で非同期処理について学んだあなたは「時間のかかる同期関数があるならば、非同期関数に変換して適宜 await すればいいのではないか」と思いついた。
それでは以下のコードを実行すると何が出力されるか予想し実際に確認しなさい。
また「マイクロタスク」について調査し、この用語を用いて理由を説明しなさい。

```javascript
setTimeout(() => console.log("Hello, world!"), 1000);

async function longA() {
  let count = 0;
  while (true) {
    if (++count % 1000 === 0) {
      console.log("A");
    }
    await Promise.resolve({});
  }
}

async function longB() {
  let count = 0;
  while (true) {
    if (++count % 1000 === 0) {
      console.log("B");
    }
    await Promise.resolve({});
  }
}

longA();
longB();
```

## 回答

このコードを実行すると、"A" と "B" が交互に出力され続け、"Hello, world!" は出力されなかった。
マイクロタスクとは、JavaScriptのイベントループにおけるタスクの一種で、Promiseの解決や非同期関数の完了など、比較的短時間で完了する処理を指す。
具体的に、マイクロタスクに相当するのは、Promiseのコールバック関数(`.then` や `catch`、`finally` に渡される関数)や、`async` 関数内での `await` の後に続くコードなどである。
一方、setTimeoutやsetIntervalのコールバック関数はマクロタスクに相当し、マイクロタスクがすべて完了した後に実行される。
このコード例では、Promise.resolve({}) によって生成されたマイクロタスクが、AとBのループで交互にキューに追加しし続けるため、イベントループは常にマイクロタスクを処理し、マクロタスクであるsetTimeoutのコールバック関数が実行される機会がなくなってしまう。
したがって、"Hello, world!" は出力されない。
