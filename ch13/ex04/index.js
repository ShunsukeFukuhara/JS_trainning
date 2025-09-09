// 以下の 2 つの関数を node:fs/promises を利用し Promise を返す関数に書き換えなさい

import * as fsPromises from "node:fs/promises";
import { join } from "node:path";

export const fetchFirstFileSize = (path, callback) => {
  fsPromises
    .readdir(path)
    .then((files) => {
      if (files.length === 0) {
        callback(null, null);
        return;
      }
      return fsPromises.stat(join(path, files[0]));
    })
    .then((stats) => {
      if (!stats) return;
      callback(null, stats.size);
    })
    .catch((err) => {
      callback(err);
    });
};

export const fetchSumOfFileSizes = (path, callback) => {
  fsPromises
    .readdir(path)
    .then((files) => {
      let total = 0;
      const rest = [...files];

      function iter() {
        if (rest.length === 0) {
          callback(null, total);
          return;
        }

        const next = rest.pop();
        fsPromises
          .stat(join(path, next))
          .then((stats) => {
            total += stats.size;
            iter();
          })
          .catch((err) => {
            callback(err);
          });
      }

      iter();
    })
    .catch((err) => {
      callback(err);
    });
};
