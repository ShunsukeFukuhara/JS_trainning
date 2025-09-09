import { fetchFirstFileSize, fetchSumOfFileSizes } from "./index.js";

const basePath = "./ch13/ex04/"; // テストファイルのベースパス

const rightPath = basePath + "test/";
const emptyPath = basePath + "empty/";
const wrongPath = basePath + "not_exist/";

describe("fetchFirstFileSize", () => {
  test("エラーを返す場合", (done) => {
    fetchFirstFileSize(wrongPath, (err, size) => {
      expect(err.constructor.name).toBe("Error");
      expect(size).toBeUndefined();
      done();
    });
  });

  test("空ディレクトリの場合", (done) => {
    fetchFirstFileSize(emptyPath, (err, size) => {
      expect(err).toBeNull();
      expect(size).toBeNull();
      done();
    });
  });

  test("最初のファイルのサイズを返す", (done) => {
    fetchFirstFileSize(rightPath, (err, size) => {
      expect(err).toBeNull();
      expect(size).toBeGreaterThan(1500);
      expect(size).toBeLessThan(2000);
      done();
    });
  });
});

describe("fetchSumOfFileSizes", () => {
  test("エラーを返す場合", (done) => {
    fetchSumOfFileSizes(wrongPath, (err, total) => {
      expect(err.constructor.name).toBe("Error");
      expect(total).toBeUndefined();
      done();
    });
  });

  test("空ディレクトリの場合", (done) => {
    fetchSumOfFileSizes(emptyPath, (err, total) => {
      expect(err).toBeNull();
      expect(total).toBe(0);
      done();
    });
  });

  test("複数ファイルのサイズを合計する", (done) => {
    fetchSumOfFileSizes(rightPath, (err, total) => {
      expect(err).toBeNull();
      expect(total).toBeGreaterThan(3000);
      expect(total).toBeLessThan(3500);
      done();
    });
  });

  test("stat がエラーを返す場合", (done) => {
    fetchSumOfFileSizes(wrongPath, (err, total) => {
      expect(err.constructor.name).toBe("Error");
      expect(total).toBeUndefined();
      done();
    });
  });
});
