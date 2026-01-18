## 問題

以下のプログラムの出力を予想し、実際の実行結果を確認しなさい。

```javascript
function f() {
  try {
    return true;
  } finally {
    return false;
  }
}

console.log(f());
```

## 解答

### 予想

falseが出力されると予想した。finallyの実行がtryの後に行われるため、finallyのreturn文が優先されると考えた。

### 実行結果

falseが出力された。
