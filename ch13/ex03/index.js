//以下の関数の Promise 版を、Promiseコンストラクタ による変換および promisify 関数による変換、それぞれで作成しなさい:
//fs.readdir
//fs.stat

import * as fs from "node:fs";
import { promisify } from "node:util";

export const readdirPromise = (path, options) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, options, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(files);
    });
  });
};

export const statPromise = (path) => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stats);
    });
  });
};

export const readdirPromisify = (path, options) => {
  return promisify(fs.readdir)(path, options);
};

export const statPromisify = (path) => {
  return promisify(fs.stat)(path);
};
