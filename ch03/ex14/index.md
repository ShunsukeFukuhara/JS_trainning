### 以下のコードを実行するとどのように表示されるか予想した後で実行しなさい。

1.予想
100
100

2.結果
0
1
2
3
4
5
6
7
8
9
file:///C:/Users/r00528148/JS%E7%A0%94%E4%BF%AE/ch03/ex14/index.js:8
console.log(i);
^

ReferenceError: i is not defined

### なぜそのような実行結果になったのか説明しなさい。

for文と関数内とforの外側でiがそれぞれ異なるスコープで定義されているため。
function内で定義されたiはfunction内でのみ有効で、for文のiはfor文のスコープ内でのみ有効。
また、for文のスコープ外で未定義のiを参照するとReferenceErrorが発生する。

### また、コード内の全ての let を var に変えた場合と、全ての let を消した場合 (非 strict モードでのみ実行可能) ではどうなるでしょうか。それら結果の理由についても説明しなさい。

1. コード内の全ての let を var に変えた場合
   結果:
   0
   1
   2
   3
   4
   5
   6
   7
   8
   9
   10

   理由:
   letをvarに変更するとスコープが関数全体になるため、for文内部で定義したiがfor文の外でも有効になるため、for文の後ろのconsole.log(i)で10が出力可能となる

2. 全ての let を消した場合([ブラウザツール](https://paiza.io/projects/ZwPesQRay5n7MW2vKVp5oQ?language=javascript)で実行)
   結果:
   100
   101

   理由:
   iがグローバルスコープになったことで、for文内部のfunctionで100が代入される。その後、次のループの最初でインクリメントされた状態でループを抜けたことで、iは101で最後に出力された
