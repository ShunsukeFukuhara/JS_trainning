import { newHashTable } from "./index";

describe("newHashTable", () => {
  it("should add and get values", () => {
    const table = newHashTable(5);
    table.put("a", 1);
    table.put("b", 2);
    expect(table.get("a")).toBe(1);
    expect(table.get("b")).toBe(2);
    expect(table.size).toBe(2);
  });

  it("should overwrite value for existing key", () => {
    const table = newHashTable(5);
    table.put("a", 1);
    table.put("a", 100);
    expect(table.get("a")).toBe(100);
    expect(table.size).toBe(1);
  });

  it("should return undefined for missing key", () => {
    const table = newHashTable(5);
    expect(table.get("ｴｯﾎｴｯﾎ")).toBeUndefined();
  });

  it("should remove a key", () => {
    const table = newHashTable(5);
    table.put("a", 1);
    table.put("b", 2);
    table.remove("a");
    expect(table.get("a")).toBeUndefined();
    expect(table.get("b")).toBe(2);
    expect(table.size).toBe(1);
  });

  it("should do nothing when removing a missing key", () => {
    const table = newHashTable(5);
    table.put("a", 1);
    table.remove("notfound");
    expect(table.size).toBe(1);
    expect(table.get("a")).toBe(1);
  });

  it("should handle collisions with linked list", () => {
    // capacityを2に設定し3つの異なるキーを追加すると、鳩ノ巣原理で少なくとも1つ以上の衝突が発生する。
    const table = newHashTable(2);
    table.put("a", 1);
    table.put("b", 2);
    table.put("c", 3);

    expect(table.get("a")).toBe(1);
    expect(table.get("b")).toBe(2);
    expect(table.get("c")).toBe(3);
    expect(table.size).toBe(3);
  });

  it("should handle removing head and tail in collision list", () => {
    // ハッシュ衝突がある状態で、3つのキーを順次削除していってハッシュテーブルが整合的に動作するか確認
    // 3つのキーの順列を全て試す
    const perms = [
      [
        { key: "a", value: "1" },
        { key: "b", value: "2" },
        { key: "c", value: "3" },
      ],
      [
        { key: "b", value: "2" },
        { key: "a", value: "1" },
        { key: "c", value: "3" },
      ],
      [
        { key: "c", value: "3" },
        { key: "a", value: "1" },
        { key: "b", value: "2" },
      ],
      [
        { key: "a", value: "1" },
        { key: "c", value: "3" },
        { key: "b", value: "2" },
      ],
      [
        { key: "b", value: "2" },
        { key: "c", value: "3" },
        { key: "a", value: "1" },
      ],
      [
        { key: "c", value: "3" },
        { key: "b", value: "2" },
        { key: "a", value: "1" },
      ],
    ];

    perms.forEach((perm) => {
      const table = newHashTable(2);
      perm.forEach(({ key, value }) => table.put(key, value));

      table.remove(perm[0].key);
      expect(table.get(perm[0].key)).toBeUndefined();
      expect(table.get(perm[1].key)).toBe(perm[1].value);
      expect(table.get(perm[2].key)).toBe(perm[2].value);
      expect(table.size).toBe(perm.length - 1);

      table.remove(perm[2].key);
      expect(table.get(perm[0].key)).toBeUndefined();
      expect(table.get(perm[1].key)).toBe(perm[1].value);
      expect(table.get(perm[2].key)).toBeUndefined();

      table.remove(perm[1].key);
      expect(table.get(perm[0].key)).toBeUndefined();
      expect(table.get(perm[1].key)).toBeUndefined();
      expect(table.get(perm[2].key)).toBeUndefined();
      expect(table.size).toBe(0);
    });
  });

  it("should work with object values", () => {
    const table = newHashTable(3);
    table.put("obj", { foo: "bar" });
    expect(table.get("obj")).toEqual({ foo: "bar" });
  });

  it("should handle empty strings as keys", () => {
    const table = newHashTable(3);
    table.put("", "empty");
    expect(table.get("")).toBe("empty");
    expect(table.size).toBe(1);
  });

  it("should handle special characters in keys", () => {
    const table = newHashTable(3);
    table.put("key with space", "value with space");
    table.put("☺☺☺", "value with emoji");
    table.put("わにワニパﾆｯｸ陛下", "value with japanese");
    expect(table.get("key with space")).toBe("value with space");
    expect(table.get("☺☺☺")).toBe("value with emoji");
  });

  it("should error if key is not a string", () => {
    const table = newHashTable(3);
    expect(() => table.put(123, "value")).toThrow();
    expect(() => table.get(123)).toThrow();
    expect(() => table.remove(123)).toThrow();
    expect(() => table.put(null, "value")).toThrow();
    expect(() => table.get(null)).toThrow();
    expect(() => table.remove(null)).toThrow();
    expect(() => table.put(undefined, "value")).toThrow();
    expect(() => table.get(undefined)).toThrow();
    expect(() => table.remove(undefined)).toThrow();
  });
});
