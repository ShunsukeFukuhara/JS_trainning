## 問題

以下のプログラムの出力を予想し、実際の実行結果を確認しなさい。

```javascript
let x = 0;

for (let i = 1; i <= 5; i++) {
  x = i;
  try {
    throw Error();
  } catch {
    break;
  } finally {
    continue;
  }
}

console.log(x);
```

## 解答

### 予想

5が出力されると予想した。このケースでもfinallyの実行がcatchの後に行われるため、finallyのcontinue文が優先されると考えた。

### 実行結果

5が出力された。
