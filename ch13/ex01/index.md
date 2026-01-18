### 問題

以下のコードを実行すると何が出力されるか予想し実際に確認しなさい。
また「タスク」について調査し、この用語を用いて理由を説明しなさい。

```javascript
setTimeout(() => console.log("Hello, world!"), 1000);

function longRunningFunction() {
  while (true) {
    // NOTE: while (true) {} は極端な例であり、現実で見ることは少ないかもしれません。
    // しかし、時間のかかる同期処理を実行して同様の問題が発生することは実際にあります。
  }
}

longRunningFunction();
```

### 回答

予想: 1秒後に "Hello, world!" と出力される。
実際: 何も出力されない。

理由:
タスクとは、JavaScriptのイベントループにおける、同期処理後に実行される非同期処理の単位。
上記のコードでは、`setTimeout` によって "Hello, world!" を出力するタスクが1秒後にキューに追加される。
しかし、`longRunningFunction` が無限ループで同期処理を占有しているため、次に実行されるイベントループがタスクキューを処理できず、"Hello, world!" が出力されない。
