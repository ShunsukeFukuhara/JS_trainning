## 問題

組み込み関数と自作関数の toString() の出力内容を確認しなさい

## 解答例

- 組み込み関数の toString() の出力内容

```javascript
console.log(Math.max.toString()); // function max() { [native code] }
```

以上のように、組み込み関数の toString() は、関数名とともに `[native code]` という文字列を含む。

- 自作関数の toString() の出力内容

```javascript
function myFunction() {
  return "Hello, World!";
}
console.log(myFunction.toString()); // function myFunction() {  return "Hello, World!";  }
```

以上のように、自作関数の toString() は、関数名とともに関数の本体を文字列として返す。
