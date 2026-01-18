// Shift_JIS で保存されたテキストファイル hello.txt を読み込み、文字化けしないようにコンソールに表示しなさい。
// ライブラリiconv-liteを使用してよい。

import fs from "fs/promises";
import iconv from "iconv-lite";

const filePath = "ex04/hello.txt";

const readFileWithShiftJIS = async (path) => {
  const buffer = await fs.readFile(path);
  return iconv.decode(buffer, "shift_jis");
};

(async () => {
  const content = await readFileWithShiftJIS(filePath);
  console.log(content);
})();
