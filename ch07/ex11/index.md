## 問題

7.10 で作成した動的配列の push の平均時間計算量を説明しなさい。またその結果を用いて以下の関数 copyA と copyB に対し、array.length を n とした時の時間計算量を求めなさい。

```javascript
class DynamicSizeArray {
  static INITIAL_SIZE = 4;

  constructor() {
    this.len = 0;
    this.array = makeFixedSizeArray(DynamicSizeArray.INITIAL_SIZE);
  }

  // ・・・

  push(value) {
    if (this.len >= this.array.length()) {
      const old = this.array;
      this.array = makeFixedSizeArray(old.length() * 2);
      for (let i = 0; i < this.len; i++) {
        this.array.set(i, old.get(i));
      }
    }
    this.array.set(this.len, value);
    this.len++;
  }
}
```

## 回答

push の平均時間計算量は O(1) である。

サイズがnになるまでのpush操作で、再配置に伴う合計の計算コストは以下のように計算できる

```plaintext
4 + 8 + ... + n/2 = n - 4 = O(n)
```

push の回数は n 回であるため、平均時間計算量は O(n) / n = O(1) となる。
