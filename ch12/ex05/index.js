// 指定されたファイルパスを受け取り、そのファイルを改行コード \n の出現ごとに分割して返すジェネレータ関数 function* readLines(filePath) を作成しなさい。
// 取得できる文字列からは改行コードが除去されていること。
// ファイルの読み込みは一度にすべて読み込むのではなく、fs.openSync(), fs.readSync() を使って一定バッファサイズごとに読み込むようにし、必ず fs.closeSync() でファイルをクローズすること。
// また、利用者側のイテレータのループの途中で break したり throw された場合でも fs.closeSync() されるようにすること。
// 読み込まれるファイルは UTF-8 エンコーディングされたテキストファイルであると想定して良い。

import fs from "fs";

export function* readLines(filePath) {
  const fd = fs.openSync(filePath, "r");
  const bufferSize = 1024;
  const buffer = Buffer.alloc(bufferSize);
  let leftover = "";

  try {
    while (true) {
      const bytesRead = fs.readSync(fd, buffer, 0, bufferSize, null);
      if (bytesRead === 0) {
        // ファイルの終端に達した場合、残りのデータを返す
        if (leftover) {
          yield leftover;
        }
        break;
      }
      // 読み込んだデータを文字列に変換し、前回の残りと結合
      const chunk = leftover + buffer.toString("utf8", 0, bytesRead);
      // 改行で分割
      const lines = chunk.split("\n");
      // 最後の要素は次のチャンクの先頭になる可能性があるので保存
      leftover = lines.pop();
      for (const line of lines) {
        yield line;
      }
    }
  } finally {
    fs.closeSync(fd);
  }
}
