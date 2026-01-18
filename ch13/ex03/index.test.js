import {
  readdirPromise,
  readdirPromisify,
  statPromise,
  statPromisify,
} from "./index.js";

const basePath = "./ch13/ex03/"; // テストファイルのベースパス

describe("readdirPromise", () => {
  test("プロミスを使ってディレクトリの内容を読み取る", () => {
    readdirPromise(basePath, { encoding: "utf8" }).then((files) => {
      expect(files).toContain("index.js");
      expect(files).toContain("index.test.js");
    });
  });

  test("存在しないディレクトリを読み取ろうとするとエラーになる", () => {
    readdirPromise("./no-such-dir", { encoding: "utf8" }).catch((err) => {
      expect(err.constructor.name).toBe("Error");
    });
  });
});

describe("readdirPromisify", () => {
  test("promisify を使ってディレクトリの内容を読み取る", () => {
    readdirPromisify(basePath, { encoding: "utf8" }).then((files) => {
      expect(files).toContain("index.js");
      expect(files).toContain("index.test.js");
    });
  });

  test("存在しないディレクトリを読み取ろうとするとエラーになる", () => {
    readdirPromisify("./no-such-dir", { encoding: "utf8" }).catch((err) => {
      expect(err.constructor.name).toBe("Error");
    });
  });
});

describe("statPromise", () => {
  test("プロミスを使ってファイルの情報を取得する", () => {
    statPromise(basePath + "index.js").then((stats) => {
      expect(stats.isFile()).toBe(true);
      expect(stats.size).toBeGreaterThan(0);
      expect(stats.mtime.constructor.name).toBe("Date");
    });
  });

  test("存在しないファイルの情報を取得しようとするとエラーになる", () => {
    statPromise("no-such-file.txt").catch((err) => {
      expect(err.constructor.name).toBe("Error");
    });
  });
});

describe("statPromisify", () => {
  test("promisify を使ってファイルの情報を取得する", () => {
    statPromisify(basePath + "index.js").then((stats) => {
      expect(stats.isFile()).toBe(true);
      expect(stats.size).toBeGreaterThan(0);
      expect(stats.mtime.constructor.name).toBe("Date");
    });
  });

  test("存在しないファイルの情報を取得しようとするとエラーになる", () => {
    statPromisify("no-such-file.txt").catch((err) => {
      expect(err.constructor.name).toBe("Error");
    });
  });
});
