### 問題

自分が運営する販売サイトに YouTube のトップページを iframe で組込み、更に自作の script.js により iframe 内のデータを分析しようとしています。

```html
<iframe id="other" src="https://www.youtube.com/"></iframe>
<script src="./script.js"></script>
...
```

```javascript
async () => {
  // YouTubeが利用者に推薦する動画タイトルを取得すれば、利用者に最適な商品セットを表示できるのではないか？
  const titles = document
    .getElementById("other")
    .contentWindowquerySelectorAll("#video-title");
  for (const t of titles) {
    await fetch("your-server-path", { method: "POST", body: t.textContent });
  }
};
```

しかし、トップページを読み込むとエラーになります。用語「クリックジャッキング」を調べて理由を説明しなさい。
また、script.js も動作しません。ここで、同一オリジンポリシーがなく、iframe 内の他サイトの DOM 変更が可能な仕様を想定し、どのような重大な問題が発生しうるか記載しなさい。

## 回答

クリックジャッキングとは、悪意のあるサイトが透明なレイヤーを使って、ユーザーに別のサイトのボタンやリンクをクリックさせる攻撃手法である。
これにより、ユーザーは意図しない操作を行い、個人情報の漏洩や不正な取引が発生する可能性がある。

もしここで、同一オリジンポリシーがなく、iframe 内の他サイトの DOM 変更が可能な仕様であった場合、以下のような攻撃が予想される。

- iframeに特定のサイトのログイン画面を表示し、ユーザーがログイン情報を入力するよう誘導する。その上に透明なレイヤーを重ね、ユーザーが入力した情報をスキミングする。
- iframe内のフォームにユーザーが入力した情報を盗み出し、悪意のあるサーバーに送信する。
- iframe内のリンクをクリックさせ、ユーザーをフィッシングサイトに誘導する。
- iframe内のスクリプトを操作し、ユーザーのブラウザでマルウェアをダウンロードさせる。
