### 問題

以下のページに対応する sets.cjs、stats.cjs、index.cjs を書き写して作成し、それらを Webpack で mode を none、developemnt、production のそれぞれでバンドルし、各結果が、p.276 の上のコードに対してどの様な差異があるかを、それぞれ 1 行程度で記述しなさい。

### 回答

- none: module.exportsを使ってエクスポートするCommonJS形式で、バンドルされたコードは、各ファイルのソースコードをそのまま結合したもの。
- development: none版と同じCommonJS形式だが、各モジュールをeval()で実行している
- production: none版と同じCommonJS形式だが、各モジュールは関数にラップされ、コードが圧縮されているため、ファイルサイズが小さくなっている。
