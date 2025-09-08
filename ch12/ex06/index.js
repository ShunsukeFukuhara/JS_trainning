// 指定されたディクトリ内のファイル/ディレクトリを再帰的に探索するジェネレータ関数 function* walk(rootPath) を作成しなさい。
// ファイルとディレクトリのみを考慮すれば良く、シンボリックリンクやブロックデバイスなどは無視して良い。

import fs from "fs";

export function* walk(rootPath) {
  const stats = fs.statSync(rootPath);
  yield { path: rootPath, isDirectory: stats.isDirectory() };
  if (stats.isDirectory()) {
    const entries = fs.readdirSync(rootPath);
    for (const entry of entries) {
      const fullPath = `${rootPath}/${entry}`;
      yield* walk(fullPath);
    }
  }
}
