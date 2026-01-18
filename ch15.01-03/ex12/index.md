## 問題

この章で学んだ知識を使って自分にとって役に立つブックマークレットを作成しなさい。

## 解答

npmのサイトからインストールコマンドをコピーするブックマークレットを作成した。

```javascript
javascript: (function () {
  const name = document.querySelector("h2").innerText.trim();
  const command = `npm install ${name}`;
  navigator.clipboard.writeText(command).then(() => {
    alert(`コピーしました:\n${command}`);
  });
})();
```
