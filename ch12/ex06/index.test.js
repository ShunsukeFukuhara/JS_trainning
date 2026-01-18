import { walk } from "./index.js";

// 指定されたディクトリ内のファイル/ディレクトリを再帰的に探索するジェネレータ関数 function* walk(rootPath) を作成しなさい。
// ファイルとディレクトリのみを考慮すれば良く、シンボリックリンクやブロックデバイスなどは無視して良い。
// fs モジュールの同期関数 (fs.xxxSync()) を利用すること。
// 取得できるデータは以下のプロパティを持つオブジェクトにすること。
// path: ファイル/ディレクトリのパス文字列
// isDirectory: ディレクトリであれば true, そうでなければ false

const basePath = "./ch12/ex06/test/"; // テストファイルのベースパス

describe("walk", () => {
  test("対象のファイルやディレクトリが全て網羅されている", () => {
    const result = Array.from(walk(basePath)).map((entry) => ({
      path: entry.path.replace(/\/+/g, "/"), // Windows対応のためパス区切りを統一
      isDirectory: entry.isDirectory,
    }));

    expect(result).toEqual(
      expect.arrayContaining([
        { path: `${basePath}`, isDirectory: true },
        { path: `${basePath}file1.txt`, isDirectory: false },
        { path: `${basePath}file2.txt`, isDirectory: false },
        { path: `${basePath}sub1`, isDirectory: true },
        { path: `${basePath}sub1/test3.txt`, isDirectory: false },
        { path: `${basePath}sub1/test4.txt`, isDirectory: false },
        { path: `${basePath}sub2`, isDirectory: true },
      ])
    );
  });

  test("存在しないファイルやディレクトリが入っていない", () => {
    const result = Array.from(walk(basePath)).map((entry) => ({
      path: entry.path.replace(/\/+/g, "/"), // Windows対応のためパス区切りを統一
      isDirectory: entry.isDirectory,
    }));

    expect(result.length).toBe(7);
  });

  test("存在しないディレクトリを指定した場合", () => {
    expect(() => {
      Array.from(walk("./nonexistent"));
    }).toThrow();
  });
});
