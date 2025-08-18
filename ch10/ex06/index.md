### 問題

エクスポートしないjsファイルを複数回importする場合、import文の前後やimport先のコードの実行順序はどうなりますか。実証コードを作成し、予想してから実行結果を確認しなさい。

### 実証コード

```javascript
const diceValue = Math.floor(Math.random() * 6) + 1;

console.log(`☆サイコロの目: ${diceValue}`);
```

```javascript
import("./my_class.js").then(() => {
  console.log("１:インポートされた");

  import("./my_class.js").then(() => {
    console.log("２:再度インポートされた");
  });
});
```

###　予想
☆ => 1 => ☆ => 2

### 実行結果

☆ => 1 => 2

モジュールは一度だけ評価されるため、2回目のインポートでは再評価されない。
