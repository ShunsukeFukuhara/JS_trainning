## 問題

15.4-10.11 では #/ や #/active といった URL を利用した。
少し昔だとこのような URL は #!/ や #!/active と ! を付けることもあった (もしかしたら職場でそのようなコードを見るかもしれない)。
このような形式を当時は hashbang と呼んだ。どうしてこのようなスタイルが存在したのだろうか。

## 解答

問題のようにURLに#!を使うスタイルは、Hashbangと呼ばれている。
当時の検索エンジンはJavaScriptを実行できなかったため、AJAXで動的にコンテンツを読み込むようなWebアプリケーションは検索エンジンに正しくインデックスされない問題があった。
Googleはこの問題を解決するために、AJAX Crawling Schemeという仕様を提案した。

[GoogleによるAJAX Crawling Schemeの提案](https://developers.google.com/search/blog/2009/10/proposal-for-making-ajax-crawlable?_gl=1*1ulp30f*_up*MQ..*_ga*NTczNDgxMzQ1LjE3NjMzMDYyNjc.*_ga_SM8HXJ53K2*czE3NjMzMDYyNjYkbzEkZzAkdDE3NjMzMDYyNjYkajYwJGwwJGgw)

この仕様では、URLに#!を含めることで、そのURLがAJAXで動的に生成されるコンテンツを指していることを示す。
検索エンジンのクローラーは、#!を?_escaped_fragment_=に置き換えたURLにアクセスし、そのURLに対応する静的なHTMLスナップショットを取得することで、AJAXコンテンツをインデックスできるようにした。

例えば、URLがhttp://example.com/#!/page1の場合、クローラーはhttp://example.com/?_escaped_fragment_=page1にアクセスする。
この仕様により、AJAXを利用したWebアプリケーションも検索エンジンにインデックスされやすくなった。

しかし、現在では検索エンジンはJavaScriptを実行できるようになった。2009年にGoogleが提案したAJAX Crawling Schemeはもはや必要なくなり、2015年にGoogleはこの仕様の非推奨を発表した。

[GoogleによるAJAX Crawling Schemeの非推奨のお知らせ](https://developers.google.com/search/blog/2015/10/deprecating-our-ajax-crawling-scheme?hl=ja)

そのため、現在では#!を使う必要はなくなり、単に#/や/activeのようなURLを使うことが一般的である。
