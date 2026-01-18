import {
  nestedUnwritableObj,
  unwritableAndUnconfigurableObj,
  writableAndUnconfigurableObj,
} from "./index.js";

test("Unwritable and unconfigurable object", () => {
  const a = unwritableAndUnconfigurableObj();
  expect(a).toStrictEqual({ a: 1 });
  expect(() => (a.a = 3)).toThrow(); // 書込不可
  expect(() => delete a.a).toThrow(); // 削除不可
});

test("Writable and unconfigurable object", () => {
  const b = writableAndUnconfigurableObj();
  expect(b).toStrictEqual({ b: 2 });
  b.b = 3; // 書込可
  expect(b.b).toBe(3); // 書込可
  expect(() => delete b.b).toThrow(); // 削除不可
});

test("Nested unwritable object", () => {
  const c = nestedUnwritableObj();
  expect(c).toStrictEqual({ c: { d: { e: 3 } } }); // オブジェクトの構造はそのまま
  expect(() => (c.f = 1)).toThrow(); // 最上位のオブジェクトは書込不可
  expect(() => (c.c.f = 1)).toThrow(); // ネストされたオブジェクトも書込不可
  expect(() => (c.c.d.f = 1)).toThrow(); // ネストされたオブジェクトも書込不可
  expect(() => (c.c.d.e.f = 1)).toThrow(); // 最下位のプリミティブ値も書込不可
});
