## 問題

Node で debugger 文を使ってデバッグする方法を調べなさい。

## 解答

Node.js で `debugger` 文を使ってデバッグするには、以下の手順を実行します。

1. **Node.js をインストール**: Node.js がインストールされていない場合は、公式サイトからインストールします。
2. **スクリプトを作成**: デバッグしたい JavaScript コードを含むファイルを作成します。例えば、`index.js` という名前のファイルを作成し、以下のようなコードを書きます。

```javascript
const add = (a, b) => {
  // eslint-disable-next-line no-debugger
  debugger; // デバッグポイント
  return a + b;
};
const result = add(2, 3);
console.log(result);
```

3. **Node.js をデバッグモードで実行**: コマンドラインで以下のコマンドを実行して、Node.js をデバッグモードで起動します。

```powershell
node inspect ch05/ex11
```

4. **デバッガーを使用**: デバッグモードで Node.js が起動したら、`debugger` 文が実行されると、実行が一時停止します。この状態で、以下のコマンドを使用してデバッグを行います。
5. **デバッグポイントに到達した時** `c` または `continue`: 実行を続けます。
