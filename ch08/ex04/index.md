## 問題

以下の入れ子の関数とアロー関数のコード実行結果を予想してから実行し、結果を説明しなさい。

```javascript
const obj = {
  om: function () {
    const nest = {
      nm: function () {
        console.log(this === obj, this === nest);
      },
      arrow: () => {
        console.log(this === obj, this === nest);
      },
    };
    nest.nm();
    nest.arrow();
  },
};
obj.om();
```

## 予想

nm -> `true false`
arrow -> `false true`

## 実行結果

nm -> `false true`
arrow -> `true false`

## 理由

`nm` メソッドは通常の関数として定義されているため、`this` は呼び出し元のオブジェクト `nest` を指す。
`arrow` メソッドはアロー関数として定義されているため、`this` は定義されたスコープの `this` を参照し、ここでは `obj` を指す。
