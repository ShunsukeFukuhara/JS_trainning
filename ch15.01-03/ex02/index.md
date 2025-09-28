## 問題

ブラウザで動的なスクリプトのインポート (await import(url)) が出来ることを試しなさい。
適当な HTML ページを作成し、その中で以下のコードを実行してページ内のテキストの色が赤になることを確認しなさい。
またその動作確認方法を文書で記述しなさい。

```javascript
const { $ } = await import(
  "https://releases.jquery.com/git/jquery-git.module.min.js"
);
$("*").css("color", "red");
```

## 解答

動的なスクリプトのインポートを試すために、以下のような HTML ファイルを作成。

```html
<!DOCTYPE html charset="utf-8">
<html lang="ja">
  <head>
    <title>Simple ToDo</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <script type="module">
      const { $ } = await import(
        "https://releases.jquery.com/git/jquery-git.module.min.js"
      );
      $("*").css("color", "red");
    </script>
  </head>
  <body>
    <p>テキストの色が赤くなれば成功</p>
  </body>
</html>
```

これをindex.htmlとして保存し、ブラウザで開くと、ページ内のテキストが赤く表示されることを確認できる。
