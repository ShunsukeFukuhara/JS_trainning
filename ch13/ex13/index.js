// 12 章の演習問題で実装した walk 関数の非同期ジェネレータ版を実装しなさい:

import fs from "fs";

export async function* walk(rootPath) {
  const stats = await fs.promises.stat(rootPath);
  yield { path: rootPath, isDirectory: stats.isDirectory() };

  if (stats.isDirectory()) {
    const entries = await fs.promises.readdir(rootPath);
    for (const entry of entries) {
      const fullPath = `${rootPath}/${entry}`;
      yield* walk(fullPath);
    }
  }
}
