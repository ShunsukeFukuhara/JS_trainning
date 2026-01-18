// 1
console.log("nav 要素内のリンク (<a>):");
console.log(document.querySelectorAll("nav a"));
console.log("-----");

// 2
console.log("商品リスト (.product-list) 内の最初の商品 (.product-item):");
console.log(document.querySelector(".product-list .product-item"));
console.log("-----");

// 3
console.log("カートアイコンの画像 (<img>:)");
console.log(document.querySelector(".cart img"));
console.log("-----");

// 4
console.log("商品リスト (.product-list) 内の価格 (.price) を表示する要素:");
console.log(document.querySelectorAll(".product-list .price"));
console.log("-----");

// 5
console.log(
  "商品リスト (.product-list) 内の全ての商品 (.product-item) の画像 (<img>):"
);
console.log(document.querySelectorAll(".product-list .product-item img"));
console.log("-----");

// 6
console.log("検索バー (.search-bar) 内の検索ボタン (<button>):");
console.log(document.querySelector(".search-bar button"));
console.log("-----");

// 7
console.log("フッター (footer) 内のパラグラフ (<p>) 要素:");
console.log(document.querySelector("footer p"));
console.log("-----");

// 8
console.log("商品リスト (.product-list) 内の偶数番目の商品 (.product-item):");
console.log(
  document.querySelectorAll(".product-list .product-item:nth-child(even)")
);
console.log("-----");

// 9
console.log(
  "ヘッダー (header) 内のアカウントリンク (.account) の画像 (<img>):"
);
console.log(document.querySelector(".account img"));
console.log("-----");

// 10
console.log('ナビゲーションリンクのうち、"会社情報" のリンク:');
console.log(
  [...document.querySelectorAll("nav a")].find((a) =>
    a.textContent.includes("会社情報")
  )
);
console.log("-----");
