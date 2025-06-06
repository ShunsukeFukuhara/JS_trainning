## 問題

古い JavaScript のコードでは undefined と比較を行う際に:

```javascript
if (foo === undefined) { ... }
```

ではなく以下のように書かれたコードを見ることがある (注: void 0 は undefined を返す)。

```javascript
if (foo === void 0) { ... }
```

これにはどのような理由があるか、また今ではこのような書き方をしないのは何故か調べて回答しなさい。

## 回答

このような書き方をする理由は、`undefined` がグローバル変数として定義されており、別のモジュールで値が上書きされていた可能性があったからである。
そのため、`void 0` を使用することで、常に `undefined` を返すことが保証される。

ただし、現在の JavaScript では `undefined` は変更できないためこの書き方は不要であり、`undefined` を直接使用することが一般的である。
