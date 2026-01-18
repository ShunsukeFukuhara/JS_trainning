## 問題

eval は大変危険な関数である。以下の関数 set42 は与えられた文字列の変数に 42 を代入する。

```javascript
// このような関数は絶対に書いてはならない。
function set42(key) {
  eval(`${key} = 42;`);
}

// 例:
set42("hello");
console.log(hello); // 42
```

set42 に意図せぬ動作 (例: システムに負荷を与える、セキュリティの問題となる挙動を取る) を行わさせるにはどのような引数を与えればいいか答えなさい。
ただし実行時エラーが発生しない引数としなさい。

## 回答

### システムに負荷を与える

無限ループを実行するコードを入れる

```javascript
set42("while (true) console.log('あああああ'); const a");
```

### セキュリティの問題となる挙動を取る

外部のAPIを叩くコードを入れる

```javascript
set42(
  `(async () => {
    const zip = '1000001';
    const url = \`https://zipcloud.ibsnet.co.jp/api/search?zipcode=\${zip}\`;　
    // 悪意のあるサイトにアクセス
fetch(url)
.then(res => res.json())
.then(data => {
if (data.results) {
const result = data.results[0];
console.log(\`\${result.address1} \${result.address2} \${result.address3}\`);
} else {
console.log('該当なし:', data.message);
}
})
})(); const a`
);
// 実行結果: 東京都 千代区 千代田
```
