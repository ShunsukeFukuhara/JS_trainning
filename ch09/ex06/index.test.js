import { TypedMap } from "./index.js";

describe("TypedMap", () => {
  it("setで正しい型のキーと値を追加できる", () => {
    const map = new TypedMap("string", "number");
    map.set("key1", 42);
    expect(map.get("key1")).toBe(42);
  });

  it("setで不正な型のキーを追加するとエラーが発生する", () => {
    const map = new TypedMap("string", "number");
    expect(() => map.set(123, 42)).toThrow(TypeError);
  });

  it("setで不正な型の値を追加するとエラーが発生する", () => {
    const map = new TypedMap("string", "number");
    expect(() => map.set("key1", "not a number")).toThrow(TypeError);
  });

  it("getで存在するキーの値を取得できる", () => {
    const map = new TypedMap("string", "number", [["key1", 42]]);
    expect(map.get("key1")).toBe(42);
  });

  it("getで存在しないキーの値を取得するとundefinedを返す", () => {
    const map = new TypedMap("string", "number");
    expect(map.get("nonexistent")).toBeUndefined();
  });

  it("hasで存在するキーを確認できる", () => {
    const map = new TypedMap("string", "number", [["key1", 42]]);
    expect(map.has("key1")).toBe(true);
  });

  it("hasで存在しないキーを確認するとfalseを返す", () => {
    const map = new TypedMap("string", "number");
    expect(map.has("nonexistent")).toBe(false);
  });

  it("entriesで全てのキーと値のペアを取得できる", () => {
    const map = new TypedMap("string", "number", [
      ["key1", 42],
      ["key2", 100],
    ]);
    const entries = Array.from(map.map.entries());
    expect(entries).toEqual([
      ["key1", 42],
      ["key2", 100],
    ]);
  });

  it("clearで全てのエントリを削除できる", () => {
    const map = new TypedMap("string", "number", [["key1", 42]]);
    map.clear();
    expect(map.map.size).toBe(0);
  });

  it("deleteで存在するキーのエントリを削除できる", () => {
    const map = new TypedMap("string", "number", [["key1", 42]]);
    map.delete("key1");
    expect(map.map.has("key1")).toBe(false);
  });

  it("deleteで存在しないキーのエントリを削除するとfalseを返す", () => {
    const map = new TypedMap("string", "number");
    expect(map.delete("nonexistent")).toBe(false);
  });

  it("sizeでマップのエントリ数を取得できる", () => {
    const map = new TypedMap("string", "number", [
      ["key1", 42],
      ["key2", 100],
    ]);
    expect(map.size).toBe(2);
  });
});
