// エクスポートしないjsファイルを複数回importする場合、import文の前後やimport先のコードの実行順序はどうなりますか。実証コードを作成し、予想してから実行結果を確認しなさい。

import("./my_class.js").then(() => {
  console.log("１:インポートされた");

  import("./my_class.js").then(() => {
    console.log("２:再度インポートされた");
  });
});
