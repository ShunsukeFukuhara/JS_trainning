// 問題13.4 のfetchSumOfFileSizes を Promise.all を使って書き換え、ディレクトリ内のファイルサイズを同時並行で取得するようにしなさい。
// 注意: Promise.all を使う時は注意すること (例えば Web API の呼び出しを並行に実行すると、数次第で何らかのエラーに繋がる可能性がある)

import * as fsPromises from "node:fs/promises";
import { join } from "node:path";

export const fetchSumOfFileSizes = async (path, callback) => {
  try {
    const files = await fsPromises.readdir(path);
    const total = await Promise.all(
      // files の各要素に対して非同期処理を実行し、サイズの配列を取得
      files.map(async (file) => {
        const stats = await fsPromises.stat(join(path, file));
        return stats.size;
      })
    )
      // サイズの配列を合計
      .then((sizes) => sizes.reduce((a, b) => a + b, 0));

    callback(null, total);
  } catch (err) {
    callback(err);
  }
};
