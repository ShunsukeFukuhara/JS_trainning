// 問題13.4 のfetchFirstFileSize および fetchSumOfFileSizes を async/await を使って書き直しなさい。

import * as fsPromises from "node:fs/promises";
import { join } from "node:path";

export const fetchFirstFileSize = async (path, callback) => {
  try {
    const files = await fsPromises.readdir(path);
    if (files.length === 0) {
      callback(null, null);
      return;
    }

    const stats = await fsPromises.stat(join(path, files[0]));
    callback(null, stats.size);
  } catch (err) {
    callback(err);
  }
};

export const fetchSumOfFileSizes = async (path, callback) => {
  try {
    const files = await fsPromises.readdir(path);
    let total = 0;
    for (const file of files) {
      const stats = await fsPromises.stat(join(path, file));
      total += stats.size;
    }

    callback(null, total);
  } catch (err) {
    callback(err);
  }
};
