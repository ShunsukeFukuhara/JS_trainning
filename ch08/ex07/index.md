## 問題

https://www.ricoh.co.jp を開き、ロードされている js ファイル中で名前空間としての関数の即時関数実行式を使っている js ファイルを 1 つ以上見つけて URL を記載しなさい。

## 回答

https://www.ricoh.co.jp/-/Media/Ricoh/Common/cmn_v2/js/globalnavi.js

global.js の中で名前空間としての関数の即時関数実行式を使っている。

```javascript
(function($) {
    ...
    })(jQuery);
```

このコードはIIFEを使用し、引数として jQuery を渡し、内部では $ という名前で利用できるようにしている。
