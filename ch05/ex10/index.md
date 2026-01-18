## 問題

書籍では with 文に関して「できるだけ使わないようにしたほうがよい」と記述されているが、with 文は使うべきではない (参考: MDN)。
with 文は最適化が難しくなるだけでなく混乱を招く可能性がある。
このことを理解するために以下の 4 ブロックを実行し、console.log の出力および with 文を使わずに同じ処理を書く場合にどのような文になるかを書きなさい。

## 解答

### ブロック1(with文を使った場合)

```javascript
{
  let a = 1;
  let b = 2;
  let obj = { a: 3, b: 4 };
  with (obj) {
    a = b;
  }
  console.log({ a, b, obj });
}

// 出力結果: { a: 1, b: 2, obj: { a: 4, b: 4 }}
```

### ブロック1(with文を使わない場合)

```javascript
{
  let a = 1;
  let b = 2;
  let obj = { a: 3, b: 4 };
  obj.a = obj.b;
  console.log({ a, b, obj });
}
// 出力結果: { a: 1, b: 2, obj: { a: 4, b: 4 }}
```

### ブロック2(with文を使った場合)

```javascript
{
  let a = 1;
  let b = 2;
  let obj = { b: 4 };
  with (obj) {
    a = b;
  }
  console.log({ a, b, obj });
}
// 出力結果: { a: 4, b: 2, obj: { b: 4 }}
```

### ブロック2(with文を使わない場合)

```javascript
{
  let a = 1;
  let b = 2;
  let obj = { b: 4 };
  a = obj.b;
  console.log({ a, b, obj });
}
// 出力結果: { a: 4, b: 2, obj: { b: 4 }}
```

### ブロック3(with文を使った場合)

```javascript
{
  let a = 1;
  let b = 2;
  let obj = { a: 3 };
  with (obj) {
    a = b;
  }
  console.log({ a, b, obj });
}
// 出力結果: { a: 1, b: 2, obj: { a: 2 }}
```

### ブロック3(with文を使わない場合)

```javascript
{
  let a = 1;
  let b = 2;
  let obj = { a: 3 };
  obj.a = b;
  console.log({ a, b, obj });
}
// 出力結果: { a: 1, b: 2, obj: { a: 2 }}
```

### ブロック4(with文を使った場合)

```javascript
{
  let a = 1;
  let b = 2;
  let obj = {};
  with (obj) {
    a = b;
  }
  console.log({ a, b, obj });
}
// 出力結果: { a: 2, b: 2, obj: {} }
```

### ブロック4(with文を使わない場合)

```javascript
{
  let a = 1;
  let b = 2;
  let obj = {};
  a = b;
  console.log({ a, b, obj });
}
// 出力結果: { a: 2, b: 2, obj: {} }
```
