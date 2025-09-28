## 問題

index.html ファイル内の script タグから type="module" 属性を削除した場合、期待通り動作させるにはどうすべきか答えなさい。

## 解答

type="module" 属性を削除した場合、JavaScript ファイルはモジュールとしてではなく、通常のスクリプトとして扱われる。
そのため、期待通り動作させるには以下のようにdocument.addEventListener('DOMContentLoaded', ...)を使用して、DOMが完全に読み込まれた後にコードを実行するようにする必要がある。

```javascript
document.addEventListener("DOMContentLoaded", () => {
  // 実装は同じ
});
```
