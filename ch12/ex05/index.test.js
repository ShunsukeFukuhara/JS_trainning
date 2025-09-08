import { readLines } from "./index.js";
import fs from "fs";
import { jest } from "@jest/globals";

const basePath = "./ch12/ex05/"; // テストファイルのベースパス

describe("readLines", () => {
  test("基本のケース", () => {
    const lines = Array.from(readLines(basePath + "test.txt"));
    expect(lines).toEqual(["line1", "line2", "line3"]);
  });

  test("空ファイルのケース", () => {
    const lines = Array.from(readLines(basePath + "empty.txt"));
    expect(lines).toEqual([]);
  });

  test("改行で終わるファイルのケース", () => {
    const lines = Array.from(readLines(basePath + "newline_end.txt"));
    expect(lines).toEqual(["line1", "line2", "line3"]);
  });

  test("大きなファイルで結果が正しい", () => {
    const lines = Array.from(readLines(basePath + "large_file.txt"));
    expect(lines.length).toBe(10000); // 10000行あることを期待
    expect(lines[0]).toBe("こんにちは最初");
    expect(lines[9999]).toBe("こんにちは10000行目！");
  });

  test("大きなファイルのケースで、バッファ分割がきちんとできている", () => {
    const readSyncMock = jest.spyOn(fs, "readSync");

    Array.from(readLines(basePath + "large_file.txt"));

    // fs.readSyncが複数回呼ばれていることを確認
    //プロパティで160kBあるので、おおよそ150回以上呼ばれているはず
    expect(readSyncMock.mock.calls.length).toBeGreaterThan(150);
    readSyncMock.mockRestore();
  });

  test("バッファサイズを超える行のケース", () => {
    const lines = Array.from(readLines(basePath + "long_lines.txt"));
    expect(lines).toEqual([
      "This is a very long line that exceeds the buffer size of 1024 bytes. "
        .repeat(20)
        .trim(),
      "Another long line that also exceeds the buffer size. ".repeat(20).trim(),
    ]);
  });

  test("途中でbreakするケース", () => {
    const iterator = readLines(basePath + "test.txt");
    const lines = [];
    for (const line of iterator) {
      lines.push(line);
      if (line === "line2") {
        break;
      }
    }
    expect(lines).toEqual(["line1", "line2"]);
  });

  test("途中でthrowするケース", () => {
    const iterator = readLines(basePath + "test.txt");
    const lines = [];
    try {
      for (const line of iterator) {
        lines.push(line);
        if (line === "line2") {
          throw new Error("Test error");
        }
      }
    } catch (e) {
      expect(e.message).toBe("Test error");
    }
    expect(lines).toEqual(["line1", "line2"]);
  });
});
