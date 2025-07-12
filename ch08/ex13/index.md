## 問題

以下のコードが Web サービスの一部で使われており、引数の input には Web サービスの利用者が入力した文字列が渡されるものとする。

```javascript
function f(input) {
  const f = new Function(`return "Hello, " + ${input}`);
  console.log(f());
}
```

このコードには重大な問題が含まれている。何が問題と考えられるか記述しなさい。
また問題を実証できるコードも記載しなさい。

## 回答

このコードには、ユーザーが入力した文字列を直接 `Function` コンストラクタに渡しているため、文字列を操作して任意の JavaScript コードを実行できる脆弱性が存在する。

```javascript
// このコードのlengthを増やし、consoleの代わりに特定の処理を入れて負荷を掛けたり、特定のAPIやサイトにDos攻撃を行わせたりすることが可能
f(`Array.from({ length: 100 }, (_, i) => i).forEach(i => console.log(i))`);
```
